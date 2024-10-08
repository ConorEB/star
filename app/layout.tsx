import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const roobert = localFont({
  src: '../public/fonts/roobert-variable.woff2',
  variable: '--font-roobert',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'STAR',
  description: 'Satellite Tracking and Alignment Resource',
  icons: {
    icon: '../favicon.png',
  },
  robots: {
    index: true
  },
  openGraph: {
    title: 'STAR',
    description: `Satellite Tracking and Alignment Resource`,
    url: 'https://star.conor.link',
    images: [
      {
        url: 'https://star.conor.link/og.jpg',
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
      <body
        className={`bg-shapes bg-[#101012] font-roobert text-white`}      >
      {children}
    </body>
    </html >
  );
}
