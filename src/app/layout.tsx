import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kaushal Setu | iGOT AI Learning Platform for Official Statistics",
  description:
    "AI-powered competency and personalized learning platform for India's Official Statistical System (MoSPI & State DES), integrated with the iGOT Karmayogi ecosystem.",
  keywords: [
    "Kaushal Setu",
    "iGOT Karmayogi",
    "Official Statistical System",
    "MoSPI",
    "DES",
    "Competency Analysis",
    "Personalized Learning",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        {children}
      </body>
    </html>
  );
}
