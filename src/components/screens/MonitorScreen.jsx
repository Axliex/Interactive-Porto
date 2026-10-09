import React, { useEffect, useState } from 'react';
import { PC_CATEGORIES } from '../../data/pcData';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const ctaLabel = (project) =>
  project.type === 'figma' ? 'Buka di Figma' : 'Buka Website';

const targetLabel = (project) =>
  project.type === 'figma' ? 'Figma' : 'website';

/**
 * Preview portofolio yang berjalan sepenuhnya di layar monitor (state PC),
 * tanpa berpindah halaman:
 *
 *   1. view 'choice'   → dua pilihan: UI Design & Web Development
 *   2. view 'projects' → preview proyek sesuai kategori terpilih; proyek
 *                        diganti lewat panah ‹ › di sisi layar (juga ← → / Esc)
 *   3. klik preview / tombol CTA → buka website atau Figma proyek (tab baru)
 *
 * Tanpa latar panel saat menempel di monitor; hanya diberi latar saat mode
 * floating (panel terlepas dari objek).
 */
export default function MonitorScreen({ floating = false }) {
  const categories = Object.values(PC_CATEGORIES);
  const totalProjects = categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  const [view, setView] = useState('choice');
  const [categoryId, setCategoryId] = useState(null);
  const [index, setIndex] = useState(0);

  const category = categoryId ? PC_CATEGORIES[categoryId] : null;
  const items = category?.items ?? [];
  const safeIndex = items.length ? Math.min(index, items.length - 1) : 0;
  const item = items[safeIndex];

  const openCategory = (id) => {
    setCategoryId(id);
    setIndex(0);
    setView('projects');
  };

  const backToChoice = () => setView('choice');

  const step = (dir) => {
    if (items.length < 2) return;
    setIndex((current) => (current + dir + items.length) % items.length);
  };

  const openProject = (project) => {
    if (!project?.url) return;
    window.open(project.url, '_blank', 'noopener,noreferrer');
  };

  // Panah keyboard selama preview proyek terbuka
  useEffect(() => {
    if (view !== 'projects') return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        step(-1);
      } else if (event.key === 'Escape') {
        backToChoice();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, items.length]);

  return (
    <div
      className={`screen-ui-monitor relative flex h-full min-h-0 w-full flex-col overflow-hidden text-neutral-300 ${
        floating ? 'bg-[#05070a]/95 backdrop-blur-sm' : ''
      }`}
      data-pc-view={view}
      data-pc-cat={categoryId || ''}
      data-pc-index={safeIndex}
    >
      {view === 'choice' ? (
        /* ============================================================
         *  1. PILIHAN: UI Design  vs  Web Development
         * ============================================================ */
        <>
          <header className="flex items-end justify-between gap-[0.8em] px-[1.15em] pt-[1.05em]">
            <div className="min-w-0">
              <div className="text-[0.7em] uppercase tracking-[0.26em] text-neutral-500">
                Monitor · Portofolio
              </div>
              <h2 className="truncate text-[1.2em] font-normal text-white">
                Web Development &amp; UI Design
              </h2>
            </div>
            <span className="monitor-wide shrink-0 text-[0.75em] font-extralight text-neutral-500">
              {categories.length} kategori · {totalProjects} proyek
            </span>
          </header>

          <div className="monitor-grid grid min-h-0 flex-1 grid-cols-1 gap-[1.05em] overflow-y-auto p-[1.15em] no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => openCategory(cat.id)}
                aria-label={`Pilih kategori ${cat.label}`}
                className="group flex min-h-[11em] flex-col rounded-[0.85em] border border-white/10 bg-white/[0.03] p-[1.1em] text-left transition-all duration-300 hover:-translate-y-[0.15em] hover:border-emerald-400/50 hover:bg-emerald-400/[0.07] hover:shadow-[0_0_1.8em_rgba(16,185,129,0.16)]"
              >
                <span className="flex items-center justify-between gap-[0.6em]">
                  <span className="flex min-w-0 items-center gap-[0.55em]">
                    <span className="grid h-[2.1em] w-[2.1em] shrink-0 place-items-center rounded-[0.55em] bg-white/[0.07] text-[1em]">
                      {cat.emoji}
                    </span>
                    <span className="truncate text-[1.25em] font-normal text-white transition-colors group-hover:text-emerald-300">
                      {cat.label}
                    </span>
                  </span>
                  <ChevronRight className="h-[1.3em] w-[1.3em] shrink-0 text-neutral-500 transition-all group-hover:translate-x-[0.2em] group-hover:text-emerald-300" />
                </span>

                <span className="mt-[0.7em] block text-[0.8em] font-extralight leading-snug text-neutral-400">
                  {cat.description}
                </span>

                <span className="mt-[0.85em] flex min-h-0 flex-1 items-stretch gap-[0.5em]">
                  {cat.items.slice(0, 3).map((project) => (
                    <img
                      key={project.id}
                      src={project.thumbnail}
                      alt=""
                      draggable={false}
                      className="h-full min-h-[3.2em] min-w-0 flex-1 rounded-[0.35em] object-cover ring-1 ring-white/10 transition duration-300 group-hover:ring-emerald-400/40"
                    />
                  ))}
                </span>

                <span className="mt-auto block pt-[0.8em] text-[0.74em] uppercase tracking-[0.16em] text-emerald-400/85">
                  {cat.items.length} proyek · klik untuk preview
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 px-[1.15em] py-[0.6em] text-center text-[0.74em] font-extralight text-neutral-500">
            Pilih satu kategori — preview proyek tampil langsung di layar ini
          </div>
        </>
      ) : (
        /* ============================================================
         *  2. PREVIEW PROYEK + PANAH KIRI/KANAN
         * ============================================================ */
        <>
          <header className="flex items-center justify-between gap-[0.7em] px-[1.15em] pt-[1.05em]">
            <button
              type="button"
              onClick={backToChoice}
              className="group flex shrink-0 items-center gap-[0.4em] rounded-full border border-white/15 bg-white/[0.05] px-[0.85em] py-[0.38em] text-[0.8em] text-neutral-300 transition-all hover:border-emerald-400/45 hover:text-white active:scale-95"
            >
              <ArrowLeft className="h-[1em] w-[1em] transition-transform group-hover:-translate-x-[0.15em]" />
              Kategori
            </button>

            <div className="flex min-w-0 items-center gap-[0.45em]">
              <span aria-hidden="true">{category?.emoji}</span>
              <span className="truncate text-[0.95em] font-normal text-white">
                {category?.label}
              </span>
            </div>

            <span className="shrink-0 rounded-full border border-white/15 px-[0.7em] py-[0.28em] text-[0.74em] tabular-nums text-neutral-400">
              {safeIndex + 1} / {items.length}
            </span>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-[0.9em] p-[1.15em]">
            <div className="monitor-split relative flex min-h-0 flex-1 gap-[0.9em]">
              {/* ---------- Info proyek ---------- */}
              <div className="monitor-info flex min-h-0 flex-col">
                <span className="w-fit shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-[0.6em] py-[0.14em] text-[0.68em] uppercase tracking-[0.14em] text-emerald-300">
                  {item.tag}
                </span>

                <h3 className="mt-[0.55em] text-[1.2em] font-normal leading-snug text-white">
                  {item.title}
                </h3>

                <p className="monitor-desc mt-[0.5em] text-[0.84em] font-extralight leading-relaxed text-neutral-400">
                  {item.desc}
                </p>

                <div className="mt-auto flex shrink-0 flex-col gap-[0.45em] pt-[0.9em]">
                  <button
                    type="button"
                    onClick={() => openProject(item)}
                    className="group flex w-full items-center justify-center gap-[0.45em] rounded-full bg-white px-[1.1em] py-[0.6em] text-[0.85em] font-normal text-black transition-all duration-300 hover:bg-emerald-300 active:scale-95"
                  >
                    {ctaLabel(item)}
                    <ExternalLink className="h-[1em] w-[1em] transition-transform group-hover:-translate-y-[0.12em] group-hover:translate-x-[0.12em]" />
                  </button>
                  <span className="text-center text-[0.7em] font-extralight text-neutral-500">
                    Membuka {targetLabel(item)} di tab baru
                  </span>
                </div>
              </div>

              {/* ---------- Preview besar ---------- */}
              <div className="relative min-h-[12em] flex-1 overflow-hidden rounded-[0.75em] border border-white/12 bg-black ring-1 ring-white/5">
                <button
                  type="button"
                  onClick={() => openProject(item)}
                  aria-label={`Buka ${item.title}`}
                  className="group block h-full w-full cursor-pointer"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-[0.4em] rounded-full bg-white/95 px-[1em] py-[0.5em] text-[0.8em] font-normal text-black">
                      {ctaLabel(item)}
                      <ExternalLink className="h-[1em] w-[1em]" />
                    </span>
                  </span>
                </button>

                {/* Panah pilih proyek di sisi layar */}
                {items.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Proyek sebelumnya"
                      className="absolute left-[0.6em] top-1/2 z-10 grid h-[2.5em] w-[2.5em] -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/30 active:scale-95"
                    >
                      <ChevronLeft className="h-[1.35em] w-[1.35em]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Proyek berikutnya"
                      className="absolute right-[0.6em] top-1/2 z-10 grid h-[2.5em] w-[2.5em] -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/30 active:scale-95"
                    >
                      <ChevronRight className="h-[1.35em] w-[1.35em]" />
                    </button>

                    {/* Titik posisi proyek */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-[0.6em] flex justify-center gap-[0.35em]">
                      {items.map((project, i) => (
                        <span
                          key={project.id}
                          className={`h-[0.42em] w-[0.42em] rounded-full transition-colors duration-300 ${
                            i === safeIndex ? 'bg-emerald-300' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="shrink-0 text-center text-[0.74em] font-extralight text-neutral-500">
              {items.length > 1
                ? 'Panah ‹ › (atau ← →) untuk memilih proyek · klik preview untuk membuka'
                : `Klik preview untuk membuka ${targetLabel(item)}`}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
