"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/data";

function NavIcon({ href }: { href: string }) {
  const paths: Record<string, React.ReactNode> = {
    "#inicio": (
      <>
        <path d="m4 10 8-6.5 8 6.5" />
        <path d="M6.5 9v10h11V9M10 19v-5h4v5" />
      </>
    ),
    "#equipamentos": (
      <>
        <path d="M12 2.8 13.5 8l5.2 1.5-5.2 1.5-1.5 5.2-1.5-5.2-5.2-1.5L10.5 8 12 2.8Z" />
        <path d="m18.2 15 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" />
      </>
    ),
    "#portfolio": (
      <>
        <rect x="3" y="4" width="18" height="16" rx="1.5" />
        <circle cx="8.5" cy="9" r="1.5" />
        <path d="m4 17 4.5-4 3.5 3 2.5-2 5.5 4.5" />
      </>
    ),
    "#sobre": (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.4 2.3-5 5.5-5s5 1.6 5.5 5" />
        <path d="M15.5 5.5a3 3 0 0 1 0 5.5M16 14c2.7.2 4.2 1.8 4.5 5" />
      </>
    ),
    "#contato": (
      <>
        <path d="M4 5.5h16v11H9l-5 4v-15Z" />
        <path d="M8 10h8M8 13h5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[26px] w-[26px]"
    >
      {paths[href]}
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overAbout, setOverAbout] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const about = document.getElementById("sobre");
    let aboutTop = Number.POSITIVE_INFINITY;
    let aboutBottom = Number.NEGATIVE_INFINITY;

    const measureAbout = () => {
      if (!about) return;
      const rect = about.getBoundingClientRect();
      aboutTop = rect.top + window.scrollY;
      aboutBottom = aboutTop + rect.height;
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      const headerHeight = window.innerWidth >= 768 ? 80 : 64;
      setOverAbout(
        window.scrollY + headerHeight >= aboutTop &&
          window.scrollY < aboutBottom
      );
    };

    const onResize = () => {
      measureAbout();
      onScroll();
    };

    measureAbout();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const resizeObserver = about ? new ResizeObserver(onResize) : null;
    if (about) resizeObserver?.observe(about);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.classList.remove("lenis-stopped");
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeMenuOnDesktop);
    return () => desktop.removeEventListener("change", closeMenuOnDesktop);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -112, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-[100] font-sans"
      >
        <AnimatePresence initial={false}>
          {!scrolled && (
            <motion.a
              href="#contato"
              onClick={() => setOpen(false)}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 32, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="announcement-strip relative flex items-center justify-center overflow-hidden bg-maguilaRed px-4 text-center text-[10px] font-medium tracking-wide text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white md:text-xs"
            >
              <span className="relative z-10">
                Efeitos especiais para momentos que não se repetem.
              </span>
              <span className="relative z-10 ml-2 hidden font-semibold sm:inline">
                Solicite um orçamento →
              </span>

              <span
                aria-hidden="true"
                className="announcement-shine announcement-shine--ambient pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
              <span
                aria-hidden="true"
                className="announcement-shine announcement-shine--hover pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </motion.a>
          )}
        </AnimatePresence>

        <div className="relative bg-transparent">
          <div
            aria-hidden="true"
            className={`header-about-shade pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.68)_48%,rgba(0,0,0,0.28)_74%,transparent_100%)] transition-opacity duration-500 ${
              overAbout ? "opacity-100" : "opacity-0"
            }`}
          />

          <div className="page-container relative flex h-16 items-center justify-between md:h-20">
            <a
              href="#inicio"
              className="flex items-center gap-3.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maguilaRed"
              aria-label="MaguilaFX — início"
            >
              <div className="relative h-9 w-9 md:h-10 md:w-10">
                {/* Sem `priority`: são 40px de logo. Está na viewport, então
                    carrega de imediato de qualquer forma — mas o preload
                    passava à frente da imagem do hero na fila. */}
                <Image
                  src="/images/logos/logo-mini-light.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <span className="font-sans text-[17px] font-extrabold uppercase tracking-[-0.02em] text-bone md:text-[19px]">
                Maguila<span className="text-maguilaRed">FX</span>
              </span>
            </a>

            <nav
              aria-label="Navegação principal"
              className="hidden items-center gap-1.5 lg:flex xl:gap-2"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full text-bone/80 transition-all duration-300 hover:bg-bone/10 hover:text-bone focus-visible:bg-bone/10 focus-visible:text-bone focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maguilaRed"
                >
                  <NavIcon href={item.href} />
                  <span className="sr-only">{item.label}</span>
                  <span className="pointer-events-none absolute top-full mt-2 translate-y-1 whitespace-nowrap rounded bg-ink/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-bone opacity-0 shadow-lg transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    {item.label}
                  </span>
                </a>
              ))}
            </nav>

            {/* Hamburguer mobile */}
            <button
              type="button"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative z-[110] flex h-12 w-12 flex-col items-center justify-center gap-[6px] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maguilaRed lg:hidden"
            >
              <span
                className={`block h-[2px] w-[26px] bg-bone transition-all duration-300 ${
                  open ? "translate-y-[8px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-[26px] bg-bone transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-[26px] bg-bone transition-all duration-300 ${
                  open ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
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
            className="fixed inset-0 z-[95] flex flex-col justify-between overflow-y-auto bg-ink pb-10 pt-32 font-sans lg:hidden"
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
                  <span className="font-sans text-4xl font-bold uppercase leading-none tracking-tight text-bone transition-colors group-hover:text-maguilaRed">
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
