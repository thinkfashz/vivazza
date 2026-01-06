
// Fix: Added missing React import to resolve the React namespace for ReactNode
import React from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Vivazza | Pizzería Artesanal Talca",
  description: "La mejor pizza artesanal de Talca. Especialistas en masa madre fermentada 48 horas e ingredientes premium locales del Maule.",
  keywords: ["pizza talca", "delivery pizza talca", "pizza artesanal", "masa madre talca", "pizzería maule"],
  manifest: "/manifest.json",
  authors: [{ name: "Vivazza Team" }],
  openGraph: {
    title: "Vivazza | Pizzería Artesanal Talca",
    description: "Masa madre, ingredientes premium y delivery de alta gama.",
    url: "https://vivazza.cl",
    siteName: "Vivazza",
    images: [
      {
        url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vivazza Pizza Artesanal",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vivazza",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFCF0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD para Google Search
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Vivazza Pizzería",
    "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
    "description": "Pizzería artesanal de alta gama en Talca. Especialistas en masa madre fermentada 48 horas e ingredientes premium locales.",
    "servesCuisine": ["Pizza", "Italiana", "Artesanal"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Talca",
      "addressRegion": "Maule",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -35.4264,
      "longitude": -71.6554
    },
    "url": "https://vivazza.cl",
    "telephone": "+56912345678",
    "priceRange": "$$",
  };

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-grain text-vivazza-stone font-body antialiased selection:bg-vivazza-red selection:text-white">
        {children}
        <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossOrigin="anonymous" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
