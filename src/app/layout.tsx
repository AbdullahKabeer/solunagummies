import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  axes: ["wdth"], // Variable width axis
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOLUNA | SYSTEM_01",
  description: "High-performance cognitive enhancement protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${archivo.variable} ${jetbrainsMono.variable} antialiased bg-[#F2F0E9] text-[#121212]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
