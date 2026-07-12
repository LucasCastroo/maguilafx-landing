"use client";

import { useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

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
  const pointerRef = useRef({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-24%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Parallax de mouse no fundo (profundidade cinematográfica)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 18 });
  const parallaxX = useTransform(springX, (v) => v * -18);
  const parallaxY = useTransform(springY, (v) => v * -12);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(nx);
    mouseY.set(ny);
    pointerRef.current.x = nx;
    pointerRef.current.y = -ny;
  };

  return (
    <section
      ref={ref}
      id="inicio"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      {/* Mídia de fundo — vídeo quando disponível, foto enquanto isso */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0"
      >
        <motion.div
          style={{ x: parallaxX, y: parallaxY }}
          className="absolute inset-[-2.5%]"
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
      </motion.div>

      {/* Vinheta e leitura de texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      {/* Brilho quente de "palco" pulsando no rodapé da cena */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[45vh] animate-pulse-soft bg-[radial-gradient(62%_100%_at_50%_100%,rgba(255,84,20,0.2),transparent_70%)]"
      />

      {/* Partículas Three.js: brasas + explosões de fogos */}
      <div className="absolute inset-0 motion-reduce:hidden">
        <EmberCanvas pointer={pointerRef.current} />
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

        <div className="relative overflow-hidden">
          <h1 className="display-title text-[clamp(2.75rem,7.4vw,7.5rem)]">
            <RevealLine delay={BASE_DELAY + 0.08}>Momentos que</RevealLine>
            <RevealLine
              delay={BASE_DELAY + 0.18}
              className="text-maguilaRed drop-shadow-[0_6px_32px_rgba(255,42,42,0.45)]"
            >
              explodem
            </RevealLine>
            <RevealLine delay={BASE_DELAY + 0.28}>na memória.</RevealLine>
          </h1>

          {/* Varredura de luz única após a entrada do título */}
          <motion.div
            aria-hidden
            initial={{ x: "-140%", opacity: 0 }}
            animate={{ x: "440%", opacity: [0, 1, 0] }}
            transition={{
              delay: BASE_DELAY + 1.25,
              duration: 1.4,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-screen"
          />
        </div>

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
