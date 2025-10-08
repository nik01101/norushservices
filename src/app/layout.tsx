
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Inter, Noto_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { QueryProvider } from '@/components/QueryProvider';


const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const noto = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-parkinsans',
});

const akira = localFont({
  src: '../fonts/AkiraExpanded.otf',
  display: 'auto',
  variable: '--font-akira',
});

export const metadata: Metadata = {
  title: 'No Rush',
  description: 'Furniture mounting and moving services',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${noto.variable} ${akira.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
      </head>
      <body className="font-body antialiased h-full">
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
