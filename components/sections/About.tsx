"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useDeviceProfile } from "@/lib/useDeviceProfile";
import {
  ABOUT_POSTER,
  ABOUT_SCRUB_SRC,
  aboutLoopSources,
} from "@/lib/videoSources";

const FRAME_DURATION = 1 / 30;
const SCRUB_STEP = 1 / 30;
const RATE_CHANGE_THRESHOLD = 0.025;

const differentials = [
  "Equipe treinada e alinhada ao rider técnico",
  "Equipamentos profissionais e revisados",
  "Planejamento integrado com a produção",
  "Foco absoluto em segurança e impacto visual",
];

const SCRIM =
  "absolute inset-0 bg-[linear-gradient(to_top,rgba(7,7,8,0.94)_0%,rgba(7,7,8,0.66)_28%,rgba(7,7,8,0.2)_58%,transparent_82%)]";

function AboutContent() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-20 xl:gap-28">
      <div className="max-w-3xl">
        <p className="kicker mb-4 text-bone/70">Quem somos</p>
        <h2 className="display-title text-[clamp(2.65rem,7vw,6.25rem)] [text-shadow:0_3px_28px_rgba(0,0,0,0.85)]">
          A equipe por trás <br className="hidden sm:block" />
          <span className="text-maguilaRed">do fogo.</span>
        </h2>

        <div className="mt-5 max-w-2xl space-y-3 text-sm leading-relaxed text-bone/80 [text-shadow:0_2px_18px_rgba(0,0,0,0.9)] md:mt-7 md:text-base">
          <p>
            A MaguilaFX transforma palco em experiência imersiva. Do
            planejamento à execução, cuidamos de cada detalhe para que o seu
            público sinta o impacto de um grande espetáculo, com segurança,
            técnica e criatividade.
          </p>
          <p>
            Atuamos em shows, festivais, casamentos, formaturas e eventos
            corporativos: qualquer produção que precise de efeitos especiais
            profissionais para marcar a memória de quem vive a experiência.
          </p>
        </div>

        <div className="mt-6 max-w-xl border-l-2 border-maguilaRed pl-5 md:mt-8 md:pl-6">
          <p className="text-[10px] font-semibold uppercase tracking-micro text-maguilaGold md:text-[11px]">
            Certificação Blaster Pirotécnico
          </p>
          <p className="mt-2 text-xs leading-relaxed text-bone/75 [text-shadow:0_2px_14px_rgba(0,0,0,0.9)] md:text-sm">
            Carteira oficial de Blaster: treinamento técnico e habilitação
            legal para manuseio de pirotecnia com segurança total.
          </p>
        </div>
      </div>

      <div className="lg:pb-1">
        <p className="text-[10px] font-semibold uppercase tracking-micro text-bone/60">
          Nosso compromisso em campo
        </p>
        <ul className="mt-3 border-t border-bone/20 md:mt-5">
          {differentials.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline gap-4 border-b border-bone/15 py-3 md:py-4"
            >
              <span className="text-[10px] font-semibold tracking-micro text-maguilaRed">
                0{i + 1}
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-bone/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.9)] md:text-sm">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 flex flex-wrap items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-micro text-bone/65 md:text-[10px]">
          <span>MaguilaFX — Palmas, Tocantins</span>
          <span className="text-maguilaGold">★ Nº1 no Tocantins</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Foto de fundo, altura natural da seção, nenhum scroll extra.
 *
 * É o que o celular recebe: sem vídeo, sem sticky, sem `scale` animado — nada
 * que force o compositor durante a rolagem. Também serve a quem pediu menos
 * movimento.
 */
function AboutStatic({ image, priority }: { image: string; priority?: boolean }) {
  return (
    <section id="sobre" className="relative isolate overflow-hidden bg-ink">
      <Image
        src={image}
        alt=""
        fill
        priority={priority}
        className="-z-20 object-cover"
        sizes="100vw"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(7,7,8,0.97)_0%,rgba(7,7,8,0.78)_42%,rgba(7,7,8,0.48)_100%)]"
      />
      <div className="page-container relative py-24 md:py-36">
        <AboutContent />
      </div>
    </section>
  );
}

/**
 * Celular e tablet: o vídeo roda em loop simples como pano de fundo, na altura
 * natural da seção. Sem sticky de 260svh, sem scrub, sem `scale` animado —
 * nada que force o compositor durante o scroll. Só entra em cena quando a
 * seção se aproxima e pausa assim que sai, para não gastar bateria à toa.
 */
function AboutLoop({ allowVideo }: { allowVideo: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const nearViewport = useInView(ref, { once: true, margin: "600px 0px" });
  const inViewport = useInView(ref, { amount: 0.15 });
  const shouldLoad = allowVideo && nearViewport;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncPlayback = () => {
      if (inViewport && document.visibilityState === "visible") {
        // Autoplay barrado (Modo de Baixo Consumo) apenas mantém o poster —
        // não há botão a oferecer num fundo puramente decorativo.
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, [inViewport, shouldLoad]);

  return (
    <section
      ref={ref}
      id="sobre"
      className="relative isolate overflow-hidden bg-ink"
    >
      <Image
        src={ABOUT_POSTER}
        alt=""
        fill
        className="-z-20 object-cover"
        sizes="100vw"
      />

      {shouldLoad && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={() => setHasStarted(true)}
          className={`pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${
            hasStarted ? "opacity-100" : "opacity-0"
          }`}
        >
          {aboutLoopSources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )}

      <div aria-hidden className={`${SCRIM} -z-10`} />

      <div className="page-container relative py-24 md:py-36">
        <AboutContent />
      </div>
    </section>
  );
}

/**
 * Desktop com ponteiro preciso: o vídeo acompanha o scroll da seção.
 *
 * Ao avançar, persegue o progresso com playback sequencial em vez de seeks —
 * mesmo com GOP curto, tocar sai mais barato que buscar. Ao voltar, os seeks
 * ficam serializados e o último alvo vence.
 */
function AboutScrub() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef(0);
  const pendingProgressRef = useRef(0);
  const syncFrameRef = useRef<number | null>(null);
  const seekInFlightRef = useRef(false);
  const playRequestRef = useRef(false);
  const [videoReady, setVideoReady] = useState(false);

  const shouldLoadVideo = useInView(ref, { once: true, margin: "1500px 0px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 105,
    damping: 30,
    mass: 0.32,
    restDelta: 0.0005,
  });

  const contentY = useTransform(smoothProgress, [0.24, 0.54], [80, 0]);
  const contentOpacity = useTransform(smoothProgress, [0.22, 0.48], [0, 1]);
  const videoScale = useTransform(smoothProgress, [0, 1], [1.045, 1]);
  const scrimOpacity = useTransform(
    smoothProgress,
    [0, 0.32, 0.62],
    [0.3, 0.62, 1]
  );

  const scheduleVideoSync = useCallback((progress: number) => {
    pendingProgressRef.current = progress;
    if (syncFrameRef.current !== null || seekInFlightRef.current) return;

    const syncVideo = () => {
      syncFrameRef.current = null;
      const video = videoRef.current;
      const duration = videoDurationRef.current;
      if (!video || !duration || video.readyState < 1 || video.seeking) return;

      const safeEnd = Math.max(0, duration - FRAME_DURATION);
      const targetTime = Math.max(
        0,
        Math.min(safeEnd, pendingProgressRef.current * safeEnd)
      );
      const difference = targetTime - video.currentTime;

      if (difference < -SCRUB_STEP) {
        const reverseTarget = Math.max(
          0,
          Math.min(safeEnd, Math.round(targetTime / SCRUB_STEP) * SCRUB_STEP)
        );

        video.pause();

        try {
          seekInFlightRef.current = true;
          video.currentTime = reverseTarget;
        } catch {
          seekInFlightRef.current = false;
        }
        return;
      }

      const forwardThreshold = video.paused
        ? FRAME_DURATION
        : FRAME_DURATION / 2;

      if (difference > forwardThreshold) {
        const nextPlaybackRate = Math.min(4, Math.max(0.12, difference * 8));
        if (
          Math.abs(video.playbackRate - nextPlaybackRate) >
          RATE_CHANGE_THRESHOLD
        ) {
          video.playbackRate = nextPlaybackRate;
        }

        if (video.paused && !playRequestRef.current) {
          playRequestRef.current = true;
          void video
            .play()
            .catch(() => undefined)
            .finally(() => {
              playRequestRef.current = false;
            });
        }

        syncFrameRef.current = requestAnimationFrame(syncVideo);
        return;
      }

      video.pause();
    };

    syncFrameRef.current = requestAnimationFrame(syncVideo);
  }, []);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    scheduleVideoSync(latest);
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markVideoReady = () => setVideoReady(true);
    const continueFromLatestProgress = () => {
      seekInFlightRef.current = false;
      scheduleVideoSync(pendingProgressRef.current);
    };
    const syncPageVisibility = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
      } else {
        scheduleVideoSync(pendingProgressRef.current);
      }
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markVideoReady();
    }

    video.addEventListener("loadeddata", markVideoReady);
    video.addEventListener("canplay", markVideoReady);
    video.addEventListener("seeked", continueFromLatestProgress);
    document.addEventListener("visibilitychange", syncPageVisibility);

    return () => {
      video.removeEventListener("loadeddata", markVideoReady);
      video.removeEventListener("canplay", markVideoReady);
      video.removeEventListener("seeked", continueFromLatestProgress);
      document.removeEventListener("visibilitychange", syncPageVisibility);
      seekInFlightRef.current = false;
      playRequestRef.current = false;
      video.pause();

      if (syncFrameRef.current !== null) {
        cancelAnimationFrame(syncFrameRef.current);
        syncFrameRef.current = null;
      }
    };
  }, [scheduleVideoSync, shouldLoadVideo]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    video.pause();
    videoDurationRef.current = video.duration;
    scheduleVideoSync(smoothProgress.get());
  };

  return (
    <section ref={ref} id="sobre" className="relative min-h-[260svh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        <Image
          src={ABOUT_POSTER}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />

        <motion.video
          ref={videoRef}
          src={shouldLoadVideo ? ABOUT_SCRUB_SRC : undefined}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={handleLoadedMetadata}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          // `initial` explícito: o `animate` só assume no primeiro frame do
          // framer-motion, e até lá o elemento ficaria opaco por cima do poster.
          initial={{ opacity: 0 }}
          animate={{ opacity: videoReady ? 1 : 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{ scale: videoScale }}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover [will-change:transform]"
        />

        <motion.div
          aria-hidden
          style={{ opacity: scrimOpacity }}
          className={SCRIM}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(105%_90%_at_0%_100%,rgba(7,7,8,0.62)_0%,rgba(7,7,8,0.2)_48%,transparent_78%)]"
        />

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-20 h-px bg-bone/10"
        >
          <motion.div
            style={{ scaleX: smoothProgress }}
            className="h-full origin-left bg-maguilaRed"
          />
        </div>
      </div>

      {/* O conteúdo permanece no fluxo para não ser cortado em telas baixas.
          A margem negativa o coloca sobre a mídia sticky. */}
      <div className="relative z-10 -mt-[100svh] min-h-[260svh]">
        <div className="page-container flex min-h-[260svh] items-end pb-[12svh]">
          <motion.div
            style={{ y: contentY, opacity: contentOpacity }}
            className="w-full [will-change:transform,opacity]"
          >
            <AboutContent />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const TEAM_PHOTO_REDUCED = "/images/equipe/img-equipe-ofc.jpg";

export function About() {
  const prefersReduced = useReducedMotion();
  const device = useDeviceProfile();

  if (prefersReduced) return <AboutStatic image={TEAM_PHOTO_REDUCED} />;
  if (device.resolved && device.canScrub) return <AboutScrub />;

  // Antes de resolver o perfil renderiza a versão leve sem vídeo: é o mesmo
  // HTML que o servidor produz, então não há divergência de hidratação.
  return <AboutLoop allowVideo={device.resolved && !device.frugal} />;
}
