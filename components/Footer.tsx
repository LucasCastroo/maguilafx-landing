"use client";

import { motion } from "framer-motion";
import { navItems, WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-bone/10 bg-ink">
      <div className="page-container pt-16 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-bone/50">
              Transformando eventos em experiências visuais inesquecíveis com
              pirotecnia e efeitos especiais de alto nível.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-micro text-bone/40">
              Navegação
            </p>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-medium uppercase tracking-wider text-bone/70 transition-colors hover:text-maguilaRed"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-micro text-bone/40">
              Conecte-se
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium uppercase tracking-wider text-bone/70 transition-colors hover:text-maguilaRed"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium uppercase tracking-wider text-bone/70 transition-colors hover:text-maguilaRed"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Wordmark gigante */}
        <motion.p
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.1, ease: EASE }}
          aria-hidden
          className="mt-16 select-none whitespace-nowrap text-center font-display text-[clamp(4rem,15.5vw,17rem)] leading-[0.8] text-bone/90 md:mt-20"
        >
          Maguila<span className="text-maguilaRed">FX</span>
        </motion.p>
      </div>

      <div className="border-t border-bone/10">
        <div className="page-container flex flex-col items-center justify-between gap-3 py-6 text-[11px] uppercase tracking-widest text-bone/30 md:flex-row">
          <p>© {new Date().getFullYear()} MaguilaFX. Todos os direitos reservados.</p>
          <p>Desenvolvido com tecnologia e paixão.</p>
        </div>
      </div>
    </footer>
  );
}
