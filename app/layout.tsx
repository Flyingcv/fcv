import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import './pages.css';

import MotionProvider from '@/components/motion/MotionProvider';
import Reveals from '@/components/motion/Reveals';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT', 'WONK', 'opsz']
});

const body = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body'
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://flyingcoloursvacations.com'),
  title: {
    default: 'Flying Colours Vacations — Adding Colours to Every Journey',
    template: '%s · Flying Colours Vacations'
  },
  description:
    'Southeast Asia holiday specialists. Handcrafted packages to Vietnam, Bali, Thailand and Malaysia with private guides, 24/7 on-trip support and transparent pricing.',
  keywords: [
    'Vietnam tour packages', 'Bali holiday packages', 'Thailand packages',
    'Malaysia tour', 'Southeast Asia holidays', 'Flying Colours Vacations'
  ],
  openGraph: {
    type: 'website',
    siteName: 'Flying Colours Vacations',
    title: 'Flying Colours Vacations — Adding Colours to Every Journey',
    description: 'Handcrafted Southeast Asia holidays to Vietnam, Bali, Thailand and Malaysia.'
  },
  icons: {
    // Just the globe+plane mark, cropped from the full logo lockup — the
    // full wide logo squashed into a 16-32px tab icon was illegible.
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: '/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#050F24',
  colorScheme: 'dark'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* Without JS the curtain would never lift — hide it up front. */}
        <noscript>
          <style>{`.preloader{display:none!important}.rise,.reveal-clip,.w>i{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <Reveals />
        </MotionProvider>
      </body>
    </html>
  );
}

// Refinement iteration 16 for code quality and clarity

// Refinement iteration 38 for code quality and clarity

// Refinement iteration 60 for code quality and clarity
