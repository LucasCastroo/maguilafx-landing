"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const TEXT =
  "Não montamos apenas efeitos. Coreografamos fogo, fumaça, faísca e luz no segundo exato para o seu público sentir o espetáculo, não apenas assistir.";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="bg-ink py-28 md:py-40">
      <div className="page-container">
        <p className="kicker mb-10">O que fazemos</p>
        <div ref={ref}>
          <p className="max-w-5xl font-sans text-3xl font-medium leading-[1.25] tracking-tight text-bone md:text-5xl">
            {words.map((word, i) => (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1) / words.length]}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
