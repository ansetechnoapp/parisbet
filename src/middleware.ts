import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { UserRole } from './types/database';

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

  // Handle auth routes first (login, register)
  if (pathname.startsWith('/auth/')) {
    // If user is already logged in and trying to access auth pages
    if (session) {
      // Redirect to home or appropriate dashboard based on role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('roles (name)')
        .eq('user_id', session.user.id)
        .single();

      const userRole = userRoles?.roles?.name;
      const isAdmin = userRole === 'admin' || session.user.user_metadata?.role === 'admin';

      if (isAdmin) {
        return NextResponse.redirect(new URL('/Overview', request.url));
      } else if (userRole === 'moderator') {
        return NextResponse.redirect(new URL('/moderator', request.url));
      } else if (userRole === 'premium_user') {
        return NextResponse.redirect(new URL('/premium', request.url));
      } else {
        return NextResponse.redirect(new URL('/user-dashboard', request.url));
      }
    }

    // If not logged in and accessing auth pages, allow access
    return response;
  }

  // Handle protected routes
  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session) {
    if (
      pathname.startsWith('/Overview') ||
      pathname.startsWith('/matchesAdmin') ||
      pathname.startsWith('/ticketsAdmin') ||
      pathname.startsWith('/ticketsListAdmin') ||
      pathname.startsWith('/lottoAdmin') ||
      pathname.startsWith('/users') ||
      pathname.startsWith('/transactions') ||
      pathname.startsWith('/user-dashboard') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/moderator') ||
      pathname.startsWith('/premium')
    ) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Si ce n'est pas une route protégée, laisser passer
    return response;
  }

  // Si l'utilisateur est connecté
  if (session) {
    console.log('Middleware - Session User ID:', session.user.id);
    
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        role_id,
        roles (
          id,
          name,
          permissions
        )
      `)
      .eq('user_id', session.user.id)
      .single() as { data: UserRole | null; error: Error | null };

    console.log('Middleware - User Roles Error:', rolesError);
    console.log('Middleware - User Roles Data:', userRoles);

    if (rolesError) {
      console.error('Middleware - Error fetching roles:', rolesError);
      return NextResponse.redirect(new URL('/error', request.url));
    }

    const userRole = userRoles?.roles?.name;
    console.log('Middleware - User Role:', userRole);
    const isAdmin = userRole === 'admin';
    console.log('Middleware - Is Admin:', isAdmin);
    console.log('Middleware - Current Path:', pathname);

    // Si aucun rôle n'est trouvé, rediriger vers une page d'erreur
    if (!userRole) {
      console.error('Middleware - No role found for user');
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Redirection basée sur le rôle pour les routes par défaut
    if (pathname === '/user-dashboard') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/Overview', request.url));
      } else if (userRole === 'moderator') {
        return NextResponse.redirect(new URL('/moderator', request.url));
      } else if (userRole === 'premium_user') {
        return NextResponse.redirect(new URL('/premium', request.url));
      }
    }

    // Protection des routes administratives
    if (
      (pathname.startsWith('/Overview') ||
       pathname.startsWith('/matchesAdmin') ||
       pathname.startsWith('/ticketsAdmin') ||
       pathname.startsWith('/ticketsListAdmin') ||
       pathname.startsWith('/lottoAdmin') ||
       pathname.startsWith('/users') ||
       pathname.startsWith('/transactions')) && !isAdmin
    ) {
      console.log('Middleware - Unauthorized access attempt to admin route');
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Protection des routes modérateur
    if (pathname.startsWith('/moderator') && !['admin', 'moderator'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Protection des routes premium
    if (pathname.startsWith('/premium') && !['admin', 'premium_user'].includes(userRole)) {
      return NextResponse.redirect(new URL('/pricing', request.url));
    }
  }

  // Ajouter les en-têtes de sécurité
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', session?.user?.id || '');

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
    '/user-dashboard/:path*',
    '/admin/:path*',
    '/moderator/:path*',
    '/premium/:path*'
  ]
};