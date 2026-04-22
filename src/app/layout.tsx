import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Virtual Try-On | eCommerce',
  description:
    'Upload your photo and virtually try on clothing items. See how clothes look on you before you buy.',
  keywords: [
    'virtual try-on',
    'clothing',
    'fashion',
    'ar',
    'augmented reality',
  ],
  viewport: 'width=device-width, initial-scale=1',
  authors: [{ name: 'Virtual Try-On Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
