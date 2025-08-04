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
  title: "Jared Buckley - Product Designer",
  description: "Consulting Product Designer specializing in UX/UI design and digital product development",
  keywords: ["product design", "UX", "UI", "consulting", "portfolio", "Jared Buckley"],
  authors: [{ name: "Jared Buckley" }],
  creator: "Jared Buckley",
  icons: {
    icon: "/bucklemeshoe_facvicon.png",
    shortcut: "/bucklemeshoe_facvicon.png",
    apple: "/bucklemeshoe_facvicon.png",
  },
  openGraph: {
    title: "Jared Buckley - Product Designer",
    description: "Consulting Product Designer specializing in UX/UI design and digital product development",
    type: "website",
    url: "https://www.bucklemeshoe.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jared Buckley - Product Designer",
    description: "Consulting Product Designer specializing in UX/UI design and digital product development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}> 
      <body className="min-h-screen font-sans antialiased" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif' }}>
        <div className="relative">
          {/* Spotlight gradient effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-indigo-50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
