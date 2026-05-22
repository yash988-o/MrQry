import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mercury | Improve Your Learning 10x",
  description: "One place for every skill, every method, every dream. Built on the science of how your brain actually learns.",
  openGraph: {
    title: "Mercury | Improve Your Learning 10x",
    description: "The Scientific Learning Operating System.",
    siteName: "Mercury",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercury | Improve Your Learning 10x",
    description: "The Scientific Learning Operating System.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased h-full`}
      >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
