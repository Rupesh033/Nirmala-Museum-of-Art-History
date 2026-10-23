import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen Museum of Art History — A Journey Through Western Art",
  description:
    "Explore five centuries of masterpieces at the Lumen Museum. Cross-fade spotlight gallery, conservator's magnifier, an interactive genre timeline, a drag-to-look 3D virtual tour, and an audio guide with circular progress rings.",
  keywords: [
    "art history",
    "museum",
    "virtual gallery",
    "Renaissance",
    "Baroque",
    "Impressionism",
    "audio guide",
    "3D tour",
  ],
  authors: [{ name: "Lumen Museum Curatorial Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Lumen Museum of Art History",
    description: "A journey through five centuries of Western art.",
    siteName: "Lumen Museum",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen Museum of Art History",
    description: "A journey through five centuries of Western art.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
