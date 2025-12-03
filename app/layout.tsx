import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "MaguilaFX | Efeitos Pirotécnicos",
  description: "Efeitos pirotécnicos para shows, casamentos e grandes eventos.",
  icons: {
    icon: "/images/logo-mini-light.png",
    shortcut: "/images/logo-mini-light.png",
    apple: "/images/logo-mini-light.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}