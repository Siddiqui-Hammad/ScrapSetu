import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const metadata: Metadata = {
  title: 'ScrapSetu | A Digital Bridge to Sustainable Recycling',
  description:
    'An inclusive Indian circular recycling ecosystem connecting households, commercial waste generators, informal waste collectors (kabadiwalas), recycling mills, and environmental authorities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
