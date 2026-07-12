"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

const EmberCanvas = dynamic(() => import("./EmberCanvas"), { ssr: false });

/**
 * Quando o cliente enviar o vídeo da hero:
 * 1. Salve o arquivo em /public/videos/hero.mp4 (H.264, sem áudio, ~10-20s em loop)
 * 2. Troque a constante abaixo para "/videos/hero.mp4"
 * O restante (partículas, overlays e tipografia) já está preparado.
 */
const HERO_VIDEO_SRC: string | null = null;

const EASE = [0.22, 1, 0.36, 1] as const;
const BASE_DELAY = 1.45; // entra logo após o preloader

function RevealLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    // py generoso para não cortar acentos maiúsculos (Ó em MEMÓRIA)
    <span className="block overflow-hidden py-[0.25em] -my-[0.25em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "115%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-24%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      {/* Mídia de fundo — vídeo quando disponível, foto enquanto isso */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0"
      >
        {HERO_VIDEO_SRC ? (
          <video
            src={HERO_VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <motion.div
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, delay: 1.1, ease: EASE }}
            className="h-full w-full"
          >
            <Image
              src="/images/background/background-1.png"
              alt="Show com queima de fogos MaguilaFX"
              fill
              priority
              className="object-cover brightness-[0.42] saturate-[1.1]"
              sizes="100vw"
            />
          </motion.div>
        )}
      </motion.div>

      {/* Vinheta e leitura de texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      {/* Partículas Three.js */}
      <div className="absolute inset-0 motion-reduce:hidden">
        <EmberCanvas />
      </div>

      {/* Conteúdo */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="page-container relative z-10 pb-24 pt-40 md:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: BASE_DELAY, ease: EASE }}
          className="kicker mb-6"
        >
          Efeitos pirotécnicos &amp; especiais
        </motion.p>

        <h1 className="display-title text-[clamp(3.4rem,11vw,10.5rem)]">
          <RevealLine delay={BASE_DELAY + 0.08}>Momentos que</RevealLine>
          <RevealLine delay={BASE_DELAY + 0.18} className="text-maguilaRed">
            explodem
          </RevealLine>
          <RevealLine delay={BASE_DELAY + 0.28}>na memória.</RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: BASE_DELAY + 0.45, ease: EASE }}
          className="mt-8 max-w-xl text-base leading-relaxed text-bone/70 md:text-lg"
        >
          Pirotecnia, chamas, CO₂, faísca fria e laser para shows, festivais,
          casamentos e grandes eventos — com segurança certificada e impacto
          de arena.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: BASE_DELAY + 0.6, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#contato" className="btn-primary">
            <span>Solicitar orçamento</span>
            <span aria-hidden>→</span>
          </a>
          <a href="#equipamentos" className="btn-ghost">
            Explorar efeitos
          </a>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE_DELAY + 1, duration: 1 }}
        className="absolute bottom-0 right-6 z-10 hidden flex-col items-center gap-4 pb-8 md:flex lg:right-12"
      >
        <span className="text-[10px] font-semibold uppercase tracking-micro text-bone/40 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <div className="h-16 w-px overflow-hidden bg-bone/15">
          <div className="h-full w-full animate-scroll-cue bg-maguilaRed" />
        </div>
      </motion.div>
    </section>
  );
}
