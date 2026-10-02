
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
  metadataBase: new URL('https://norushservices.com'),
  title: {
    default: 'No Rush | Furniture Assembly, TV Mounting & Moving Services NYC',
    template: '%s | No Rush NYC',
  },
  description: 'Professional furniture assembly, TV mounting, trash removal, and moving services in New York City (Manhattan, Brooklyn, Queens, Hoboken, Jersey City). Fast, reliable help with transparent pricing.',
  keywords: [
    'furniture assembly NYC',
    'IKEA assembly Manhattan',
    'TV mounting Brooklyn',
    'wall mounting NYC',
    'trash removal Queens',
    'local moving services NYC',
    'No Rush services'
  ],
  authors: [{ name: 'No Rush NYC' }],
  creator: 'No Rush',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://norushservices.com',
    siteName: 'No Rush NYC',
    title: 'No Rush | Reliable Furniture Assembly & Mounting in NYC',
    description: 'Expert flat-pack furniture assembly, secure TV wall mounting, and local moving in New York City.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'No Rush | Reliable Help, Just a Click Away',
    description: 'Professional furniture assembly and mounting services across NYC.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'No Rush',
  description: 'Professional furniture assembly, TV wall mounting, trash removal, and moving services in New York City.',
  url: 'https://norushservices.com',
  telephone: '+1-929-637-2276',
  email: 'norushnyc@gmail.com',
  priceRange: '$$',
  areaServed: [
    { '@type': 'City', name: 'New York City' },
    { '@type': 'AdministrativeArea', name: 'Manhattan' },
    { '@type': 'AdministrativeArea', name: 'Brooklyn' },
    { '@type': 'AdministrativeArea', name: 'Queens' },
    { '@type': 'AdministrativeArea', name: 'Hoboken' },
    { '@type': 'AdministrativeArea', name: 'Jersey City' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '22:00',
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
