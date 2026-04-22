import type { Metadata, Viewport } from "next";
import { Dancing_Script, Quicksand } from "next/font/google";
import "./globals.css";

const script = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sans = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A little birthday adventure",
  description: "A surprise map made with love",
};

export const viewport: Viewport = {
  themeColor: "#fde4ec",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${script.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
