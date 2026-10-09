// Data akun untuk layar HP (PhoneScreen).
// Fitur "Cari & ganti akun" membaca array ini — untuk portofolio socials
// berikutnya cukup tambahkan object baru ke array, strukturnya:
//   {
//     username, name, avatar?, bio,
//     stats: { posts, followers, following },
//     posts: [{ id, images: [path...], title, caption }]
//   }
// `avatar` boleh dihilangkan — UI otomatis menampilkan inisial berwarna.
export const accountsData = [
  {
    username: "monkbike.jogja",
    name: "MonkBike Jogja",
    avatar: "/assets/sosmed/profil.webp",
    bio: "Eksplorasi Brand & Media Sosial — Projek Fiktif Bersepeda di Yogyakarta 🚲☕",
    stats: { posts: 6, followers: "1.312", following: 1312 },
    posts: [
      {
        id: "post-1",
        images: [
          "/assets/sosmed/apparel.webp"
        ],
        title: "Apparel & Identity",
        caption: "Desain apparel eksklusif dan variasi logo resmi MonkBike Jogja."
      },
      {
        id: "post-2",
        images: [
          "/assets/sosmed/new.webp"
        ],
        title: "Packaging Design",
        caption: "Konsep desain kemasan cup minuman kopi siap saji untuk komunitas pesepeda."
      },
      {
        id: "post-3",
        images: [
          "/assets/sosmed/bikeday.webp"
        ],
        title: "Store Signage & Poster",
        caption: "Poster promosi dan tata visual signage outlet fisik MonkBike."
      },
      {
        id: "post-4",
        images: [
          "/assets/sosmed/article1.webp",
          "/assets/sosmed/article2.webp"
        ],
        title: "Editorial & Merchandise",
        caption: "Katalog merchandise dan layout artikel buletin komunitas."
      },
      {
        id: "post-5",
        images: [
          "/assets/sosmed/best1.webp",
          "/assets/sosmed/best2.webp",
          "/assets/sosmed/best3.webp",
          "/assets/sosmed/best4.webp"
        ],
        title: "Menu Board & Pricing",
        caption: "Desain visual menu board kafe ramah sepeda dengan tata letak minimalis."
      },
      {
        id: "post-6",
        images: [
          "/assets/sosmed/event1.webp",
          "/assets/sosmed/event2.webp",
          "/assets/sosmed/event3.webp"
        ],
        title: "Event & Ride Announcement",
        caption: "Materi kampanye media sosial untuk kegiatan gowes bersama dan workshop sepeda."
      }
    ]
  }
];
