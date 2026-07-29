"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/data";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled && !open
            ? "border-b border-bone/10 bg-ink/80 backdrop-blur-lg"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="page-container flex h-16 items-center justify-between md:h-20">
          <a href="#inicio" className="flex items-center gap-3" aria-label="MaguilaFX — início">
            <div className="relative h-8 w-8 md:h-9 md:w-9">
              <Image
                src="/images/logos/logo-mini-light.png"
                alt=""
                fill
                className="object-contain"
                priority
                sizes="36px"
              />
            </div>
            <span className="font-display text-lg uppercase tracking-[0.08em] text-bone">
              Maguila<span className="text-maguilaRed">FX</span>
            </span>
          </a>

          {/*
            O menu inteiro (5 itens com tracking-micro + botão) precisa de
            ~900px. Em `md` (768px) ele estourava a viewport e o botão
            "Orçamento" saía da tela — por isso só entra a partir de `lg`.
          */}
          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[11px] font-semibold uppercase tracking-micro text-bone/70 transition-colors hover:text-bone"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-maguilaRed transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a href="#contato" className="btn-primary !px-6 !py-3">
              <span>Orçamento</span>
            </a>
          </nav>

          {/* Hamburguer mobile */}
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[110] flex h-11 w-11 flex-col items-center justify-center gap-[6px] lg:hidden"
          >
            <span
              className={`block h-[2px] w-6 bg-bone transition-all duration-300 ${
                open ? "translate-y-[8px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-bone transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-bone transition-all duration-300 ${
                open ? "-translate-y-[8px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </motion.header>

      {/* Menu mobile fullscreen */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[95] flex flex-col justify-between bg-ink pb-10 pt-28 lg:hidden"
          >
            <nav className="page-container flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-baseline gap-4 border-b border-bone/10 py-4"
                >
                  <span className="text-[10px] font-semibold tracking-micro text-maguilaRed">
                    0{i + 1}
                  </span>
                  <span className="font-display text-4xl uppercase leading-none text-bone transition-colors group-hover:text-maguilaRed">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="page-container flex flex-col gap-4"
            >
              <div className="flex gap-8 text-[11px] font-semibold uppercase tracking-micro text-bone/50">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                  WhatsApp
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                  Instagram
                </a>
              </div>
              <p className="text-[11px] uppercase tracking-micro text-bone/55">
                Palmas, Tocantins — Brasil
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
