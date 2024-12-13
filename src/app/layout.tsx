import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Providers } from '@/app/providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BlockEstate',
  description: 'Tokenized Real Estate Investment Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
