import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/content";
import ScrollRestorer from "@/components/ScrollRestorer";
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

// The italic paints one emphasis word per page, yet as part of the h1 its
// swap is a fresh LCP candidate - the full Google italic (80KB) was the
// last thing gating LCP. This is a text-subset build (~10KB) holding only
// the emphasis words' glyphs. To change an emphasis word, re-fetch with
// the new glyphs in `text=` (see the LCP contract in AGENTS.md):
//   curl -A "Mozilla/5.0 ... Chrome/120.0" "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,100..900&text=<all emphasis words>&display=swap"
// then download the woff2 it points at over this file.
const frauncesItalic = localFont({
  src: "./fraunces-italic-subset.woff2",
  variable: "--font-fraunces-italic",
  style: "italic",
  weight: "100 900",
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

// Unfurl contract: every route carries canonical + OpenGraph/Twitter tags
// (a portfolio's first impression is usually a link card in iMessage/Slack/X).
// The og:image is the static `opengraph-image.png` file convention beside
// this file. Any future page that overrides openGraph must spell the object
// out in full (it does NOT deep-merge) including an explicit images entry.
// ADR 0002 "SEO": metadata sells, the page jokes - title, description, and
// the OG image stay straight max-sell with no bit.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.seoTitle,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.seoTitle,
    description: site.description,
    url: "/",
    siteName: site.title,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
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
      {/*
       * The journey frames itself (ADR 0001 - the quiet page's Nav/Footer
       * chrome is retired; Cursor and Terminal return inside rung E as
       * salvage, wired by the rung E task). ScrollRestorer stays: Next's
       * async re-render still defeats native back/forward scroll restore.
       */}
      <body>
        {children}
        <ScrollRestorer />
      </body>
    </html>
  );
}
