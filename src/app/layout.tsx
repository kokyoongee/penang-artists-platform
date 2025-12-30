import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { SettingsProvider } from "@/contexts/SettingsContext";

export const metadata: Metadata = {
  title: "Penang Artists - Discover Local Creative Talent",
  description: "Explore Penang's vibrant art scene. Connect with local painters, photographers, craftspeople, muralists, and more. Commission work, collaborate, or simply discover amazing art.",
  keywords: ["Penang", "artists", "art", "creative", "local", "Malaysia", "Georgetown", "murals", "paintings", "photography"],
  openGraph: {
    title: "Penang Artists - Discover Local Creative Talent",
    description: "Explore Penang's vibrant art scene. Connect with local painters, photographers, craftspeople, muralists, and more.",
    type: "website",
    locale: "en_MY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <SettingsProvider>
          <div className="pattern-bg" />
          <Header />
          <main className="flex-1 pt-[72px]">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
        </SettingsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
