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
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-[#f8fafd] text-[#0f1f35] font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function fixDefiner() {
                  try {
                    var el = document.getElementById('definer-bubble-host');
                    if (el && el.parentElement === document.body && document.body.lastElementChild !== el) {
                      document.body.appendChild(el);
                    }
                  } catch (e) {}
                }
                fixDefiner();
                if (typeof MutationObserver !== 'undefined') {
                  var obs = new MutationObserver(fixDefiner);
                  obs.observe(document.documentElement, { childList: true, subtree: true });
                  if (typeof window !== 'undefined') {
                    window.addEventListener('DOMContentLoaded', fixDefiner);
                    setTimeout(function() { obs.disconnect(); }, 5000);
                  }
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
