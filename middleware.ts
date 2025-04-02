import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Vérifier si l'utilisateur est authentifié
  if (!session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Vérifier les rôles de l'utilisateur pour les routes protégées
  const { pathname } = req.nextUrl;

  // Routes administratives
  if (pathname.startsWith('/Overview') || 
      pathname.startsWith('/admin') || 
      pathname.startsWith('/matchesAdmin') || 
      pathname.startsWith('/ticketsAdmin') || 
      pathname.startsWith('/ticketsListAdmin') || 
      pathname.startsWith('/lottoAdmin') || 
      pathname.startsWith('/users') || 
      pathname.startsWith('/transactions') || 
      pathname.startsWith('/roles')) {
    
    // Vérifier si l'utilisateur a le rôle admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles (name)')
      .eq('user_id', session.user.id)
      .single();

    const isAdmin = userRoles?.roles?.name === 'admin' || session.user.user_metadata?.role === 'admin';

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/user-dashboard', req.url));
    }
  }

  // Routes utilisateur standard
  if (pathname.startsWith('/user-dashboard')) {
    // Vérifier si l'utilisateur est un admin
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles (name)')
      .eq('user_id', session.user.id)
      .single();

    const isAdmin = userRoles?.roles?.name === 'admin' || session.user.user_metadata?.role === 'admin';

    // Si c'est un admin, le rediriger vers le dashboard admin
    if (isAdmin) {
      return NextResponse.redirect(new URL('/Overview', req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/Overview/:path*',
    '/admin/:path*',
    '/matchesAdmin/:path*',
    '/ticketsAdmin/:path*',
    '/ticketsListAdmin/:path*',
    '/lottoAdmin/:path*',
    '/users/:path*',
    '/transactions/:path*',
    '/roles/:path*',
    '/user-dashboard/:path*',
  ],
}; 