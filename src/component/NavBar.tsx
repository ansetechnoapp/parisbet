'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTicketDropdownOpen, setIsTicketDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-green-100">
      <div className="container mx-auto flex justify-between items-center py-3 md:py-4 px-4 md:px-6">
        <div className="flex items-center">
          <Link href="/" className="text-green-600 text-2xl md:text-3xl font-bold tracking-tight">paribet</Link>
          {/* Navigation desktop */}
          <nav className="hidden md:flex ml-10 space-x-8">
            <Link
              href="/"
              className={`${pathname === '/' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600'} font-medium pb-1 hover:text-green-600 transition-colors`}
            >
              Jouer au loto
            </Link>
            <Link
              href="/foot"
              className={`${pathname === '/foot' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600'} font-medium pb-1 hover:text-green-600 transition-colors`}
            >
              Paris football
            </Link>
            <Link
              href="/results"
              className={`${pathname === '/results' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600'} font-medium pb-1 hover:text-green-600 transition-colors`}
            >
              Résultats
            </Link>
            <Link
              href="/how-to-play"
              className={`${pathname === '/how-to-play' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600'} font-medium pb-1 hover:text-green-600 transition-colors`}
            >
              Comment jouer
            </Link>
            <Link
              href="/prize-distribution"
              className={`${pathname === '/prize-distribution' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-600'} font-medium pb-1 hover:text-green-600 transition-colors`}
            >
              Distribution des gains
            </Link>
          </nav>
        </div>

        {/* Bouton menu mobile */}
        <button
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
        </button>

        {/* Ticket access dropdown */}
        <div ref={dropdownRef} className="hidden md:block relative">
          <button
            onClick={() => setIsTicketDropdownOpen(!isTicketDropdownOpen)}
            className="flex items-center gap-1 bg-green-600 hover:bg-green-700 transition-colors text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-green-200"
          >
            Mes tickets
            <svg className={`w-4 h-4 transition-transform ${isTicketDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isTicketDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50">
              <Link
                href="/verify-phone"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
              >
                Accès par numéro
              </Link>
              <Link
                href="/find-ticket"
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
              >
                Rechercher un ticket
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-100">
          <nav className="flex flex-col py-2">
            <Link
              href="/"
              className={`px-4 py-2 ${pathname === '/' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
            >
              Jouer au loto
            </Link>
            <Link
              href="/foot"
              className={`px-4 py-2 ${pathname === '/foot' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
            >
              Paris football
            </Link>
            <Link
              href="/results"
              className={`px-4 py-2 ${pathname === '/results' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
            >
              Résultats
            </Link>
            <Link
              href="/how-to-play"
              className={`px-4 py-2 ${pathname === '/how-to-play' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
            >
              Comment jouer
            </Link>
            <Link
              href="/prize-distribution"
              className={`px-4 py-2 ${pathname === '/prize-distribution' ? 'text-green-600 font-medium' : 'text-gray-600'}`}
            >
              Distribution des gains
            </Link>
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
        </div>
      )}
    </header>
  );
}
