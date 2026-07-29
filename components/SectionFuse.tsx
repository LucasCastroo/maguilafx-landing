"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.33, 1, 0.68, 1] as const;
const DURATION = 1.7;

/**
 * Transição entre seções: um estopim que acende da esquerda para a direita
 * quando entra em tela. Substitui o corte seco entre `bg-ink` e `bg-coal`.
 *
 * O `whileInView` fica no contêiner, não nos filhos: os filhos começam em
 * scaleX(0)/x(-100%), o que zera a largura do bounding box deles e faz o
 * IntersectionObserver (com margem negativa) nunca acusar interseção — a
 * animação travava antes de começar. O contêiner tem largura total e nunca
 * é transformado, então serve de gatilho confiável.
 */
const trail: Variants = {
  unlit: { scaleX: 0 },
  lit: { scaleX: 1, transition: { duration: DURATION, ease: EASE } },
};

const ember: Variants = {
  unlit: { x: "-100%" },
  lit: { x: "0%", transition: { duration: DURATION, ease: EASE } },
};

export function SectionFuse() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div aria-hidden className="h-px w-full bg-bone/10" />;
  }

  return (
    <motion.div
      aria-hidden
      initial="unlit"
      whileInView="lit"
      viewport={{ once: true, margin: "-15%" }}
      className="relative h-px w-full bg-bone/10"
    >
      {/* rastro queimado que fica depois da passagem */}
      <motion.div
        variants={trail}
        className="absolute inset-0 origin-left bg-gradient-to-r from-maguilaRed/70 via-ember/60 to-maguilaGold/40"
      />

      {/* a brasa correndo na ponta do estopim */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div variants={ember} className="absolute inset-0">
          <span className="absolute right-0 top-1/2 h-[6px] w-[6px] -translate-y-1/2 rounded-full bg-maguilaGold shadow-[0_0_18px_5px_rgba(255,122,26,0.85)]" />
          <span className="absolute right-0 top-1/2 h-[2px] w-24 -translate-y-1/2 bg-gradient-to-l from-ember to-transparent" />
        </motion.div>
      </div>
    </motion.div>
  );
}
