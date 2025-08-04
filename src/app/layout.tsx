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
  metadataBase: new URL('https://www.bucklemeshoe.com'),
  title: {
    default: "Jared Buckley - Product Designer, Entrepreneur & Digital Explorer",
    template: "%s - Jared Buckley"
  },
  description: "Product designer and entrepreneur based in Cape Town. I help companies and founders create digital products that people love to use. 15+ years of experience in UX/UI design and digital product development.",
  keywords: ["product design", "UX design", "UI design", "entrepreneur", "Cape Town", "digital products", "startup", "consulting", "Jared Buckley"],
  authors: [{ name: "Jared Buckley" }],
  creator: "Jared Buckley",
  publisher: "Jared Buckley",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/bucklemeshoe_facvicon.png",
    shortcut: "/bucklemeshoe_facvicon.png",
    apple: "/bucklemeshoe_facvicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.bucklemeshoe.com",
    siteName: "Jared Buckley",
    title: "Jared Buckley - Product Designer, Entrepreneur & Digital Explorer",
    description: "Product designer and entrepreneur based in Cape Town. I help companies and founders create digital products that people love to use.",
          images: [
        {
          url: "/images/bucklemeshoe%20_%20Social%20Media%20Sharing%20Image.png",
          width: 1200,
          height: 630,
          alt: "Jared Buckley - Product Designer and Entrepreneur",
        },
      ],
  },
      twitter: {
      card: "summary_large_image",
      site: "@bucklemeshoe",
      creator: "@bucklemeshoe",
      title: "Jared Buckley - Product Designer, Entrepreneur & Digital Explorer",
      description: "Product designer and entrepreneur based in Cape Town. I help companies and founders create digital products that people love to use.",
      images: ["/images/bucklemeshoe%20_%20Social%20Media%20Sharing%20Image.png"],
    },
  verification: {
    google: "your-google-verification-code",
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
