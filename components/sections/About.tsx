"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const differentials = [
  "Equipe treinada e alinhada ao rider técnico",
  "Equipamentos profissionais e revisados",
  "Planejamento integrado com a produção",
  "Foco absoluto em segurança e impacto visual",
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={ref} id="sobre" className="overflow-hidden bg-ink py-24 md:py-36">
      <div className="page-container grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="kicker mb-6">Quem somos</p>
          <h2 className="display-title text-[clamp(2.6rem,6.5vw,5.2rem)]">
            A equipe por trás <br className="hidden md:block" />
            <span className="text-maguilaRed">do fogo.</span>
          </h2>

          <div className="mt-8 max-w-xl space-y-5 text-base leading-relaxed text-bone/70">
            <p>
              A MaguilaFX transforma palco em experiência imersiva. Do
              planejamento à execução, cuidamos de cada detalhe para que o seu
              público sinta o impacto de um grande espetáculo — com segurança,
              técnica e criatividade.
            </p>
            <p>
              Atuamos em shows, festivais, casamentos, formaturas e eventos
              corporativos: qualquer produção que precise de efeitos especiais
              profissionais para marcar a memória de quem vive a experiência.
            </p>
          </div>

          {/* Certificação — destaque editorial, sem card */}
          <div className="mt-10 border-l-2 border-maguilaRed pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-micro text-maguilaGold">
              Certificação Blaster Pirotécnico
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/60">
              Carteira oficial de Blaster: treinamento técnico e habilitação
              legal para manuseio de pirotecnia com segurança total.
            </p>
          </div>

          <ul className="mt-10">
            {differentials.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="flex items-baseline gap-4 border-b border-bone/10 py-4 first:border-t"
              >
                <span className="text-[10px] font-semibold tracking-micro text-maguilaRed">
                  0{i + 1}
                </span>
                <span className="text-sm font-medium uppercase tracking-wider text-bone/80">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Imagens com parallax */}
        <div className="relative">
          <motion.div
            style={{ y: imageY }}
            className="relative aspect-[4/5] w-full overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.15 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0"
            >
              <Image
                src="/images/equipe/img-equipe-ofc.png"
                alt="Equipe MaguilaFX em operação"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 48vw, 100vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-[10px] font-semibold uppercase tracking-micro text-bone/70">
                Palmas — Tocantins
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-micro text-bone/40"
          >
            <span>MaguilaFX — desde o primeiro clarão</span>
            <span className="text-maguilaGold">★ Nº1 no Tocantins</span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
