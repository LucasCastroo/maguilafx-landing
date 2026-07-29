/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF corta bastante sobre WebP nestas fotos (muito gradiente escuro)
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
