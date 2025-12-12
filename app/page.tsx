"use client";

import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

const contatoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().min(2, "Estado obrigatório"),
  tipoEvento: z.string().min(2, "Informe o tipo de evento"),
  data: z.string().optional(),
  descricao: z.string().min(5, "Conte um pouco sobre o evento"),
});

type ContatoFormData = z.infer<typeof contatoSchema>;

const equipmentCategories = [
  {
    id: "sparkular",
    label: "Sparkular",
    title: "Sparkular (Faísca Fria)",
    description: "Efeito de pirotecnia indoor totalmente seguro. Não queima, não gera fumaça e é perfeito para proximidade. Ideal para casamentos, entradas triunfais e palcos menores onde a segurança é prioridade.",
    specs: ["Altura: Ajustável 1m a 5m", "Uso: Indoor e Outdoor", "Segurança: Não queima a pele"],
    image: "/images/equipamentos/equipamento-1-sparkular.png",
  },
  {
    id: "flame",
    label: "Flame Machines",
    title: "Flame Machines",
    description: "Jatos de fogo reais controlados via DMX. Altura e duração ajustáveis para momentos de clímax. O calor e o visual impactante que todo grande show merece.",
    specs: ["Chama Real", "Controle DMX 512", "Sistemas de Segurança Anti-Tombamento"],
    image: "/images/equipamentos/equipamento-2-flame.png",
  },
  {
    id: "co2",
    label: "Jatos CO²",
    title: "Jatos de CO² & Fumaça",
    description: "Colunas de fumaça criogênica de desaparecimento rápido. O efeito refrescante e visualmente explosivo, perfeito para drops de música eletrônica e revelações.",
    specs: ["Efeito Criogênico (Gelado)", "Desaparecimento Instantâneo"],
    image: "/images/equipamentos/equipamento-3-co2.jpg",
  },
  {
    id: "smoke-bubble",
    label: "Smoke Bubble",
    title: "Smoke Bubble",
    description: "Bolhas de sabão recheadas com fumaça. Ao estourarem, liberam uma névoa mágica. Um efeito lúdico, inovador e surpreendente para momentos especiais.",
    specs: ["Bolhas com Fumaça", "Alto rendimento de bolhas"],
    image: "/images/equipamentos/equipamento-4-bubble.png",
  },
  {
    id: "stadium-shot",
    label: "Stadium Shot",
    title: "Stadium Shot",
    description: "Disparos massivos de papel picado (confete) ou serpentinas. Cubra a multidão com cores e alegria em segundos. O grand finale perfeito para grandes festivais.",
    specs: ["Alcance: Até 20 metros", "Consumível: Papel ou Serpentina", "Acionamento elétrico imediato"],
    image: "/images/equipamentos/equipamento-5-shot.png",
  },
  {
    id: "laser",
    label: "Laser Holográfico",
    title: "Laser Holográfico",
    description: "Projeções laser de alta definição, criando túneis, formas geométricas 3D e 'céus estrelados'. Tecnologia que transforma a atmosfera do ambiente.",
    specs: ["Cores RGB Full Color", "Formas Geométricas e Volumétricas", "Sincronia total com a música"],
    image: "/images/equipamentos/equipamento-6-laser.jpg",
  },
  {
    id: "low-fog",
    label: "Gelo Seco",
    title: "Máquina de Gelo Seco (Low Fog)",
    description: "Efeito clássico de 'nuvens no chão'. A fumaça densa permanece baixa, criando um visual etéreo e romântico, ideal para valsas e performances artísticas.",
    specs: ["Efeito Nuvem (Fumaça Baixa)", "À base de água ou gelo seco", "Não deixa resíduos ou cheiro"],
    image: "/images/equipamentos/equipamento-7-lowfog.jpg",
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(equipmentCategories[0].id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContatoFormData>({
    resolver: zodResolver(contatoSchema),
  });

  const onSubmit = (data: ContatoFormData) => {
    let dataFormatada = 'Não definida';
    if (data.data) {
      const parts = data.data.split('-'); // YYYY-MM-DD
      if (parts.length === 3) {
        dataFormatada = `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        dataFormatada = data.data;
      }
    }

    const message = `*Olá, equipe MaguilaFX!* 👋\n\nEstou vindo do site e gostaria de solicitar um orçamento para um evento com efeitos especiais.\n\n*Nome:* ${data.nome}\n*Cidade e Estado do Evento:* ${data.cidade}/${data.estado}\n*Tipo de Evento:* ${data.tipoEvento}\n*Data Prevista:* ${dataFormatada}\n\n*Descrição do Evento:*\n${data.descricao}`;

    const whatsappUrl = `https://wa.me/556392154511?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    reset();
  };

  return (
    <main className="flex min-h-screen flex-col bg-maguilaDark">
      {/* HERO */}
      <section
        id="inicio"
        className="section-bg section-with-fire flex min-h-screen items-center"
        style={{
          ["--section-bg-image" as any]: "url('/images/background/background-1.png')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="section-inner page-container py-24"
        >
          <div className="mx-auto mt-5 flex max-w-4xl flex-col items-center text-center">
            {/* Logo */}
            <Image
              src="/images/logos/logo-full-light.png"
              alt="Logo MaguilaFX"
              width={1000}
              height={300}
              priority
              className="h-auto w-full max-w-[850px]"
            />

            {/* Ramo da empresa */}
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.5em] text-white/80 md:text-base">
              Produção de efeitos pirotécnicos para shows, festivais, casamentos, chá revelação e grandes eventos
            </p>

            {/* Redes Sociais */}
            <div className="mt-8 flex items-center justify-center gap-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/556392252302"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)]"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/maguilafx"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-[#E1306C] hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:shadow-[0_0_20px_rgba(225,48,108,0.4)]"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

          </div>
        </motion.div>
      </section>


      {/* EQUIPAMENTOS */}
      <section
        id="equipamentos"
        className="section-bg"
        style={{
          ["--section-bg-image" as any]: "url('/images/background/background-2.png')",
        }}
      >
        <div className="hidden">
          {equipmentCategories.map((cat) => (
            <Image
              key={cat.id}
              src={cat.image}
              alt={cat.title}
              width={1}
              height={1}
              priority
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="section-inner page-container py-20 md:py-24"
        >
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Nossos <span className="text-maguilaRed">Equipamentos</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-base text-white/80">
                Utilizamos tecnologia de ponta para garantir segurança e o máximo impacto visual.
                Conheça as máquinas que fazem a mágica acontecer.
              </p>
            </div>
            <div className="text-xs text-white/70">
              <p className="font-semibold text-white">
                Equipamentos próprios e revisados
              </p>
              <p>Segurança e performance garantidas.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row">
            {/* Navegação (Tabs) */}
            <div className="flex gap-2 overflow-x-auto pb-4 lg:w-1/4 lg:flex-col lg:overflow-visible lg:pb-0">
              {equipmentCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`group relative flex items-center rounded-xl p-4 text-left transition-all hover:bg-white/5 ${activeTab === cat.id
                    ? "bg-white/10 text-white shadow-glow"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  <div className="relative z-10 flex w-full items-center justify-between">
                    <span className="text-sm font-bold uppercase tracking-wider">
                      {cat.label}
                    </span>
                    {activeTab === cat.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="h-2 w-2 rounded-full bg-maguilaRed"
                      />
                    )}
                  </div>
                  {activeTab === cat.id && (
                    <motion.div
                      layoutId="activeTabBg"
                      className="absolute inset-0 rounded-xl border border-maguilaRed/30 bg-maguilaRed/5"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Conteúdo Dinâmico */}
            <div className="relative min-h-[450px] flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid gap-8 md:grid-cols-2 lg:gap-12"
                >
                  {/* Imagem Principal */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-black/50 md:aspect-square lg:aspect-[4/5]">
                    {/* Fallback visual caso a imagem não exista ainda */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black" />

                    <Image
                      src={
                        equipmentCategories.find((c) => c.id === activeTab)?.image || ""
                      }
                      alt={equipmentCategories.find((c) => c.id === activeTab)?.title || ""}
                      fill
                      className="relative z-10 object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Badge decorativa */}
                    <div className="absolute bottom-4 left-4 z-20 rounded-lg border border-white/20 bg-black/60 px-3 py-1.5 backdrop-blur">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-maguilaRed">
                        Profissional
                      </p>
                    </div>
                  </div>

                  {/* Informações */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold md:text-3xl text-white">
                        {equipmentCategories.find((c) => c.id === activeTab)?.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                        {
                          equipmentCategories.find((c) => c.id === activeTab)
                            ?.description
                        }
                      </p>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                        Especificações Técnicas
                      </p>
                      <ul className="space-y-2">
                        {equipmentCategories
                          .find((c) => c.id === activeTab)
                          ?.specs.map((spec, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-white/90">
                              <span className="h-1.5 w-1.5 rounded-full bg-maguilaRed" />
                              {spec}
                            </li>
                          ))}
                      </ul>
                    </div>


                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* PORTFÓLIO */}
      <section
        id="portfolio"
        className="section-bg"
        style={{
          ["--section-bg-image" as any]: "url('/images/background/background-5.png')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="section-inner page-container py-20 md:py-24"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold md:text-4xl">
                Portfólio de{" "}
                <span className="text-maguilaRed">Eventos Inesquecíveis</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-base text-white/80">
                Alguns registros de produções que contaram com o time MaguilaFX
                para elevar o impacto visual do espetáculo.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-maguilaRed">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Imagens reais do nosso trabalho
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Item Destaque 1 (Ocupa 2 colunas) */}
            <PortfolioCard
              className="md:col-span-2"
              src="/images/shows/show-3.jpg"
              alt="Grande queima de fogos em festival"
              titulo="Turnês e Festivais"
              descricao="Estruturas completas de efeitos especiais para acompanhar artistas e grandes festivais pelo Brasil. Soluções de alto impacto."
              priority
            />

            {/* Item Normal */}
            <PortfolioCard
              src="/images/casamentos/casamento-1.png"
              alt="Cerimônia de casamento com faíscas frias"
              titulo="Casamentos"
              descricao="Charme e elegância com sparkles para momentos íntimos."
              priority
            />

            {/* Item Normal */}
            <PortfolioCard
              src="/images/shows/show-5.jpg"
              alt="DJ com máquinas de fogo no palco"
              titulo="Eletrônico"
              descricao="Sincronia perfeita entre beats e chamas."
              priority
            />

            {/* Item Destaque 2 (Ocupa 2 colunas) */}
            <PortfolioCard
              className="md:col-span-2"
              src="/images/shows/show-6.JPG"
              alt="Show com painéis de LED e efeitos de fumaça"
              titulo="Grandes Produções"
              descricao="Integração total entre luz, vídeo e efeitos atmosféricos para criar profundidade de palco."
              priority
            />

            {/* Novos Items Adicionados */}
            {/* Item Destaque 3 (Ocupa 2 colunas) */}
            <PortfolioCard
              className="md:col-span-2"
              src="/images/shows/show-1.png"
              alt="Show indoor com pirotecnia"
              titulo="Corporativo & Indoor"
              descricao="Efeitos seguros e controlados para ambientes fechados, garantindo o espetáculo sem riscos."
              priority
            />

            {/* Item Normal */}
            <PortfolioCard
              src="/images/shows/show-balsas.JPG"
              alt="Detalhe de efeito especial"
              titulo="Efeitos Especiais"
              descricao="Detalhes que fazem a diferença na composição visual."
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* SOBRE A MAGUILAFX */}
      <section className="section-bg section-with-fire">
        <div id="sobre">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="section-inner page-container pt-20 pb-10 md:pt-24 md:pb-12"
          >
            <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-start">
              <div className="space-y-5">
                <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-maguilaGold/10 px-5 py-2.5 border border-maguilaGold/30 backdrop-blur-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-maguilaGold"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest text-maguilaGold shadow-black drop-shadow-sm">
                    Top 1 no Estado do Tocantins
                  </span>
                </div>
                <h2 className="text-3xl font-bold md:text-4xl">
                  Quem é a <span className="text-maguilaRed">MaguilaFX</span>?
                </h2>
                <p className="text-sm md:text-base text-white/80">
                  Somos um time dedicado a transformar palco em experiência
                  imersiva. Do planejamento à execução, cuidamos de cada detalhe
                  para que o seu público sinta o impacto de um grande espetáculo –
                  com segurança, técnica e criatividade.
                </p>
                <p className="text-sm md:text-base text-white/80">
                  Atuamos em shows, festivais, casamentos, formaturas, eventos
                  corporativos e qualquer produção que precise de{" "}
                  <strong>efeitos especiais profissionais</strong> para marcar a
                  memória de quem vive a experiência.
                </p>

                <div className="grid gap-4 text-sm text-white/85 md:grid-cols-2">
                  <div className="rounded-2xl bg-black/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maguilaGold">
                      Especialidades
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Chamas e pirotecnia de palco</li>
                      <li>• Faísca fria para cerimônias</li>
                      <li>• Jatos de CO₂ e fumaça</li>
                      <li>• Papel picado, fogos e efeitos de impacto</li>
                      <li>• Laser holográfico</li>
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-black/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-maguilaGold">
                      Diferenciais
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li>• Equipe treinada e alinhada ao rider técnico</li>
                      <li>• Equipamentos profissionais e revisados</li>
                      <li>• Planejamento integrado com produção</li>
                      <li>• Foco em segurança e impacto visual</li>
                    </ul>
                  </div>
                </div>


              </div>

              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-black/50">
                  <Image
                    src="/images/equipe/img-equipe-ofc.jpeg"
                    alt="Time MaguilaFX posicionado"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="mt-6 rounded-xl border border-maguilaRed/30 bg-gradient-to-r from-maguilaRed/10 to-transparent p-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-maguilaRed/20 p-2 text-maguilaRed">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Certificação Blaster Pirotécnico</h4>
                      <p className="mt-1 text-xs text-white/70">
                        Nossa empresa possui a carteira oficial de Blaster, comprovando treinamento técnico e habilitação legal para manuseio de pirotecnia com segurança total.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CONTATO */}
        <div id="contato">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="section-inner page-container pt-10 pb-20 md:pt-12 md:pb-24"
          >
            <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:items-center">
              <div className="space-y-5">
                <h2 className="text-3xl font-bold md:text-4xl">
                  Vamos colocar <span className="text-maguilaRed">fogo</span> no
                  seu próximo evento?
                </h2>
                <p className="max-w-xl text-sm md:text-base text-white/80">
                  Conte um pouco sobre o que você está planejando. Nosso time vai
                  analisar o evento e responder com uma proposta de efeitos
                  especiais sob medida.
                </p>

                <ul className="mt-4 space-y-2 text-sm text-white/80">
                  <li>• Atendimento para produtores, cerimonialistas e artistas</li>
                  <li>• Projetos personalizados para cada estrutura de palco</li>
                  <li>• Foco total em segurança e impacto visual</li>
                </ul>

                <div className="mt-6 text-sm text-white/70">
                  <p className="font-semibold text-white">Atuação em todo o Brasil*</p>
                  <p>
                    *Consulte condições de deslocamento e disponibilidade de datas.
                  </p>
                </div>
              </div>

              {/* Formulário */}
              <div className="rounded-3xl border border-white/15 bg-black/65 p-6 shadow-glow backdrop-blur">
                <h3 className="text-lg font-semibold">Preencha para receber contato</h3>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-4 space-y-4 text-sm"
                >
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      {...register("nome")}
                      className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                      placeholder="Como devemos te chamar?"
                    />
                    {errors.nome && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                        Cidade do evento
                      </label>
                      <input
                        type="text"
                        {...register("cidade")}
                        className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                        placeholder="Cidade"
                      />
                      {errors.cidade && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.cidade.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                        Estado
                      </label>
                      <input
                        type="text"
                        {...register("estado")}
                        className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                        placeholder="UF"
                      />
                      {errors.estado && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.estado.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                        Tipo de evento
                      </label>
                      <input
                        type="text"
                        {...register("tipoEvento")}
                        className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                        placeholder="Show, casamento, festival..."
                      />
                      {errors.tipoEvento && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.tipoEvento.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                        Data (se já tiver)
                      </label>
                      <input
                        type="date"
                        {...register("data")}
                        className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
                      Descrição
                    </label>
                    <textarea
                      rows={4}
                      {...register("descricao")}
                      className="w-full rounded-xl border border-white/20 bg-black/70 px-3 py-2 outline-none transition focus:border-maguilaRed"
                      placeholder="Público estimado, local, estrutura de palco, tipo de atração..."
                    />
                    {errors.descricao && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.descricao.message}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar proposta"}
                  </button>

                  <p className="mt-2 text-[11px] text-white/60 text-center">
                    Ao enviar, você autoriza contato via WhatsApp para
                    continuidade do atendimento.
                  </p>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-white/10 bg-black py-12 text-sm text-white/70">
        <div className="page-container">
          <div className="grid gap-10 md:grid-cols-4">
            {/* Coluna 1: Logo e Descrição */}
            <div className="space-y-4 md:col-span-2">
              <Image
                src="/images/logos/logo-full-light.png"
                alt="MaguilaFX"
                width={160}
                height={50}
                className="h-auto w-auto opacity-90"
              />
              <p className="max-w-xs text-white/60">
                Transformando eventos em experiências visuais inesquecíveis com
                pirotecnia e efeitos especiais de alto nível.
              </p>
            </div>

            {/* Coluna 2: Navegação */}
            <div>
              <h4 className="mb-4 font-semibold uppercase tracking-widest text-white">
                Navegação
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#inicio"
                    className="transition-colors hover:text-maguilaRed"
                  >
                    Início
                  </a>
                </li>
                <li>
                  <a
                    href="#equipamentos"
                    className="transition-colors hover:text-maguilaRed"
                  >
                    Equipamentos
                  </a>
                </li>
                <li>
                  <a
                    href="#portfolio"
                    className="transition-colors hover:text-maguilaRed"
                  >
                    Portfólio
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre"
                    className="transition-colors hover:text-maguilaRed"
                  >
                    Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#contato"
                    className="transition-colors hover:text-maguilaRed"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Redes Sociais */}
            <div>
              <h4 className="mb-4 font-semibold uppercase tracking-widest text-white">
                Conecte-se
              </h4>
              <div className="flex gap-4">
                {/* WhatsApp Icon */}
                <a
                  href="https://wa.me/556392252302"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition-colors hover:text-[#25D366]"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
                {/* Instagram Icon */}
                <a
                  href="https://instagram.com/maguilafx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition-colors hover:text-[#E1306C]"
                  aria-label="Instagram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
            <p>
              © {new Date().getFullYear()} MaguilaFX. Todos os direitos
              reservados.
            </p>
            <p>Desenvolvido com tecnologia e paixão.</p>
          </div>
        </div>
      </footer>
    </main >
  );
}

type PortfolioCardProps = {
  src: string;
  alt: string;
  titulo: string;
  descricao: string;
  className?: string;
  priority?: boolean;
};

function PortfolioCard({ src, alt, titulo, descricao, className = "", priority = false }: PortfolioCardProps) {
  return (
    <article className={`group relative overflow-hidden rounded-3xl bg-black/50 ${className}`}>
      {/* Imagem de Fundo com Zoom no Hover */}
      <div className="relative h-full min-h-[300px] w-full md:min-h-[450px]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Overlay Escuro para leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
      </div>

      {/* Conteúdo Sobreposto: Visível por padrão no Mobile, Animação no Desktop */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
        <h3 className="text-xl font-bold text-white transition-transform duration-500 md:translate-y-2 md:text-2xl md:group-hover:translate-y-0">
          {titulo}
        </h3>
        <p className="mt-2 text-sm text-white/80 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
          {descricao}
        </p>
      </div>
    </article>
  );
}
