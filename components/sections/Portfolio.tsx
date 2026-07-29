"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { portfolio } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

// Evita o aviso do React ao renderizar no servidor
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Alinha a borda esquerda do trilho com o `.page-container` (max-w-92rem
 * centrado + px-14). Sem isso, em telas acima de 1472px o título ficava
 * recuado e o primeiro card colado na borda.
 *
 * Usa `%` e não `vw` de propósito: `100vw` inclui a barra de rolagem, então
 * daria ~8px de diferença do container em navegadores com scrollbar clássica.
 */
const TRACK_PADDING = "pl-[max(3.5rem,calc((100%-92rem)/2+3.5rem))]";

function GalleryItem({
  item,
  index,
}: {
  item: (typeof portfolio)[number];
  index: number;
}) {
  return (
    // No desktop a largura é fixa para a legenda não alargar o item e manter o
    // espaçamento uniforme. O `min()` evita que o card encolha demais em telas
    // largas e baixas, onde 33vh virava ~200px.
    <figure className="group relative w-[82vw] shrink-0 snap-start md:w-[46vw] lg:w-[min(33vh,21rem)]">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-coal md:aspect-[3/4] lg:h-[min(44vh,28rem)]">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          sizes="(min-width: 1024px) 38vw, 82vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent opacity-60" />
        {/* Faísca no hover — reforça o tema sem custo de canvas */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(80%_100%_at_50%_100%,rgba(255,90,20,0.45),transparent_70%)] mix-blend-screen" />
        </div>
        <span className="absolute left-5 top-5 text-[10px] font-semibold uppercase tracking-micro text-bone/90">
          {item.category}
        </span>
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-xl uppercase text-bone transition-colors duration-300 group-hover:text-maguilaRed md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-bone/60">{item.description}</p>
        </div>
        <span className="text-[11px] font-semibold tracking-micro text-maguilaRed">
          0{index + 1}
        </span>
      </figcaption>
    </figure>
  );
}

function GalleryHeader() {
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
      <p className="max-w-sm text-sm leading-relaxed text-bone/60 md:text-right">
        Registros reais de produções que contaram com o time MaguilaFX —
        de cerimônias íntimas a arenas lotadas.
      </p>
    </motion.div>
  );
}

function MobileGallery() {
  return (
    <div className="bg-ink py-24 lg:hidden">
      <GalleryHeader />
      {/* scroll-pl-5: sem isso o snap alinha pelo border-box e come o px-5,
          deixando o primeiro card colado na borda da tela */}
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-pl-5 px-5 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {portfolio.map((item, i) => (
          <GalleryItem key={item.src} item={item} index={i} />
        ))}
      </div>
      <p className="page-container mt-2 text-[10px] font-semibold uppercase tracking-micro text-bone/55">
        Arraste para o lado →
      </p>
    </div>
  );
}

function DesktopGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      // Escondido no mobile via CSS: scrollWidth é 0 e não há o que medir.
      if (!track || track.offsetParent === null) {
        setRange(0);
        return;
      }
      setRange(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  return (
    <div className="hidden bg-ink lg:block">
      <div
        ref={containerRef}
        style={{ height: range ? `calc(100vh + ${range}px)` : undefined }}
        className="relative"
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-10">
          <GalleryHeader />
          <motion.div
            ref={trackRef}
            style={{ x }}
            className={`mt-10 flex w-max gap-7 pr-24 will-change-transform ${TRACK_PADDING}`}
          >
            {portfolio.map((item, i) => (
              <GalleryItem key={item.src} item={item} index={i} />
            ))}

            {/* CTA final da galeria */}
            <a
              href="#contato"
              className="group flex h-[min(44vh,28rem)] w-[min(33vh,21rem)] shrink-0 items-center justify-center self-start border border-bone/20 transition-colors duration-500 hover:border-maguilaRed hover:bg-maguilaRed/5"
            >
              <div className="text-center">
                <p className="font-display text-3xl uppercase leading-tight text-bone">
                  Seu evento
                  <br />
                  <span className="text-maguilaRed">é o próximo?</span>
                </p>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-micro text-bone/60 transition-colors group-hover:text-bone">
                  Fale com a gente →
                </p>
              </div>
            </a>
          </motion.div>

          {/* Barra de progresso */}
          <div className="page-container mt-10">
            <div className="h-px w-full bg-bone/15">
              <motion.div
                style={{ scaleX: scrollYProgress }}
                className="h-full w-full origin-left bg-maguilaRed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  // Antes isto era decidido em JS (useIsDesktop), o que fazia o desktop montar
  // a galeria mobile, desmontar e remontar a horizontal — com salto visível.
  // Agora as duas versões vêm do servidor e quem escolhe é o CSS.
  return (
    <section id="portfolio">
      <MobileGallery />
      <DesktopGallery />
    </section>
  );
}
