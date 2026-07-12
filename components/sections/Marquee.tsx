"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const items = [
  "Pirotecnia",
  "Faísca Fria",
  "Jatos de CO₂",
  "Chamas",
  "Confete",
  "Laser",
  "Low Fog",
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
};

function Sequence() {
  return (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-6 md:gap-10">
          <span
            className={`font-display text-5xl uppercase leading-none md:text-7xl ${
              i % 2 === 0 ? "text-stroke" : "text-bone/90"
            }`}
          >
            {item}
          </span>
          <span className="text-2xl text-maguilaRed md:text-3xl" aria-hidden>
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

/**
 * Marquee que reage à velocidade do scroll: acelera quando o usuário rola,
 * inverte a direção quando rola para cima e ganha uma leve inclinação.
 */
export function Marquee() {
  const prefersReduced = useReducedMotion();

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const skewX = useTransform(smoothVelocity, [-1200, 1200], [-3, 3]);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;

    let moveBy = direction.current * 2 * (delta / 1000);

    const vf = velocityFactor.get();
    if (vf < 0) direction.current = 1;
    else if (vf > 0) direction.current = -1;

    moveBy += direction.current * moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-bone/10 bg-ink py-6 md:py-8"
    >
      <motion.div
        style={{ x, skewX }}
        className="flex w-max gap-6 pr-6 will-change-transform md:gap-10 md:pr-10"
      >
        <div className="flex shrink-0 items-center gap-6 md:gap-10">
          <Sequence />
        </div>
        <div className="flex shrink-0 items-center gap-6 md:gap-10">
          <Sequence />
        </div>
      </motion.div>
    </section>
  );
}
