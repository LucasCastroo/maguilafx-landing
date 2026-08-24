export type Effect = {
  id: string;
  label: string;
  title: string;
  description: string;
  specs: string[];
  image: string;
};

export const effects: Effect[] = [
  {
    id: "sparkular",
    label: "Sparkular",
    title: "Sparkular — Faísca Fria",
    description:
      "Pirotecnia indoor totalmente segura. Não queima, não gera fumaça e é perfeita para proximidade com o público. A escolha certa para casamentos, entradas triunfais e palcos onde a segurança é prioridade.",
    specs: ["Altura ajustável de 1m a 5m", "Uso indoor e outdoor", "Não queima a pele"],
    image: "/images/equipamentos/equipamento-1-sparkular.jpg",
  },
  {
    id: "flame",
    label: "Flame Machines",
    title: "Flame Machines",
    description:
      "Jatos de fogo reais controlados via DMX, com altura e duração ajustáveis para os momentos de clímax. O calor e o impacto visual que todo grande show merece.",
    specs: ["Chama real", "Controle DMX 512", "Sistema anti-tombamento"],
    image: "/images/equipamentos/equipamento-2-flame.png",
  },
  {
    id: "co2",
    label: "Jatos de CO₂",
    title: "Jatos de CO₂ & Fumaça",
    description:
      "Colunas de fumaça criogênica de desaparecimento instantâneo. O efeito gelado e explosivo perfeito para drops de música eletrônica e grandes revelações.",
    specs: ["Efeito criogênico gelado", "Desaparecimento instantâneo", "Sincronia com a música"],
    image: "/images/equipamentos/equipamento-3-co2.jpg",
  },
  {
    id: "smoke-bubble",
    label: "Smoke Bubble",
    title: "Smoke Bubble",
    description:
      "Bolhas de sabão recheadas com fumaça que liberam uma névoa mágica ao estourar. Um efeito lúdico, inovador e surpreendente para momentos especiais.",
    specs: ["Bolhas com fumaça", "Alto rendimento", "Efeito lúdico e fotogênico"],
    image: "/images/equipamentos/equipamento-4-bubble.jpg",
  },
  {
    id: "stadium-shot",
    label: "Stadium Shot",
    title: "Stadium Shot",
    description:
      "Disparos massivos de confete ou serpentina que cobrem a multidão em segundos. O grand finale perfeito para festivais e viradas de show.",
    specs: ["Alcance de até 20 metros", "Confete ou serpentina", "Acionamento elétrico imediato"],
    image: "/images/equipamentos/equipamento-5-shot.jpg",
  },
  {
    id: "laser",
    label: "Laser Holográfico",
    title: "Laser Holográfico",
    description:
      "Projeções laser de alta definição criando túneis, formas volumétricas e céus estrelados. Tecnologia que transforma a atmosfera inteira do ambiente.",
    specs: ["RGB full color", "Formas volumétricas 3D", "Sincronia total com a música"],
    image: "/images/equipamentos/equipamento-6-laser.jpg",
  },
  {
    id: "low-fog",
    label: "Gelo Seco",
    title: "Gelo Seco — Low Fog",
    description:
      "O clássico efeito de nuvens no chão. Fumaça densa que permanece baixa, criando um visual etéreo e romântico para valsas e performances artísticas.",
    specs: ["Fumaça baixa e densa", "Base de água ou gelo seco", "Sem resíduos ou cheiro"],
    image: "/images/equipamentos/equipamento-7-lowfog.jpg",
  },
];

export type PortfolioItem = {
  src: string;
  alt: string;
  category: string;
  title: string;
  description: string;
};

export const portfolio: PortfolioItem[] = [
  {
    src: "/images/shows/show-3.jpg",
    alt: "Grande queima de fogos em festival",
    category: "Festivais",
    title: "Turnês & Festivais",
    description: "Estruturas completas de efeitos para grandes palcos do Brasil.",
  },
  {
    src: "/images/casamentos/casamento-1.jpg",
    alt: "Cerimônia de casamento com faíscas frias",
    category: "Casamentos",
    title: "Cerimônias",
    description: "Faísca fria e elegância para momentos íntimos.",
  },
  {
    src: "/images/shows/show-5.jpg",
    alt: "DJ com máquinas de fogo no palco",
    category: "Eletrônico",
    title: "Music & Beats",
    description: "Sincronia perfeita entre drops e chamas.",
  },
  {
    src: "/images/shows/show-6.jpg",
    alt: "Show com painéis de LED e efeitos de fumaça",
    category: "Produções",
    title: "Grandes Produções",
    description: "Luz, vídeo e atmosfera integrados em profundidade de palco.",
  },
  {
    src: "/images/shows/show-1.jpg",
    alt: "Show indoor com pirotecnia",
    category: "Indoor",
    title: "Corporativo & Indoor",
    description: "Efeitos seguros e controlados para ambientes fechados.",
  },
  {
    src: "/images/shows/show-balsas.jpg",
    alt: "Efeitos especiais sobre balsas",
    category: "Especiais",
    title: "Projetos Especiais",
    description: "Operações fora do padrão — água, altura e logística complexa.",
  },
];

export const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Efeitos", href: "#equipamentos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://maguilafx-landing.vercel.app";
export const WHATSAPP_URL = "https://wa.me/556392252302";
export const INSTAGRAM_URL = "https://instagram.com/maguilafx";
