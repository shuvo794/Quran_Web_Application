import type { Metadata } from "next";
import { Inter, Amiri, Scheherazade_New } from "next/font/google";
import "./globals.css";
import { getAllSurahs } from "@/lib/api";
import ClientLayout from "@/components/ClientLayout";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

const scheherazade = Scheherazade_New({
  variable: "--font-scheherazade",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Quran App",
  description: "Read and listen to the Holy Quran",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch surahs at build time
  const surahs = await getAllSurahs().catch(() => []);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${amiri.variable} ${scheherazade.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('quran-settings');
              if (stored) {
                const state = JSON.parse(stored).state;
                if (state.theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              }
            } catch (e) {}
          `}
        </Script>
      </head>
      <body className="min-h-screen antialiased bg-[var(--background)] text-[var(--foreground)]">
        <ClientLayout surahs={surahs}>{children}</ClientLayout>
      </body>
    </html>
  );
}
