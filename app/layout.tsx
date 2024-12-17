import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const roobert = localFont({
  src: '../public/fonts/roobert.woff2',
  variable: '--font-roobert',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STAR',
  description: 'Satellite Tracking and Alignment Resource',
  metadataBase: new URL('https://star.conor.link'),
  icons: {
    icon: '../images/favicon.png',
  },
  robots: {
    index: true,
  },
  openGraph: {
    title: 'STAR',
    description: `Satellite Tracking and Alignment Resource`,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roobert.variable}`}>
      <body className="bg-[#101012] bg-shapes font-roobert text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
