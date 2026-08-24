export type VideoSource = { src: string; type: string };

const H264 = "video/mp4";

/**
 * Só H.264.
 *
 * Houve uma tentativa de servir HEVC primeiro para o Safari — ~35% menos bytes
 * na mesma qualidade. O problema é que o Safari anuncia suporte a `hvc1` e
 * escolhe essa `<source>`; se o decodificador do aparelho recusar o arquivo,
 * ele não volta atrás para a `<source>` seguinte, e o vídeo simplesmente não
 * toca. Foi o que aconteceu no iPhone. Os arquivos gerados pelo x265 estavam
 * formalmente corretos (Main/Main, nível 3.1/4.0, tag hvc1), mas o decodificador
 * da Apple é mais exigente do que o cabeçalho revela.
 *
 * H.264 High é universal e já temos a variante 720p cuidando da banda no
 * celular. Tocar em todo lugar vale mais que economizar megabytes.
 */
export function heroSources(compact: boolean): VideoSource[] {
  return [{ src: `/videos/hero-${compact ? "720" : "1080"}.mp4`, type: H264 }];
}

export const aboutLoopSources: VideoSource[] = [
  { src: "/videos/about-720.mp4", type: H264 },
];

/**
 * O scrub usa GOP curto (keyframe a cada 5 quadros): o que importa aqui é o
 * custo de cada busca, não o tamanho do arquivo.
 */
export const ABOUT_SCRUB_SRC = "/videos/about-1080.mp4";

export const HERO_POSTER = "/images/posters/hero-poster.jpg";
export const ABOUT_POSTER = "/images/posters/about-poster.jpg";
