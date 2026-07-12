"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { portfolio } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

function GalleryItem({ item, index }: { item: (typeof portfolio)[number]; index: number }) {
  return (
    <figure className="group relative w-[82vw] shrink-0 snap-start md:w-[46vw] lg:w-[38vw]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-coal md:aspect-[3/4]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 38vw, 82vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60" />
        <span className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-micro text-bone/80">
          {item.category}
        </span>
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-xl uppercase text-bone md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-bone/50">{item.description}</p>
        </div>
        <span className="text-[11px] font-semibold tracking-micro text-maguilaRed">
          0{index + 1}
        </span>
      </figcaption>
    </figure>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="page-container flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
    >
      <div>
        <p className="kicker mb-6">Portfólio</p>
        <h2 className="display-title text-[clamp(2.6rem,6.5vw,5.5rem)]">
          Feito para palcos <br className="hidden md:block" />
          <span className="text-maguilaRed">de verdade.</span>
        </h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-bone/50 md:text-right">
        Registros reais de produções que contaram com o time MaguilaFX —
        de cerimônias íntimas a arenas lotadas.
      </p>
    </motion.div>
  );
}

function MobileGallery() {
  return (
    <section id="portfolio" className="bg-ink py-24">
      <Header />
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {portfolio.map((item, i) => (
          <GalleryItem key={item.src} item={item} index={i} />
        ))}
      </div>
      <p className="page-container mt-2 text-[10px] font-semibold uppercase tracking-micro text-bone/30">
        Arraste para o lado →
      </p>
    </section>
  );
}

function DesktopGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  return (
    <section id="portfolio" className="bg-ink">
      <div
        ref={containerRef}
        style={{ height: range ? `calc(100vh + ${range}px)` : "auto" }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-10">
          <Header />
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="mt-14 flex w-max gap-8 pl-14 pr-24 will-change-transform"
          >
            {portfolio.map((item, i) => (
              <GalleryItem key={item.src} item={item} index={i} />
            ))}

            {/* CTA final da galeria */}
            <a
              href="#contato"
              className="group flex w-[30vw] shrink-0 items-center justify-center border border-bone/15 transition-colors duration-500 hover:border-maguilaRed hover:bg-maguilaRed/5"
            >
              <div className="text-center">
                <p className="font-display text-3xl uppercase leading-tight text-bone">
                  Seu evento
                  <br />
                  <span className="text-maguilaRed">é o próximo?</span>
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-micro text-bone/50 transition-colors group-hover:text-bone">
                  Fale com a gente →
                </p>
              </div>
            </a>
          </motion.div>

          {/* Barra de progresso */}
          <div className="page-container mt-12">
            <div className="h-px w-full bg-bone/10">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full w-full origin-left bg-maguilaRed"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Portfolio() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopGallery /> : <MobileGallery />;
}
