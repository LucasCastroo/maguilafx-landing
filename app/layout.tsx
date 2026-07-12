import type { Metadata } from "next";
import { Anton, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";

const anton = Anton({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MaguilaFX | Efeitos Pirotécnicos e Especiais para Eventos",
  description:
    "Pirotecnia, faísca fria, jatos de CO₂, chamas, confete e laser para shows, festivais, casamentos e grandes eventos. Segurança certificada e impacto de arena.",
  icons: {
    icon: "/images/logos/logo-mini-light.png",
    shortcut: "/images/logos/logo-mini-light.png",
    apple: "/images/logos/logo-mini-light.png",
  },
  openGraph: {
    title: "MaguilaFX | Efeitos Pirotécnicos e Especiais",
    description:
      "Momentos que explodem na memória. Efeitos especiais profissionais para shows, festivais, casamentos e grandes eventos.",
    locale: "pt_BR",
    type: "website",
  },
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
        <SmoothScroll>
          <Preloader />
          <Header />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
