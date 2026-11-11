import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LiveRegion from "@/components/layout/LiveRegion";
import Shortcuts from "@/components/layout/Shortcuts";
import { OG_IMAGE } from "@/lib/meta";
import { AUTHOR, SITE_NAME, SITE_URL } from "@/lib/site";
import { asset } from "@/lib/utils";
import Providers from "./providers";
import "./globals.css";
import "./sheet.css";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", style: ["normal", "italic"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "BigOSheet: coding explained for everyone", template: "%s | BigOSheet" },
  description:
    "Coding and data structures explained in plain English, plus an interactive Big O cheat sheet with a visualizer, quiz and printable PDFs.",
  authors: [AUTHOR],
  creator: AUTHOR.name,
  icons: {
    icon: [
      { url: asset("/favicon.ico"), type: "image/x-icon" },
      { url: asset("/icon.png"), type: "image/png", sizes: "32x32" },
      { url: asset("/icon.svg"), type: "image/svg+xml" },
    ],
    shortcut: asset("/favicon.ico"),
    apple: [{ url: asset("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
  },
  manifest: asset("/site.webmanifest"),
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: "BigOSheet: coding explained for everyone",
    description: "Plain-English articles on data structures and algorithms, and an interactive Big O cheat sheet.",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

// Runs before first paint so there is no light/dark flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body>
        <Providers>
          <a href="#main" className="skip">Skip to content</a>
          <LiveRegion />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Shortcuts />
        </Providers>
      </body>
    </html>
  );
}
