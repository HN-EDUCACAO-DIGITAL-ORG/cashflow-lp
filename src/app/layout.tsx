import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/ui/SmoothScroll";

// Self-hosted variable fonts (no external requests, better LCP)
const manrope = localFont({
  variable: "--font-manrope",
  src: [
    { path: "../fonts/Manrope.woff2", weight: "200 800", style: "normal" },
    { path: "../fonts/Manrope-ext.woff2", weight: "200 800", style: "normal" },
  ],
  display: "swap",
});

const geistMono = localFont({
  variable: "--font-geist-mono",
  src: "../fonts/GeistMono.woff2",
  weight: "100 900",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cashflow.app.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Cashflow — Sua operação de Lowticket. Sob controle.",
  description:
    "Vendas, tráfego, ofertas e financeiro em um único lugar. Tenha uma visão clara do que está acontecendo em cada oferta e tome decisões com dados reais, sem depender de planilhas.",
  openGraph: {
    title: "Cashflow — Sua operação de Lowticket. Sob controle.",
    description:
      "Do anúncio ao lucro. Sem planilha. Vendas, tráfego, ofertas e financeiro em um único lugar.",
    type: "website",
    locale: "pt_BR",
    siteName: "Cashflow",
    images: [
      {
        url: "/og.png",
        width: 1024,
        height: 576,
        alt: "Dashboard da Cashflow no notebook, com a operação de low ticket sob controle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  icons: { icon: "/brand/logo-icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col grain">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
