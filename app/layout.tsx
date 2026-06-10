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
    default: 'CharterWithLiam — Fly private without overpaying',
    template: '%s · CharterWithLiam',
  },
  description:
    "The free Charter Buyer's Guide: how private aviation pricing, safety, and the fine print actually work — so you book with your eyes open.",
  keywords: [
    'private jet charter',
    'empty leg flights',
    'charter buyers guide',
    'private aviation',
    'fly private',
  ],
  authors: [{ name: 'Liam' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'CharterWithLiam',
    title: 'Fly private without overpaying — or getting burned.',
    description:
      "The free Charter Buyer's Guide: how pricing, safety, and the fine print actually work.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fly private without overpaying — or getting burned.',
    description:
      "The free Charter Buyer's Guide: how pricing, safety, and the fine print actually work.",
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
