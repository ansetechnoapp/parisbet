'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { isAdmin } from '@/lib/auth';
import {
  HomeIcon,
  TicketIcon,
  DumbbellIcon,
  WalletIcon,
  UserIcon,
  LogOutIcon,
  BellIcon
} from 'lucide-react';
import UserNotifications from '@/components/UserNotifications';
import { useUserStore } from '@/lib/store';
import { toast } from 'sonner';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
      console.log('Session:', session);
      // Si l'utilisateur est admin, le rediriger vers l'espace admin
      const userIsAdmin = await isAdmin(session.user);
      if (userIsAdmin) {
        router.push('/Overview');
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/auth/login');
    }
  }, [router]);

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

  // Navigation pour les utilisateurs
  const navItems = [
    { path: '/user-dashboard', label: 'Tableau de bord', icon: <HomeIcon className="h-5 w-5" /> },
    { path: '/user-dashboard/tickets', label: 'Mes tickets', icon: <TicketIcon className="h-5 w-5" /> },
    { path: '/user-dashboard/bets', label: 'Mes paris', icon: <DumbbellIcon className="h-5 w-5" /> },
    { path: '/user-dashboard/wallet', label: 'Mon portefeuille', icon: <WalletIcon className="h-5 w-5" /> },
    { path: '/user-dashboard/activity', label: 'Activités', icon: <BellIcon className="h-5 w-5" /> },
    { path: '/user-dashboard/profile', label: 'Mon profil', icon: <UserIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div
        className={`bg-white shadow-lg ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 hidden md:block`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`text-xl font-bold text-green-600 ${collapsed ? 'hidden' : 'block'}`}>
            Afribet
          </h1>
          <div className="flex items-center space-x-2">
            <UserNotifications />
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
              <span className="mr-3">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center py-3 px-4 w-full text-left text-red-600 hover:bg-red-50 mt-auto"
          >
            <span className="mr-3">
              <LogOutIcon className="h-5 w-5" />
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
                <h1 className="text-xl font-bold text-green-600">Afribet</h1>
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
                      {item.icon}
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
                    <LogOutIcon className="h-5 w-5" />
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
