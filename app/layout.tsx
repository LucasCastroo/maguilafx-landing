import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";
import { IntroProvider } from "@/components/IntroProvider";
import { EmberCursor } from "@/components/EmberCursor";
import { SITE_URL, WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/data";

// Só `latin`: o português cabe inteiro no Latin-1 Supplement (á ã ç é ô ú...).
// O `latin-ext` cobre alfabetos do leste europeu e turco, que este site não
// usa — e cada subset vira um preload de fonte competindo com a imagem do
// hero, que é o elemento de LCP. Eram 4 preloads de fonte; agora são 2.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const DESCRIPTION =
  "Pirotecnia, faísca fria, jatos de CO₂, chamas, confete e laser para shows, festivais, casamentos e grandes eventos. Segurança certificada e impacto de arena.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "MaguilaFX | Efeitos Pirotécnicos e Especiais para Eventos",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  icons: {
    icon: "/images/logos/logo-mini-light.png",
    shortcut: "/images/logos/logo-mini-light.png",
    apple: "/images/logos/logo-mini-light.png",
  },
  openGraph: {
    title: "MaguilaFX | Efeitos Pirotécnicos e Especiais",
    description:
      "Momentos que explodem na memória. Efeitos especiais profissionais para shows, festivais, casamentos e grandes eventos.",
    url: "/",
    siteName: "MaguilaFX",
    locale: "pt_BR",
    type: "website",
    // Preview no WhatsApp/Instagram/Facebook — canal principal de contato.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "MaguilaFX — efeitos pirotécnicos e especiais",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MaguilaFX | Efeitos Pirotécnicos e Especiais",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

/** Dados estruturados para busca local (Palmas/TO). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "MaguilaFX",
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  telephone: "+556392252302",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Palmas",
    addressRegion: "TO",
    addressCountry: "BR",
  },
  areaServed: { "@type": "Country", name: "Brasil" },
  sameAs: [INSTAGRAM_URL, WHATSAPP_URL],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${anton.variable} ${archivo.variable}`}
    >
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <IntroProvider>
          <SmoothScroll>
            <Preloader />
            <EmberCursor />
            <Header />
            {children}
          </SmoothScroll>
        </IntroProvider>
      </body>
    </html>
  );
}
