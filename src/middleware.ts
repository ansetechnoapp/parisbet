import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Vérifier la session
  const { data: { session } } = await supabase.auth.getSession();
  const { pathname } = request.nextUrl;

  // Pour les routes d'authentification (login/register)
  if (pathname.startsWith('/auth/')) {
    // Si l'utilisateur est déjà connecté, le rediriger vers la page d'accueil
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return response;
  }

  // Pour les routes protégées
  if (pathname.startsWith('/Overview') || 
      pathname.startsWith('/matchesAdmin') || 
      pathname.startsWith('/ticketsAdmin') || 
      pathname.startsWith('/ticketsListAdmin') || 
      pathname.startsWith('/lottoAdmin') || 
      pathname.startsWith('/users') || 
      pathname.startsWith('/transactions')) {
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Vérifier si l'utilisateur est admin
    const isAdmin = session.user.user_metadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Pour les routes du dashboard utilisateur
  if (pathname.startsWith('/user-dashboard/')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Ajouter les en-têtes de sécurité
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session?.user?.id || '');
  requestHeaders.set('x-user-role', session?.user?.user_metadata?.role || '');

  // Mettre à jour la réponse avec les en-têtes
  response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: [
    '/auth/:path*',
    '/Overview/:path*',
    '/matchesAdmin/:path*',
    '/ticketsAdmin/:path*',
    '/ticketsListAdmin/:path*',
    '/lottoAdmin/:path*',
    '/users/:path*',
    '/transactions/:path*',
    '/user-dashboard/:path*'
  ]
};