import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { booksData } from '../../data/bookData';
import { ChevronLeft, ChevronRight, Bookmark, Grip } from 'lucide-react';
import FlipBook from './FlipBook';

/** Warna pastel sticky notes (pemilih proyek). */
const NOTE_COLORS = ['#ffd966', '#ffb3c7', '#a8e6cf', '#a9d6f5', '#d7c3ff'];

/** Susun semua halaman lintas proyek: divider bab + halaman konten. */
function buildLeaves() {
  const leaves = [];
  booksData.forEach((project, projectIndex) => {
    leaves.push({
      type: 'divider',
      projectId: project.id,
      projectIndex,
      title: project.title,
      subtitle: project.subtitle,
      color: project.spineColor,
    });
    project.pages.forEach((pageImg, pageIdx) => {
      leaves.push({
        type: 'content',
        projectId: project.id,
        projectIndex,
        projectTitle: project.title,
        color: project.spineColor,
        image: pageImg,
        pageNumberInProject: pageIdx + 1,
        totalPagesInProject: project.pages.length,
      });
    });
  });
  return leaves;
}

/** Isi satu sisi halaman (divider bab atau halaman gambar) + nomor halaman. */
function LeafContent({ leaf, index, total }) {
  if (leaf.type === 'divider') {
    return (
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden p-4 text-white shadow-inner sm:p-7"
        style={{
          backgroundColor: leaf.color,
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.16), rgba(0,0,0,0.45))',
        }}
      >
        <div className="flex items-center space-x-2 text-[10px] font-extralight uppercase tracking-[0.25em] text-white/80 sm:text-xs">
          <Bookmark className="w-3.5 h-3.5 fill-current" />
          <span>Book of Books</span>
        </div>

        <div className="my-auto">
          <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/60">
            Bab {leaf.projectIndex + 1}
          </div>
          <h2 className="text-lg font-normal leading-tight drop-shadow sm:text-3xl">
            {leaf.title}
          </h2>
          <p className="mt-1.5 text-[11px] font-extralight leading-relaxed text-white/85 sm:text-sm">
            {leaf.subtitle}
          </p>
        </div>

        <div className="text-[10px] font-extralight text-white/70 sm:text-xs">
          Desain Tata Letak & Layout Buku Tahunan
        </div>

        <span className="absolute bottom-2.5 right-4 text-[10px] font-extralight text-white/60">
          {index + 1} / {total}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <img
        src={leaf.image}
        alt={`${leaf.projectTitle} — halaman ${leaf.pageNumberInProject} dari ${leaf.totalPagesInProject}`}
        draggable={false}
        className="h-full w-full object-contain"
      />
      <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-extralight text-white/70 mix-blend-difference">
        {index + 1} / {total}
      </span>
    </div>
  );
}

/**
 * Book of Books — buku fisik dengan halaman yang bisa dibolak-balik (3D flip)
 * dan sticky notes di tepi atas buku sebagai pemilih proyek.
 *
 * Semua halaman ditampilkan di tempat (spread 2 halaman), tanpa halaman detail baru.
 */
const BookDetail = forwardRef(function BookDetail({ initialProjectId = null }, ref) {
  const leaves = useMemo(() => buildLeaves(), []);
  const pages = useMemo(
    () =>
      leaves.map((leaf, index) => (
        <LeafContent
          key={`${leaf.projectId}-${index}`}
          leaf={leaf}
          index={index}
          total={leaves.length}
        />
      )),
    [leaves]
  );

  const maxTurn = Math.max(0, Math.floor((leaves.length - 1) / 2));

  const initialTurn = useMemo(() => {
    if (!initialProjectId) return 0;
    const firstLeaf = leaves.findIndex((leaf) => leaf.projectId === initialProjectId);
    return firstLeaf === -1 ? 0 : Math.floor(firstLeaf / 2);
  }, [initialProjectId, leaves]);

  const [turn, setTurn] = useState(initialTurn);
  const bookRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      next: () => bookRef.current?.next(),
      prev: () => bookRef.current?.prev(),
      get turn() {
        return turn;
      },
      maxTurn,
    }),
    [turn, maxTurn]
  );

  // Proyek aktif: utamakan divider bab bila terlihat di halaman kanan
  const leftLeaf = leaves[turn * 2];
  const rightLeaf = leaves[turn * 2 + 1];
  const activeLeaf =
    rightLeaf?.type === 'divider' ? rightLeaf : leftLeaf ?? rightLeaf;
  const activeProjectIndex = activeLeaf?.projectIndex ?? 0;
  const activeProject = booksData[activeProjectIndex];

  const jumpToProject = (projectIndex) => {
    const project = booksData[projectIndex];
    if (!project) return;
    const firstLeaf = leaves.findIndex((leaf) => leaf.projectId === project.id);
    if (firstLeaf !== -1) setTurn(Math.floor(firstLeaf / 2));
  };

  return (
    <div className="animate-fade-in mx-auto my-auto flex w-full max-w-5xl select-none flex-col items-center px-2 py-1 text-white sm:py-2">
      {/* ============ Sticky Notes: pemilih proyek ============ */}
      <div className="relative mx-auto mt-[54px] w-full max-w-[min(896px,calc(56vh*1.6))]">
        <div
          className="absolute inset-x-0 -top-[52px] z-0 flex h-[84px] items-end justify-center gap-1.5 sm:gap-2.5"
          role="tablist"
          aria-label="Pilih proyek buku"
        >
          {booksData.map((project, idx) => {
            const isActive = idx === activeProjectIndex;
            const rotation = [-3.5, 2.5, -1.5, 3.5, -2.5][idx % 5];
            return (
              <button
                key={project.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Buka proyek ${project.title}`}
                title={project.subtitle}
                onClick={() => jumpToProject(idx)}
                data-active={isActive}
                className={`sticky-note relative flex h-[84px] min-w-0 flex-1 basis-0 cursor-pointer flex-col items-start overflow-hidden rounded-[3px] px-2 pt-2 pb-6 text-left shadow-[0_8px_18px_rgba(0,0,0,0.5)] transition-[box-shadow,transform] duration-300 max-w-[112px] ${
                  isActive
                    ? 'shadow-[0_16px_30px_rgba(0,0,0,0.65)] ring-2 ring-white/75'
                    : 'hover:shadow-[0_12px_24px_rgba(0,0,0,0.6)]'
                }`}
                style={{
                  backgroundColor: NOTE_COLORS[idx % NOTE_COLORS.length],
                  ['--rot']: `${rotation}deg`,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ backgroundColor: project.spineColor }}
                  aria-hidden="true"
                />
                <span className="line-clamp-2 text-[10px] font-normal leading-tight text-black/85 sm:text-[11px]">
                  {project.title}
                </span>
                {isActive && (
                  <span className="absolute bottom-1.5 left-2 h-1.5 w-1.5 rounded-full bg-black/70" />
                )}
              </button>
            );
          })}
        </div>

        {/* ============ Buku 3D (halaman bisa dibolak-balik) ============ */}
        <FlipBook ref={bookRef} pages={pages} turn={turn} onChange={setTurn} />
      </div>

      {/* ============ Navigasi halaman ============ */}
      <div className="mt-3 flex w-full max-w-[min(896px,calc(56vh*1.6))] items-center justify-between gap-2 px-1 sm:mt-4">
        <button
          type="button"
          onClick={() => bookRef.current?.prev()}
          disabled={turn === 0}
          className={`flex items-center space-x-2 rounded-full border border-white/20 glass-panel px-3 py-2 text-xs font-normal transition-all sm:px-4 ${
            turn === 0
              ? 'cursor-not-allowed opacity-30'
              : 'cursor-pointer hover:bg-white/20 active:scale-95'
          }`}
          aria-label="Balik ke halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-normal text-white">
            Halaman {turn * 2 + 1}–{Math.min(turn * 2 + 2, leaves.length)} dari{' '}
            {leaves.length}
          </span>
          <span className="text-[10px] font-extralight text-neutral-400">
            {activeProject?.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => bookRef.current?.next()}
          disabled={turn >= maxTurn}
          className={`flex items-center space-x-2 rounded-full border border-white/20 glass-panel px-3 py-2 text-xs font-normal transition-all sm:px-4 ${
            turn >= maxTurn
              ? 'cursor-not-allowed opacity-30'
              : 'cursor-pointer hover:bg-white/20 active:scale-95'
          }`}
          aria-label="Balik ke halaman berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Petunjuk interaksi */}
      <div className="mt-1.5 flex items-center justify-center space-x-2 text-center text-[11px] font-extralight text-neutral-500 sm:text-xs">
        <Grip className="h-3.5 w-3.5 shrink-0" />
        <span>
          Seret halaman, klik tepi buku, atau tekan ← → untuk membalik ·
          Sticky notes di atas buku memilih proyek
        </span>
      </div>
    </div>
  );
});

export default BookDetail;
