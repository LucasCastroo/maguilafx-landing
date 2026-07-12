"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const DURATION_MS = 1200;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // easing para o contador acelerar no fim
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDone(true);
        document.documentElement.style.overflow = "";
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative h-20 w-20 md:h-24 md:w-24"
          >
            <Image
              src="/images/logos/logo-mini-light.png"
              alt="MaguilaFX"
              fill
              priority
              className="object-contain"
              sizes="96px"
            />
          </motion.div>

          <div className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-6 md:px-12">
            <p className="text-[10px] font-semibold uppercase tracking-micro text-bone/40">
              Efeitos pirotécnicos &amp; especiais
            </p>
            <p className="font-display text-5xl leading-none text-bone/90 md:text-6xl">
              {progress}
            </p>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-maguilaRed"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
