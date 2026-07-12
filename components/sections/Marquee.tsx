const items = [
  "Pirotecnia",
  "Faísca Fria",
  "Jatos de CO₂",
  "Chamas",
  "Confete",
  "Laser",
  "Low Fog",
];

export function Marquee() {
  const sequence = (
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

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-bone/10 bg-ink py-6 md:py-8"
    >
      <div className="flex w-max animate-marquee gap-6 pr-6 will-change-transform md:gap-10 md:pr-10 motion-reduce:animate-none">
        <div className="flex shrink-0 items-center gap-6 md:gap-10">{sequence}</div>
        <div className="flex shrink-0 items-center gap-6 md:gap-10">{sequence}</div>
      </div>
    </section>
  );
}
