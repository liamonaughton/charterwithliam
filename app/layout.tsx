import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL } from '@/lib/env';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CharterWithLiam — Fly private, booked direct',
    template: '%s · CharterWithLiam',
  },
  description:
    'Charter a private jet, booked direct with Liam — vetted operators, transparent pricing, one point of contact. Tell me your trip and get a quote.',
  keywords: [
    'private jet charter',
    'charter a private jet',
    'private jet broker',
    'empty leg flights',
    'jet charter quote',
    'fly private',
  ],
  authors: [{ name: 'Liam' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'CharterWithLiam',
    title: 'Fly private, booked direct.',
    description:
      'Charter a private jet with vetted operators, transparent pricing, and one point of contact.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fly private, booked direct.',
    description:
      'Charter a private jet with vetted operators, transparent pricing, and one point of contact.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0A1A2F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
