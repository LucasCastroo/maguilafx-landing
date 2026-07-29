"use client";

import { useEffect, useRef } from "react";

/**
 * Rastro de brasa que segue o ponteiro no desktop.
 * Canvas 2D próprio (fora da árvore do React) para não causar re-render:
 * cada partícula é só posição, velocidade e vida.
 * Não monta em toque, em telas pequenas nem com prefers-reduced-motion.
 */
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

const MAX_SPARKS = 220;

export function EmberCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || !wide || reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sparks: Spark[] = [];
    const pointer = { x: -999, y: -999, prevX: -999, prevY: -999, moved: false };

    const onMove = (e: PointerEvent) => {
      pointer.prevX = pointer.x;
      pointer.prevY = pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.moved = true;
    };

    const spawn = () => {
      if (!pointer.moved) return;
      const dx = pointer.x - pointer.prevX;
      const dy = pointer.y - pointer.prevY;
      const speed = Math.hypot(dx, dy);
      // quanto mais rápido o mouse, mais faísca — igual atrito real
      const count = Math.min(6, Math.floor(speed / 9));

      for (let i = 0; i < count && sparks.length < MAX_SPARKS; i++) {
        const maxLife = 480 + Math.random() * 520;
        sparks.push({
          x: pointer.x + (Math.random() - 0.5) * 10,
          y: pointer.y + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.5 + dx * 0.02,
          vy: (Math.random() - 0.5) * 0.4 - 0.12,
          life: maxLife,
          maxLife,
          size: 0.7 + Math.random() * 1.9,
          hue: 18 + Math.random() * 28,
        });
      }
      pointer.moved = false;
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      spawn();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const t = s.life / s.maxLife;
        s.x += s.vx * (dt / 16);
        s.y += s.vy * (dt / 16);
        s.vy -= 0.008 * (dt / 16); // brasa sobe
        s.vx *= 0.985;

        const alpha = t * t * 0.9;
        const r = s.size * (0.35 + t);
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 4);
        grad.addColorStop(0, `hsla(${s.hue}, 100%, 72%, ${alpha})`);
        grad.addColorStop(0.4, `hsla(${s.hue - 8}, 100%, 52%, ${alpha * 0.5})`);
        grad.addColorStop(1, "hsla(12, 100%, 45%, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] hidden lg:block"
    />
  );
}
