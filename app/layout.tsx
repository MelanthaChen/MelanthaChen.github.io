import type { Metadata, Viewport } from "next";
import "./globals.css";
import { site } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://melanthachen.github.io"),
  title: {
    default: `${site.name} | ${site.title}`,
    template: `%s | ${site.name}`
  },
  description: site.description,
  keywords: [
    "Yuxuan Chen",
    "Software Engineer",
    "AI Engineer",
    "Next.js",
    "LLM",
    "Developer Tools"
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    title: `${site.name} | ${site.title}`,
    description: site.description,
    url: "https://melanthachen.github.io",
    siteName: `${site.name} Portfolio`,
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.title}`,
    description: site.description,
    images: ["/og.svg"]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
