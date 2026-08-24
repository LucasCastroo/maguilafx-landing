"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useIntro } from "@/components/IntroProvider";
import { useDeviceProfile } from "@/lib/useDeviceProfile";
import { heroSources } from "@/lib/videoSources";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const { introDone } = useIntro();
  const prefersReduced = useReducedMotion();
  const isHeroInView = useInView(ref, { amount: 0.2 });
  const device = useDeviceProfile();

  // Em rede lenta ou com economia de dados a imagem de fundo já conta a
  // história — não vale gastar megabytes do usuário para reforçá-la.
  const showVideo = !prefersReduced && device.resolved && !device.frugal;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const syncPlayback = () => {
      if (cancelled) return;

      const shouldPlay =
        introDone &&
        isHeroInView &&
        !prefersReduced &&
        !pausedByUser &&
        document.visibilityState === "visible";

      if (!shouldPlay) {
        video.pause();
        return;
      }

      if (!video.paused) return;

      void video
        .play()
        .then(() => {
          if (!cancelled) setAutoplayBlocked(false);
        })
        .catch((error: unknown) => {
          if (cancelled) return;
          const name = (error as DOMException)?.name;

          // iOS em Modo de Baixo Consumo recusa autoplay mesmo mudo e inline.
          // Nesse caso o play só sai de um gesto — então revelamos o botão.
          if (name === "NotAllowedError") setAutoplayBlocked(true);

          // AbortError significa que um pause() cortou este play() no meio, ou
          // que ainda não havia dado suficiente. Não é bloqueio: os eventos de
          // mídia abaixo chamam esta função de novo quando der.
        });
    };

    syncPlayback();

    // Sem estes ouvintes, um play() que falhasse por falta de buffer só seria
    // retentado na próxima mudança de dependência — que pode nunca vir. Eram
    // as falhas intermitentes de carregamento do vídeo da hero.
    video.addEventListener("loadeddata", syncPlayback);
    video.addEventListener("canplay", syncPlayback);
    video.addEventListener("stalled", syncPlayback);
    video.addEventListener("suspend", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", syncPlayback);
      video.removeEventListener("canplay", syncPlayback);
      video.removeEventListener("stalled", syncPlayback);
      video.removeEventListener("suspend", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      // Sem pause() aqui de propósito: o cleanup roda a cada mudança de
      // dependência, e pausar em cima de um play() pendente era justamente o
      // que gerava o AbortError. Ao desmontar, o elemento sai do DOM e para
      // sozinho; enquanto montado, quem decide pausar é o syncPlayback.
    };
  }, [introDone, isHeroInView, pausedByUser, prefersReduced, showVideo]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      setPausedByUser(false);
      setAutoplayBlocked(false);
      void video.play().catch(() => undefined);
    } else {
      setPausedByUser(true);
      video.pause();
    }
  };

  return (
    <section
      ref={ref}
      id="inicio"
      className="relative h-[84svh] min-h-[min(32rem,100svh)] max-h-[60rem] overflow-hidden bg-ink"
    >
      <Image
        src="/images/background/background-3.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {showVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          // No desktop o vídeo é a peça central acima da dobra: vale bufferizar
          // adiantado para não haver espera. No celular fica em `metadata` para
          // não gastar dado de quem talvez nem role a página.
          preload={device.compact ? "metadata" : "auto"}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => {
            setHasStarted(true);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          // O fade espera a reprodução começar de verdade, não só o arquivo
          // carregar: se o autoplay for barrado, fica a arte de fundo em vez
          // de um quadro congelado.
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hasStarted ? "opacity-100" : "opacity-0"
          }`}
        >
          {heroSources(device.compact).map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      {/* Contraste concentrado somente na área da chamada. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,8,0.72)_0%,rgba(7,7,8,0.34)_34%,rgba(7,7,8,0.08)_58%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,8,0.5)_0%,rgba(7,7,8,0.12)_36%,transparent_58%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={introDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={{ duration: 1, delay: 0.12, ease: EASE }}
        className="page-container absolute inset-0 z-10 flex items-end pb-20 md:pb-16 lg:pb-20"
      >
        <div className="max-w-[46rem]">
          <h1 className="max-w-[9ch] text-balance font-sans text-[clamp(3.4rem,6.8vw,6.8rem)] font-bold leading-[0.9] tracking-[-0.055em] text-bone [text-shadow:0_3px_28px_rgba(0,0,0,0.72)]">
            Acenda o inesquecível.
          </h1>

          <a
            href="#contato"
            className="hero-impact-button mt-7 inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold md:mt-9"
          >
            <span aria-hidden="true" className="hero-impact-button__combustion" />
            <span aria-hidden="true" className="hero-impact-button__heat" />
            <span aria-hidden="true" className="hero-impact-button__surface" />
            <span className="hero-impact-button__label">
              Quero essa experiência
              <span aria-hidden="true" className="hero-impact-button__arrow">
                →
              </span>
            </span>
          </a>
        </div>
      </motion.div>

      {showVideo && (hasStarted || autoplayBlocked) && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
          className="absolute bottom-6 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-bone/25 bg-ink/30 text-bone backdrop-blur-sm transition-colors hover:bg-bone hover:text-ink md:bottom-9 md:right-10 md:h-14 md:w-14 lg:right-14"
        >
          {isPlaying ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-current"
            >
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="ml-0.5 h-5 w-5 fill-current"
            >
              <path d="M8 5.5v13l10-6.5z" />
            </svg>
          )}
        </button>
      )}
    </section>
  );
}
