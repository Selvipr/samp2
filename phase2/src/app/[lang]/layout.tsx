import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { createClient } from "@/lib/supabase/server";
import { CartProvider } from "@/context/CartContext";
import { getDictionary } from "@/lib/dictionary";
import LanguageProvider from "@/components/LanguageProvider";
import CurrencyProvider from "@/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop2games | Hybrid Digital Marketplace",
  description: "Direct Top-Up & P2P Keys",
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: 'en' | 'ru' };
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Await params to avoid Next.js warnings/errors in recent versions
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  // Fetch initial exchange rate
  const { data: settings } = await supabase
    .from('system_settings')
    .select('value')
    .eq('key', 'rub_rate')
    .single();

  const initialRate = settings?.value ? parseFloat(settings.value) : 90; // Default fallback

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0c]`}
      >
        <LanguageProvider dictionary={dictionary}>
          <CurrencyProvider initialRate={initialRate}>
            <CartProvider>
              <Navbar user={user} lang={lang} />
              <ServiceWorkerRegister />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
