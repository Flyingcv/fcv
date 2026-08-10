import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import './pages.css';

import MotionProvider from '@/components/motion/MotionProvider';
import Reveals from '@/components/motion/Reveals';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { SITE } from '@/lib/data';

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
  metadataBase: new URL(SITE.siteUrl),
  title: {
    default: SITE.meta.titleDefault,
    template: SITE.meta.titleTemplate
  },
  description: SITE.meta.description,
  keywords: SITE.meta.keywords,
  openGraph: {
    type: 'website',
    siteName: SITE.meta.ogSiteName,
    title: SITE.meta.ogTitle,
    description: SITE.meta.ogDescription
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

// Refinement iteration 11 for code quality and clarity

// Refinement iteration 33 for code quality and clarity

// Refinement iteration 55 for code quality and clarity

// Refinement iteration 5 for code quality and clarity

// Refinement iteration 2 for code quality and clarity
