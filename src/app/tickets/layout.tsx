import type { Metadata } from 'next';
import NavBar from '@/component/NavBar';
import Footer from '@/component/Footer';

export const metadata: Metadata = {
  title: 'Mes Tickets | ParisBet',
  description: 'Consultez vos tickets et gains sur ParisBet',
};

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}
