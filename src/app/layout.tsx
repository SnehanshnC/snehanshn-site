import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/content";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Terminal from "@/components/Terminal";
import "./globals.css";

// The statement voice: variable Fraunces, optical axis only - the SOFT
// and WONK axes cost ~2x the font bytes and the h1 is the LCP element.
// The italic (one emphasis word per page) is a separate, non-preloaded
// family so its bytes never gate the h1's big repaint - see the LCP
// contract in AGENTS.md.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const frauncesItalic = Fraunces({
  variable: "--font-fraunces-italic",
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["italic"],
  preload: false,
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Terminal />
        <Cursor />
      </body>
    </html>
  );
}
