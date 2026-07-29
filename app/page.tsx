import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Effects } from "@/components/sections/Effects";
import { Portfolio } from "@/components/sections/Portfolio";
import { Stats } from "@/components/sections/Stats";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/Footer";
import { SectionFuse } from "@/components/SectionFuse";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-ink">
      <Hero />
      <Marquee />
      <Manifesto />
      <SectionFuse />
      <Effects />
      <SectionFuse />
      <Portfolio />
      <Stats />
      <About />
      <SectionFuse />
      <Contact />
      <Footer />
    </main>
  );
}
