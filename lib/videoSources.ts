export type VideoSource = { src: string; type: string };

const HEVC = 'video/mp4; codecs="hvc1"';
const H264 = "video/mp4";

/**
 * HEVC vem primeiro: o Safari o escolhe e baixa ~40% menos bytes que o H.264
 * na mesma qualidade — justamente a plataforma que estava sofrendo. Quem não
 * souber decodificar simplesmente cai na `<source>` seguinte.
 */
export function heroSources(compact: boolean): VideoSource[] {
  const size = compact ? "720" : "1080";
  return [
    { src: `/videos/hero-${size}.hevc.mp4`, type: HEVC },
    { src: `/videos/hero-${size}.mp4`, type: H264 },
  ];
}

export const aboutLoopSources: VideoSource[] = [
  { src: "/videos/about-720.hevc.mp4", type: HEVC },
  { src: "/videos/about-720.mp4", type: H264 },
];

/**
 * O scrub fica em H.264 com GOP curto (keyframe a cada 5 quadros): seek é
 * muito mais barato de decodificar que em HEVC, e aqui o que importa é o
 * custo de cada busca, não o tamanho do arquivo.
 */
export const ABOUT_SCRUB_SRC = "/videos/about-1080.mp4";

export const HERO_POSTER = "/images/posters/hero-poster.jpg";
export const ABOUT_POSTER = "/images/posters/about-poster.jpg";
