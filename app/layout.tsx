import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const roobert = localFont({
  src: '../public/fonts/roobert-variable.woff2',
  variable: '--font-roobert',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "STAR",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roobert.variable}`}>
      <body
        className={`bg-shapes bg-[#101012] font-roobert`}      >
      {children}
    </body>
    </html >
  );
}
