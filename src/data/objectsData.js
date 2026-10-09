export const OBJECTS = {
  Turntable: {
    id: 'Turntable',
    title: 'Turntable',
    label: 'Turntable',
    category: 'Music & Playlist',
    description: 'Listen to my favourite tracks.',
    hasDetail: false,
    hasTurntableControls: true,
    position: { top: '45.5%', left: '18.2%' }, // Tanda biru pada turntable
    image: '/assets/Turntable.webp',
    videoIn: '/assets/Hero-Turntable.webm',
    videoOut: '/assets/Turntable-Hero.webm',
    accentColor: '#ffffff',
  },
  Paper: {
    id: 'Paper',
    title: 'Paper',
    label: 'Profile & Resume',
    category: 'Profile & Curriculum Vitae',
    description: 'Everything about me',
    hasDetail: true,
    screenEntry: true, // Detail dibuka lewat teks interaktif di atas kertas
    screenHint: 'Klik teks pada kertas untuk langsung ke bagian profil',
    position: { top: '71%', left: '34.4%' }, // Tanda biru pada kertas putih (sebelah kiri keyboard)
    image: '/assets/Paper.webp',
    videoIn: '/assets/Hero-Paper.webm',
    videoOut: '/assets/Paper-Hero.webm',
    accentColor: '#ffffff',
  },
  PC: {
    id: 'PC',
    title: 'PC',
    label: 'Web Development and UI Design',
    category: 'Code & UI Design',
    description: 'Pengembangan platform web modern, sistem skala besar, dan antarmuka imersif.',
    hasDetail: true,
    screenEntry: true, // Semua interaksi PC berjalan di layar monitor (tanpa halaman detail)
    screenHint: 'Pilih UI Design / Web Development di monitor untuk melihat preview proyek',
    position: { top: '33.6%', left: '52.3%' }, // Tanda biru di tengah layar monitor PC
    image: '/assets/PC.webp',
    videoIn: '/assets/Hero-PC.webm',
    videoOut: '/assets/PC-Hero.webm',
    accentColor: '#ffffff',
  },
  Book: {
    id: 'Book',
    title: 'Book',
    label: 'Book of Books',
    category: 'Literature & Writing',
    description: 'Dokumentasi, catatan perancangan, dan publikasi ide serta riset.',
    hasDetail: true,
    position: { top: '69.2%', left: '81.8%' }, // Tanda biru pada buku merah (sebelah kanan)
    // Posisi buku merah pada frame Book.webp (dipakai animasi "ambil buku dari meja")
    liftAnchor: { left: 34.6, top: 30.6, width: 16.1, height: 36.6 },
    image: '/assets/Book.webp',
    videoIn: '/assets/Hero-Book.webm',
    videoOut: '/assets/Book-Hero.webm',
    accentColor: '#ffffff',
  },
  Phone: {
    id: 'Phone',
    title: 'Phone',
    label: 'Socials Design',
    category: 'Graphic Design & Social Media',
    description: 'Socials design and branding',
    hasDetail: true,
    screenEntry: true, // Feed / Grid / postingan diputar langsung di layar smartphone (tanpa halaman detail)
    screenHint: 'Klik Feed, Grid, atau postingan di layar HP',
    position: { top: '89.8%', left: '87.2%' }, // Tanda biru pada layar smartphone HP (bawah kanan)
    image: '/assets/Phone.webp',
    videoIn: '/assets/Hero-Phone.webm',
    videoOut: '/assets/Phone-Hero.webm',
    accentColor: '#ffffff',
  },
  Bike: {
    id: 'Bike',
    title: 'Bike',
    label: 'Cycling Journey',
    category: 'Journey & Lifestyle',
    description: 'Catatan perjalanan bersepeda, rute perkotaan, dan inspirasi ruang terbuka.',
    hasDetail: false,
    hasJourney: true,
    position: { top: '48.5%', left: '95.5%' }, // Tanda biru pada bagian atas helm sepeda putih
    image: '/assets/Bike.webp',
    videoIn: '/assets/Hero-Bike.webm',
    videoOut: '/assets/Bike-Hero.webm',
    accentColor: '#ffffff',
  },
};
