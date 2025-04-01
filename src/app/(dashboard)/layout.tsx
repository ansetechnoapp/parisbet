'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import { useUserStore } from '@/lib/store';
import { toast } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Check if user is admin
      const userIsAdmin = isAdmin(session.user);
      setIsUserAdmin(userIsAdmin);

      // If trying to access admin routes without being admin, redirect to home
      const isAdminRoute = pathname.startsWith('/Overview') || 
                          pathname.startsWith('/matchesAdmin') || 
                          pathname.startsWith('/ticketsAdmin') || 
                          pathname.startsWith('/ticketsListAdmin') || 
                          pathname.startsWith('/lottoAdmin') || 
                          pathname.startsWith('/users') || 
                          pathname.startsWith('/transactions');

      if (isAdminRoute && !userIsAdmin) {
        router.push('/');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/auth/login');
    }
  }, [router, pathname]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    try {
      await useUserStore.getState().logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error("Erreur lors de la déconnexion", {
        description: "Veuillez réessayer"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Only show admin navigation items if user is admin
  const navItems = isUserAdmin ? [
    { path: '/Overview', label: 'Aperçu', icon: 'chart-pie' },
    { path: '/matchesAdmin', label: 'Matchs', icon: 'football' },
    { path: '/ticketsAdmin', label: 'Tickets', icon: 'ticket' },
    { path: '/ticketsListAdmin', label: 'Liste des tickets', icon: 'list' },
    { path: '/lottoAdmin', label: 'Loto', icon: 'lottery' },
    { path: '/users', label: 'Utilisateurs', icon: 'users' },
    { path: '/transactions', label: 'Transactions', icon: 'wallet' },
  ] : [];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div
        className={`bg-white shadow-lg ${collapsed ? 'w-16' : 'w-64'
          } transition-all duration-300 hidden md:block`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`text-xl font-bold text-green-600 ${collapsed ? 'hidden' : 'block'}`}>
            Afribet Admin
          </h1>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {collapsed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center py-3 px-4 ${pathname === item.path
                ? 'bg-green-50 text-green-600 border-r-4 border-green-600'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <span className="mr-3">
                <SidebarIcon name={item.icon} />
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={`flex items-center py-3 px-4 w-full text-left text-red-600 hover:bg-red-50 mt-auto`}
          >
            <span className="mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
              </svg>
            </span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </nav>
      </div>

      {/* Mobile header and menu */}
      <div className="md:hidden bg-white w-full shadow-md">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-xl font-bold text-green-600">Afribet</h1>
          <button
            className="text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 flex">
            <div className="bg-white w-64 h-full overflow-y-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h1 className="text-xl font-bold text-green-600">Afribet Admin</h1>
                <button
                  className="text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="mt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center py-3 px-4 ${pathname === item.path
                      ? 'bg-green-50 text-green-600 border-l-4 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="mr-3">
                      <SidebarIcon name={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center py-3 px-4 w-full text-left text-red-600 hover:bg-red-50 mt-4 border-t"
                >
                  <span className="mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-6">
        {children}
      </div>
    </div>
  );
}

// Simple icon component to render different icons based on name
function SidebarIcon({ name }: { name: string }) {
  switch (name) {
    case 'chart-pie':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
        </svg>
      );
    case 'football':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
    case 'ticket':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM13 8a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      );
    case 'list':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'lottery':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
        </svg>
      );
    case 'users':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      );
    case 'wallet':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
}