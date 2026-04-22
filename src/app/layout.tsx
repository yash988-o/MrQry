import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MrQry | Improve Your Learning 10x",
  description: "One place for every skill, every method, every dream. Built on the science of how your brain actually learns.",
  openGraph: {
    title: "MrQry | Improve Your Learning 10x",
    description: "The Scientific Learning Operating System.",
    siteName: "MrQry",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MrQry | Improve Your Learning 10x",
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
      className={`${spaceGrotesk.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        {/* ThemeProvider and ToastProvider will wrap children here */}
        {children}
      </body>
    </html>
  );
}
