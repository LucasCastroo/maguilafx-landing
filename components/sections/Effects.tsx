"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { effects } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Effects() {
  const [activeId, setActiveId] = useState(effects[0].id);
  const active = effects.find((e) => e.id === activeId) ?? effects[0];

  return (
    <section id="equipamentos" className="relative bg-coal py-24 md:py-36">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="kicker mb-6">O arsenal</p>
            <h2 className="display-title text-[clamp(2.6rem,6.5vw,5.5rem)]">
              Efeitos que <br className="hidden md:block" />
              <span className="text-maguilaRed">dominamos.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-bone/65 md:text-right">
            Equipamentos próprios, revisados e operados por equipe habilitada.
            Passe o mouse ou toque para explorar cada tecnologia.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          {/* Lista interativa */}
          <div className="order-2 lg:order-1">
            {effects.map((effect, i) => {
              const isActive = effect.id === activeId;
              return (
                <div key={effect.id} className="border-b border-bone/10 first:border-t">
                  <button
                    type="button"
                    onClick={() => setActiveId(effect.id)}
                    onMouseEnter={() => setActiveId(effect.id)}
                    className="group flex w-full items-baseline gap-5 py-5 text-left md:py-6"
                  >
                    <span
                      className={`text-[11px] font-semibold tracking-micro transition-colors ${
                        isActive ? "text-maguilaRed" : "text-bone/55"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={`font-display text-3xl uppercase leading-none transition-all duration-300 md:text-5xl ${
                        isActive
                          ? "translate-x-2 text-bone"
                          : "text-bone/45 group-hover:text-bone/75"
                      }`}
                    >
                      {effect.label}
                    </span>
                    <span
                      className={`ml-auto text-xl text-maguilaRed transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                  </button>

                  {/* Painel expandido no mobile */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="pb-8">
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <Image
                              src={effect.image}
                              alt={effect.title}
                              fill
                              className="object-cover"
                              sizes="100vw"
                            />
                          </div>
                          <p className="mt-5 text-sm leading-relaxed text-bone/70">
                            {effect.description}
                          </p>
                          <ul className="mt-4 space-y-2">
                            {effect.specs.map((spec) => (
                              <li
                                key={spec}
                                className="flex items-center gap-3 text-xs uppercase tracking-widest text-bone/65"
                              >
                                <span className="h-px w-4 bg-maguilaRed" />
                                {spec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Painel de imagem fixo (desktop) */}
          <div className="order-1 hidden lg:order-2 lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 45vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <h3 className="font-display text-2xl uppercase text-bone">
                        {active.title}
                      </h3>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70">
                        {active.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.ul
                  key={active.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 flex flex-wrap gap-x-8 gap-y-2"
                >
                  {active.specs.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-widest text-bone/65"
                    >
                      <span className="h-px w-4 bg-maguilaRed" />
                      {spec}
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
