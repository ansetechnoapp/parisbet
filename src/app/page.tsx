'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Cartes de navigation de base
  const baseNavigationCards = [
    { title: 'Loto', description: 'Jouez à la loterie et tentez votre chance', href: '/Lotto', icon: '🎲' },
    { title: 'Paris Sportifs', description: 'Pariez sur vos équipes favorites', href: '/foot', icon: '⚽' },
    { title: 'Résultats', description: 'Consultez les derniers résultats', href: '/results', icon: '📊' },
  ];

  // Cartes pour utilisateurs non connectés
  const authCards = [
    { title: 'Connexion', description: 'Accédez à votre compte', href: '/auth/login', icon: '🔑' },
    { title: 'Inscription', description: 'Créez votre compte', href: '/auth/register', icon: '✍️' },
  ];

  // Cartes pour utilisateurs connectés
  const userCards = [
    { title: 'Mon espace', description: 'Accédez à votre espace personnel', href: '/user-dashboard', icon: '🏠' },
    { title: 'Portefeuille', description: 'Gérez votre portefeuille', href: '/user-dashboard/wallet', icon: '💰' },
  ];

  // Sélectionner les cartes à afficher en fonction de l'état de connexion
  const navigationCards = [
    ...baseNavigationCards,
    ...(user ? userCards : authCards)
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {user ? `Bienvenue sur votre espace ParisBet` : `Bienvenue sur ParisBet`}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {navigationCards.map((card) => (
            <Link href={card.href} key={card.href} className="block group">
              <div className="bg-white rounded-xl p-6 shadow-lg shadow-green-100 transition-all duration-200 hover:shadow-xl hover:shadow-green-200 hover:-translate-y-1">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600">
                  {card.title}
                </h2>
                <p className="text-gray-600">
                  {card.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
