/**
 * Kategori & proyek yang ditampilkan di layar monitor (state PC).
 * Alur di monitor: pilih kategori (UI Design / Web Development) → preview
 * proyek diganti dengan panah ‹ › → klik preview membuka `url` (Figma/website).
 *
 * Menambah proyek: cukup tambahkan entri di `items` — field yang dipakai:
 *   id, title, tag, desc, thumbnail (gambar preview), type ('figma'|'live'), url
 */
export const PC_CATEGORIES = {
  uiux: {
    id: 'uiux',
    label: 'UI Design',
    emoji: '🎨',
    description: 'Rancangan antarmuka pengguna interaktif, prototype aplikasi mobile, dan sistem desain.',
    items: [
      {
        id: 'ui-monkbike',
        title: 'UI MonkBike Mobile App',
        tag: 'Mobile App / E-Commerce',
        desc: 'Aplikasi belanja kebutuhan sepeda, booking service, dan pemesanan menu kafe ramah pesepeda dengan antarmuka modern.',
        thumbnail: '/assets/ui/monkbike_thumb.png',
        type: 'figma',
        figmaEmbed: 'https://embed.figma.com/design/9fQdLp6lYEyRJCnhDUjj0L/Monkbike?node-id=254-368&embed-host=share',
        url: 'https://www.figma.com/design/9fQdLp6lYEyRJCnhDUjj0L/Monkbike',
      },
    ],
  },
  frontend: {
    id: 'frontend',
    label: 'Web Development',
    emoji: '🧩',
    description: 'Pengembangan antarmuka web interaktif, animasi 3D, responsive layout, dan integrasi API.',
    items: [
      {
        id: 'desk-3d-portfolio',
        title: '3D Desk Interactive Portfolio',
        tag: 'React.js / Tailwind CSS / WebM Canvas',
        desc: 'Portofolio interaktif berbasis 3D desk render dengan seamless video transition, state machine, audio synthesize, dan mobile gesture pan.',
        thumbnail: '/assets/Hero.webp',
        type: 'live',
        url: 'https://github.com/isalikhwan165',
      },
      {
        id: 'portfolio-v1',
        title: 'Cloudflare Worker Web Portfolio',
        tag: 'HTML5 / CSS3 / JavaScript / Workers',
        desc: 'Situs portofolio personal generasi pertama dengan interaktivitas simulasi ponsel pintar dan flip-book digital.',
        thumbnail: '/assets/Paper.webp',
        type: 'live',
        url: 'https://portofolio.isalikhwan165.workers.dev/',
      },
    ],
  },
};
