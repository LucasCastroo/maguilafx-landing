/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF corta bastante sobre WebP nestas fotos (muito gradiente escuro)
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        // Por padrão a Vercel serve arquivos de `public/` com
        // `max-age=0, must-revalidate`: a borda responde rápido, mas o
        // navegador revalida a cada visita. Para mídia que quase nunca muda
        // isso é ida e volta desperdiçada em toda sessão.
        //
        // `stale-while-revalidate` dá o melhor dos dois: dentro de um dia o
        // vídeo sai do cache local instantaneamente; depois disso o navegador
        // ainda usa a cópia guardada na hora e atualiza em segundo plano. Um
        // arquivo trocado se propaga sem precisar renomear nada.
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=2592000",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
