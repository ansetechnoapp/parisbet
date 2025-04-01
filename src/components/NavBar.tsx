'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';

export default function NavBar() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTicketDropdownOpen, setIsTicketDropdownOpen] = useState(false);
  // const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTicketDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto flex justify-between items-center py-3 md:py-4 px-4 md:px-6">
        {/* Bouton menu mobile */}
        {/* <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button> */}
        <div className="flex items-center space-x-4 ml-auto mr-4">
          {user ? (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-50 text-gray-700"
            >
              <LogOutIcon className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-50 text-gray-700"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-3 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
        {/* Ticket access dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-green-200"
            >
              Mes tickets
              <motion.svg
                animate={{ rotate: isTicketDropdownOpen ? 180 : 0 }}
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
          </DropdownMenu.Trigger>

          <AnimatePresence>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[220px] bg-white rounded-lg shadow-xl py-1 z-50"
                sideOffset={5}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DropdownMenu.Item className="outline-none">
                    <Link
                      href="/verify-phone"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Accès par numéro
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="outline-none">
                    <Link
                      href="/find-ticket"
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      Rechercher un ticket
                    </Link>
                  </DropdownMenu.Item>
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </AnimatePresence>
        </DropdownMenu.Root>
      </div>

      {/* Menu mobile */}
      {/* <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-green-100"
          >
            <nav className="flex flex-col py-2">



              <Link
                href="/verify-phone"
                className={`px-4 py-2 ${pathname === '/verify-phone' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
              >
                Mes tickets (par numéro)
              </Link>
              <Link
                href="/find-ticket"
                className={`px-4 py-2 ${pathname === '/find-ticket' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
              >
                Rechercher un ticket par ID
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence> */}
    </header>
  );
}
