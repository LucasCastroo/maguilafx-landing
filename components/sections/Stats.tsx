"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent =
            String(Math.round(v)).padStart(2, "0") + suffix;
        }
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return <span ref={ref}>00{suffix}</span>;
}

const stats: { value: React.ReactNode; label: string }[] = [
  { value: <Counter to={7} />, label: "Tecnologias de efeitos no arsenal" },
  { value: <Counter to={100} suffix="%" />, label: "Operações com segurança certificada" },
  { value: "Nº1", label: "Referência no Estado do Tocantins" },
  { value: "BR", label: "Atuação em todo o território nacional" },
];

export function Stats() {
  return (
    <section className="border-y border-bone/10 bg-coal">
      <div className="page-container grid grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}
            className={`flex flex-col gap-3 border-bone/10 py-12 md:py-16 ${
              i > 0 ? "border-l pl-6 md:pl-10" : ""
            } ${i === 2 ? "border-l-0 border-t pl-0 lg:border-l lg:border-t-0 lg:pl-10" : ""} ${
              i === 3 ? "border-t lg:border-t-0" : ""
            }`}
          >
            <span className="font-display text-5xl leading-none text-maguilaRed md:text-7xl">
              {stat.value}
            </span>
            <span className="max-w-[220px] text-xs font-semibold uppercase tracking-widest text-bone/50">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
