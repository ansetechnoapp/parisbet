'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { WalletIcon, CircleDot, TicketIcon, MenuIcon, XIcon } from 'lucide-react';
import Footer from '@/components/Footer';
import WarningBanner from '@/components/WarningBanner';

export default function FrontLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id: string } | null>(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                setUser(data.session?.user || null);
                setLoading(false);
            } catch (error) {
                console.error('Error checking auth:', error);
                setLoading(false);
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

    // Authentication is now handled in NavBar component

    const navigation = [
        { name: 'Jouer au loto', href: '/', icon: TicketIcon },
        { name: 'Paris football', href: '/soccer', icon: CircleDot },
        { name: 'Résultats', href: '/results', icon: TicketIcon },
        { name: 'Comment jouer', href: '/how-to-play', icon: TicketIcon },
        { name: 'Distribution des gains', href: '/prize-distribution', icon: TicketIcon },
    ];

    // Only show wallet for authenticated users
    if (user) {
        navigation.push({ name: 'Portefeuille', href: '/wallet', icon: WalletIcon });
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-primary text-white shadow-md">
                <WarningBanner />

                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Link href="/" className="font-bold text-xl">
                                Afribet
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === item.href
                                        ? 'bg-primary-foreground text-primary'
                                        : 'hover:bg-primary-foreground/10'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}

                            {/* Authentication buttons moved to NavBar component */}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-foreground/10 focus:outline-none"
                            >
                                {showMobileMenu ? (
                                    <XIcon className="h-6 w-6" />
                                ) : (
                                    <MenuIcon className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {showMobileMenu && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === item.href
                                        ? 'bg-primary-foreground text-primary'
                                        : 'hover:bg-primary-foreground/10'
                                        }`}
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    <div className="flex items-center">
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </div>
                                </Link>
                            ))}

                            {/* Authentication buttons moved to NavBar component */}
                        </div>
                    </div>
                )}
            </nav>

            <main className="container mx-auto px-4 py-8">
                {children}
            </main>


            <Footer />

        </div>
    );
}