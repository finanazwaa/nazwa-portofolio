import type { Metadata } from "next";
import { Caveat, Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Footer, Header, TransitionWash } from "@/components/site-chrome";
import { Preloader } from "@/components/preloader";
import { owner } from "@/lib/content";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Variable, with the SOFT/WONK axes for the softer, slightly hand-cut editorial headings.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

// Handwritten accent — labels, notes, quotes and stickers only, never body copy.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: `${owner.name} — portfolio`,
  description: owner.subtitle,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TransitionWash />
        <Preloader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
