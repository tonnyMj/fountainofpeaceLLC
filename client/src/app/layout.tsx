import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fountain of Peace AFH LLC | Individualized Senior Care",
  description: "Providing high-quality, individualized care that promotes dignity, independence, and overall well-being in a warm, home-like environment.",
};

import { ToastProvider } from '@/contexts/ToastContext';
import ChatWidget from '@/components/ChatWidget';
import Analytics from '@/components/Analytics';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <ToastProvider>
          {gaId && <Analytics gaId={gaId} />}
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </ToastProvider>
      </body>
    </html>
  );
}
