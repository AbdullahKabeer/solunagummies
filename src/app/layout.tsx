import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"], // Add character axes
});

export const metadata: Metadata = {
  title: "Soluna | Unlock Your Potential",
  description: "Premium nootropic gummies for focus, clarity, and flow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-[#FDFCF8] text-[#1a1a1a]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
