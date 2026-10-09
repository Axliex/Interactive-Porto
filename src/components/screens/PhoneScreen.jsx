import React, { useState, useEffect } from 'react';
import { accountsData } from '../../data/phoneData';
import {
  LayoutGrid,
  Rows3,
  Signal,
  Wifi,
  Battery,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
} from 'lucide-react';

const AVATAR_PALETTE = [
  'bg-blue-500/75',
  'bg-emerald-500/75',
  'bg-amber-500/75',
  'bg-fuchsia-500/75',
  'bg-rose-500/75',
  'bg-cyan-500/75',
];

function avatarInitials(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '@';
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

/** Foto akun; bila `avatar` kosong tampil inisial berwarna (untuk akun baru). */
function AccountAvatar({ account, className = 'h-[2.2em] w-[2.2em]' }) {
  if (account.avatar) {
    return (
      <img
        src={account.avatar}
        alt={account.name}
        draggable={false}
        className={`${className} shrink-0 rounded-full object-cover ring-1 ring-blue-400/50`}
      />
    );
  }
  const sum = [...(account.username || account.name || '')].reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );
  return (
    <span
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-full text-[0.72em] font-normal text-white ring-1 ring-white/20 ${
        AVATAR_PALETTE[sum % AVATAR_PALETTE.length]
      }`}
    >
      {avatarInitials(account.name || account.username)}
    </span>
  );
}

/**
 * Preview Socials Design yang berjalan langsung di layar HP di atas meja.
 *
 * Feed, Grid Galeri, dan tiap postingan diputar di tempat lewat state internal:
 * tidak ada halaman detail baru dengan mock HP besar, tidak ada transisi zoom
 * yang terasa seperti "mengambil" HP dari meja. Rasio kartu postingan 3:4
 * (potret) sesuai aset gambar.
 *
 * Ada pula pemilih akun ala pencarian Instagram: baris avatar di beranda membuka
 * daftar/cari akun (`src/data/phoneData.js`), jadi portofolio socials berikutnya
 * cukup ditambahkan sebagai akun baru.
 *
 * view: 'profile' (beranda) | 'feed' | 'grid' | 'accounts' (cari akun)
 */
export default function PhoneScreen() {
  const [view, setView] = useState('profile');
  const [accountIndex, setAccountIndex] = useState(0);
  const [postIndex, setPostIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [clock, setClock] = useState(() => new Date());
  const account = accountsData[accountIndex] || accountsData[0];

  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const timeString = clock.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const totalPosts = account.posts.length;
  const activeIndex = Math.min(Math.max(postIndex, 0), totalPosts - 1);
  const post = account.posts[activeIndex];
  const hasManyImages = post && post.images.length > 1;

  // Filter pencarian akun (ala search Instagram): cocok di username, nama, bio
  const normalizedQuery = query.trim().toLowerCase();
  const filteredAccounts = accountsData.filter((item) => {
    if (!normalizedQuery) return true;
    return [item.username, item.name, item.bio]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(normalizedQuery));
  });

  const openFeed = (index = 0) => {
    setPostIndex(index);
    setImageIndex(0);
    setView('feed');
  };
  const openGrid = () => setView('grid');
  const backToProfile = () => setView('profile');
  const openAccounts = () => {
    setQuery('');
    setView('accounts');
  };
  const selectAccount = (target) => {
    const nextIndex = accountsData.findIndex(
      (item) => item.username === target.username
    );
    if (nextIndex >= 0) setAccountIndex(nextIndex);
    setQuery('');
    setPostIndex(0);
    setImageIndex(0);
    setView('profile');
  };
  // Panah di feed = geser slide (gambar) dalam satu postingan, bukan pindah postingan
  const stepImage = (dir) => {
    const slides = post ? post.images.length : 0;
    if (slides < 2) return;
    setImageIndex((prev) => (prev + dir + slides) % slides);
  };

  // Tombol kembali di dalam layar HP (dipakai feed, grid, dan cari akun)
  const backButton = (
    <button
      type="button"
      onClick={backToProfile}
      title="Kembali ke beranda"
      aria-label="Kembali ke beranda profil"
      className="flex h-[1.9em] w-[1.9em] shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-neutral-300 transition-colors hover:border-blue-400/60 hover:bg-white/15 hover:text-white"
    >
      <ArrowLeft className="h-[1.05em] w-[1.05em]" />
    </button>
  );

  // Bar navigasi dalam layar HP (kembali ke beranda + judul + meta)
  const innerHeader = (title, meta) => (
    <div className="mt-[0.9em] flex shrink-0 items-center gap-[0.5em]">
      {backButton}
      <span className="min-w-0 flex-1 truncate text-[0.8em] font-normal text-white">
        {title}
      </span>
      {meta && (
        <span className="shrink-0 text-[0.66em] font-extralight text-neutral-500">
          {meta}
        </span>
      )}
    </div>
  );

  return (
    <div className="screen-ui-phone relative flex h-full w-full flex-col overflow-hidden bg-black">
      <div className="relative flex h-full min-h-0 w-full flex-col px-[1.1em] pt-[1.7em] pb-[0.9em] text-neutral-300">
        {/* Status bar */}
        <div className="flex shrink-0 items-center justify-between text-[0.85em] text-neutral-500">
          <span className="font-normal text-neutral-200">{timeString}</span>
          <span className="flex items-center gap-[0.35em]">
            <Signal className="h-[1em] w-[1em]" />
            <Wifi className="h-[1em] w-[1em]" />
            <Battery className="h-[1.25em] w-[1.25em]" />
          </span>
        </div>

        {/* ============ 1. BERANDA ============ */}
        {view === 'profile' && (
          <>
            {/* Akun — klik untuk cari/ganti akun (ala search Instagram) */}
            <button
              type="button"
              onClick={openAccounts}
              aria-label="Cari dan ganti akun"
              title="Cari & ganti akun"
              className="mt-[1em] flex w-full shrink-0 items-center gap-[0.6em] rounded-[0.5em] px-[0.25em] py-[0.15em] text-left transition-colors hover:bg-white/[0.07]"
            >
              <AccountAvatar account={account} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.95em] font-normal text-white">
                  {account.username}
                </span>
                <span className="block truncate text-[0.72em] font-extralight text-neutral-500">
                  Socials Design
                </span>
              </span>
              <ChevronDown className="h-[1.1em] w-[1.1em] shrink-0 text-neutral-500" />
            </button>

            {/* Statistik akun */}
            <div className="mt-[0.8em] flex shrink-0 items-center justify-between px-[0.2em] text-center">
              <div>
                <div className="text-[0.85em] font-normal text-white">
                  {account.stats.posts}
                </div>
                <div className="text-[0.62em] font-extralight text-neutral-500">Post</div>
              </div>
              <div>
                <div className="text-[0.85em] font-normal text-white">
                  {account.stats.followers}
                </div>
                <div className="text-[0.62em] font-extralight text-neutral-500">
                  Pengikut
                </div>
              </div>
              <div>
                <div className="text-[0.85em] font-normal text-white">
                  {account.stats.following}
                </div>
                <div className="text-[0.62em] font-extralight text-neutral-500">
                  Mengikuti
                </div>
              </div>
            </div>

            {/* Shortcut Feed & Grid — keduanya berjalan di tempat */}
            <div className="mt-[0.9em] grid shrink-0 grid-cols-2 gap-[0.5em]">
              <button
                type="button"
                onClick={() => openFeed(0)}
                className="flex items-center justify-center gap-[0.35em] rounded-[0.5em] border border-blue-400/35 bg-blue-500/15 py-[0.5em] text-[0.8em] text-blue-200 transition-all hover:border-blue-300 hover:bg-blue-500/30"
              >
                <Rows3 className="h-[1.1em] w-[1.1em]" />
                Feed
              </button>
              <button
                type="button"
                onClick={openGrid}
                className="flex items-center justify-center gap-[0.35em] rounded-[0.5em] border border-white/15 bg-white/[0.06] py-[0.5em] text-[0.8em] text-neutral-200 transition-all hover:border-white/40 hover:bg-white/15"
              >
                <LayoutGrid className="h-[1.1em] w-[1.1em]" />
                Grid
              </button>
            </div>

            {/* Daftar postingan — label menempel pada grid, blok dipusatkan */}
            <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto no-scrollbar pt-[0.6em]">
              <div className="flex shrink-0 items-center justify-between text-[0.68em] uppercase tracking-[0.2em] text-neutral-500">
                <span>Postingan</span>
                <span>{totalPosts}</span>
              </div>

              <div className="mt-[0.55em] grid shrink-0 grid-cols-3 content-start gap-[0.45em]">
                {account.posts.map((p, index) => (
                  <button
                    key={p.id}
                    type="button"
                    title={p.title}
                    onClick={() => openFeed(index)}
                    className="group relative aspect-[3/4] overflow-hidden rounded-[0.4em] bg-neutral-900 ring-1 ring-white/10 transition-all hover:ring-blue-400/70"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      draggable={false}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/75 px-[0.3em] text-center text-[0.62em] leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {p.title}
                    </span>
                    {p.images.length > 1 && (
                      <span className="absolute right-[0.3em] top-[0.3em] h-[0.4em] w-[0.4em] rounded-full bg-blue-400 shadow" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="shrink-0 pt-[0.7em] text-center text-[0.68em] font-extralight text-neutral-500">
              Klik Feed, Grid, postingan, atau avatar
            </div>
          </>
        )}

        {/* ============ 2. FEED (satu per satu) ============ */}
        {view === 'feed' && post && (
          <div className="flex min-h-0 flex-1 flex-col">
            {innerHeader(account.username, `${activeIndex + 1}/${totalPosts}`)}

            {/* Gambar postingan 3:4 (potret) */}
            <div className="relative mt-[0.6em] aspect-[3/4] w-full shrink-0 overflow-hidden rounded-[0.5em] bg-neutral-900 ring-1 ring-white/10">
              <img
                src={post.images[imageIndex] || post.images[0]}
                alt={post.title}
                draggable={false}
                className="h-full w-full object-cover"
              />

              {/* Panah = geser slide; hanya muncul bila postingan punya banyak gambar */}
              {hasManyImages && (
                <>
                  <button
                    type="button"
                    onClick={() => stepImage(-1)}
                    aria-label="Slide sebelumnya"
                    className="absolute left-0 top-1/2 flex h-[2.6em] w-[2.6em] -translate-y-1/2 items-center justify-center text-white/85 transition-colors hover:text-white"
                  >
                    <ChevronLeft className="h-[1.6em] w-[1.6em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => stepImage(1)}
                    aria-label="Slide berikutnya"
                    className="absolute right-0 top-1/2 flex h-[2.6em] w-[2.6em] -translate-y-1/2 items-center justify-center text-white/85 transition-colors hover:text-white"
                  >
                    <ChevronRight className="h-[1.6em] w-[1.6em] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
                  </button>
                </>
              )}

              {hasManyImages && (
                <>
                  <span className="absolute right-[0.4em] top-[0.4em] rounded-full bg-black/65 px-[0.5em] py-[0.1em] text-[0.6em] font-extralight text-white">
                    {imageIndex + 1}/{post.images.length}
                  </span>
                  <div className="absolute bottom-[0.45em] left-1/2 flex -translate-x-1/2 gap-[0.3em]">
                    {post.images.map((img, i) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        aria-label={`Gambar ${i + 1}`}
                        className={`h-[0.45em] rounded-full transition-all ${
                          imageIndex === i ? 'w-[1.1em] bg-blue-400' : 'w-[0.45em] bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Aksi sosial */}
            <div className="mt-[0.5em] flex shrink-0 items-center justify-between text-neutral-300">
              <span className="flex items-center gap-[0.75em]">
                <Heart className="h-[1.05em] w-[1.05em]" />
                <MessageCircle className="h-[1.05em] w-[1.05em]" />
                <Share2 className="h-[1.05em] w-[1.05em]" />
              </span>
              <Bookmark className="h-[1.05em] w-[1.05em]" />
            </div>

            {/* Keterangan postingan */}
            <div className="mt-[0.3em] min-h-0 flex-1 overflow-y-auto no-scrollbar">
              <div className="text-[0.78em] font-normal text-white">{post.title}</div>
              <p className="mt-[0.2em] text-[0.7em] font-extralight leading-snug text-neutral-400">
                <span className="font-normal text-white">{account.username} </span>
                {post.caption}
              </p>
            </div>

            {hasManyImages && (
              <div className="shrink-0 pt-[0.5em] text-center text-[0.65em] font-extralight text-neutral-500">
                ‹ › geser slide · {imageIndex + 1}/{post.images.length}
              </div>
            )}
          </div>
        )}

        {/* ============ 3. GRID GALERI ============ */}
        {view === 'grid' && (
          <div className="flex min-h-0 flex-1 flex-col">
            {innerHeader('Grid Galeri', `${totalPosts} postingan`)}

            <div className="mt-[0.6em] grid min-h-0 flex-1 grid-cols-2 content-start gap-[0.45em] overflow-y-auto no-scrollbar">
              {account.posts.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  title={p.title}
                  onClick={() => openFeed(idx)}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[0.4em] bg-neutral-900 ring-1 ring-white/10 transition-all hover:ring-blue-400/70"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/75 px-[0.3em] text-center text-[0.6em] leading-tight text-white opacity-0 transition-opacity group-hover:opacity-100">
                    {p.title}
                  </span>
                  {p.images.length > 1 && (
                    <span className="absolute right-[0.35em] top-[0.35em] h-[0.4em] w-[0.4em] rounded-full bg-blue-400 shadow" />
                  )}
                </button>
              ))}
            </div>

            <div className="shrink-0 pt-[0.5em] text-center text-[0.65em] font-extralight text-neutral-500">
              Klik postingan untuk membukanya
            </div>
          </div>
        )}

        {/* ============ 4. CARI & GANTI AKUN ============ */}
        {view === 'accounts' && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* Cari akun */}
            <div className="mt-[0.9em] flex shrink-0 items-center gap-[0.5em]">
              {backButton}
              <div className="flex min-w-0 flex-1 items-center gap-[0.4em] rounded-full border border-white/15 bg-white/[0.06] px-[0.7em] py-[0.35em] transition-colors focus-within:border-blue-400/55">
                <Search className="h-[1em] w-[1em] shrink-0 text-neutral-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari akun…"
                  aria-label="Cari akun"
                  className="min-w-0 flex-1 bg-transparent text-[0.75em] font-normal text-white placeholder:text-neutral-500 focus:outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Bersihkan pencarian"
                    className="shrink-0 text-neutral-500 transition-colors hover:text-white"
                  >
                    <X className="h-[1em] w-[1em]" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-[0.8em] flex shrink-0 items-center justify-between text-[0.68em] uppercase tracking-[0.2em] text-neutral-500">
              <span>Akun</span>
              <span>{filteredAccounts.length}</span>
            </div>

            <div className="mt-[0.4em] min-h-0 flex-1 overflow-y-auto no-scrollbar">
              {filteredAccounts.length === 0 && (
                <div className="pt-[1.5em] text-center text-[0.72em] font-extralight text-neutral-500">
                  Akun tidak ditemukan
                </div>
              )}

              {filteredAccounts.map((item) => {
                const isActive = item.username === account.username;
                return (
                  <button
                    key={item.username}
                    type="button"
                    data-account-row="1"
                    onClick={() => selectAccount(item)}
                    className={`flex w-full items-center gap-[0.6em] rounded-[0.55em] px-[0.35em] py-[0.5em] text-left transition-colors hover:bg-white/[0.07] ${
                      isActive ? 'bg-blue-500/10 ring-1 ring-blue-400/35' : ''
                    }`}
                  >
                    <AccountAvatar account={item} className="h-[2em] w-[2em]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.8em] font-normal text-white">
                        {item.username}
                      </span>
                      <span className="block truncate text-[0.66em] font-extralight text-neutral-500">
                        {item.name} · {item.posts.length} postingan
                      </span>
                    </span>
                    {isActive ? (
                      <Check className="h-[1.1em] w-[1.1em] shrink-0 text-blue-400" />
                    ) : (
                      <ChevronRight className="h-[1em] w-[1em] shrink-0 text-neutral-600" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="shrink-0 pt-[0.5em] text-center text-[0.65em] font-extralight text-neutral-500">
              Pilih akun untuk membuka portofolionya
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
