import type React from "react";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { KittyTutor } from "@/components/layout/kitty-tutor";
import { SearchCommand } from "@/components/layout/search-command";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import "@/app/globals.css";
import { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "DailyEng - Learning English by Interaction!",
  description:
    "Master English with AI-powered vocabulary, speaking, and grammar lessons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined") {
    import("@/src/mocks/browser").then(({ worker }) => {
      worker.start();
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.className} bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <ConditionalLayout>
              <main className="min-h-screen">{children}</main>
            </ConditionalLayout>
            <KittyTutor />
            <SearchCommand />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
