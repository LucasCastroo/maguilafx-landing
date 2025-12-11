// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Equipamentos", href: "#equipamentos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all
        ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"}
      `}
    >
      <div className="page-container flex h-16 items-center justify-between">
        {/* Logo + nome */}
        <Link href="#inicio" className="flex items-center gap-2">
          <div className="relative h-9 w-9">
            <Image
              src="/images/logos/logo-mini-light.png"
              alt="MaguilaFX"
              fill
              className="object-contain"
              priority
              sizes="36px"
            />
          </div>
          <span className="text-sm font-semibold tracking-[0.3em] uppercase text-white/80">
            Maguila<span className="text-maguilaRed">FX</span>
          </span>
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-6 text-xs font-medium uppercase tracking-[0.25em] text-white/60 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botão hamburguer mobile */}
        <button
          type="button"
          aria-label="Abrir menu"
          onClick={() => setOpen((prev) => !prev)}
          className="group relative flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-white/20 bg-black/60 text-white transition-colors hover:border-maguilaRed/50 md:hidden"
        >
          <span
            className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""
              }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${open ? "opacity-0" : "opacity-100"
              }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
          />
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/10 bg-black/95 py-4 md:hidden"
          >
            <div className="page-container flex flex-col gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-1 transition hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
