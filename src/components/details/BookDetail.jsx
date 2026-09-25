import React, { useState, useMemo } from 'react';
import { booksData } from '../../data/bookData';
import { ChevronLeft, ChevronRight, Bookmark, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function BookDetail() {
  // Build a linear array of all pages across all book projects (divider page + content pages)
  const allLeaves = useMemo(() => {
    const leaves = [];
    booksData.forEach((project, projectIndex) => {
      // 1. Chapter Divider Page (Cover / Intro for this project)
      leaves.push({
        type: 'divider',
        projectId: project.id,
        projectIndex,
        title: project.title,
        subtitle: project.subtitle,
        color: project.spineColor,
        coverImage: project.cover || project.pages[0],
      });

      // 2. Content Pages
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
  }, []);

  // Spread index (0 = leaves 0 & 1, 1 = leaves 2 & 3, etc.)
  const [spreadIndex, setSpreadIndex] = useState(0);

  const totalSpreads = Math.ceil(allLeaves.length / 2);
  const leftPageIndex = spreadIndex * 2;
  const rightPageIndex = spreadIndex * 2 + 1;

  const leftLeaf = allLeaves[leftPageIndex];
  const rightLeaf = allLeaves[rightPageIndex];

  // Active project based on current spread
  const activeProjectIndex = leftLeaf?.projectIndex ?? rightLeaf?.projectIndex ?? 0;
  const activeProject = booksData[activeProjectIndex];

  // Jump to start spread of a project
  const jumpToProject = (projectId) => {
    const targetLeafIndex = allLeaves.findIndex((l) => l.projectId === projectId);
    if (targetLeafIndex !== -1) {
      const targetSpread = Math.floor(targetLeafIndex / 2);
      setSpreadIndex(targetSpread);
    }
  };

  const nextSpread = () => {
    if (spreadIndex < totalSpreads - 1) {
      setSpreadIndex((prev) => prev + 1);
    }
  };

  const prevSpread = () => {
    if (spreadIndex > 0) {
      setSpreadIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-auto animate-fade-in text-white py-2 sm:py-4 px-2 select-none flex flex-col items-center">
      {/* Top Project Side Tabs (Bookmark Ribbons) */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {booksData.map((b, idx) => {
          const isActive = idx === activeProjectIndex;
          return (
            <button
              key={b.id}
              onClick={() => jumpToProject(b.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-normal flex items-center space-x-1.5 transition-all cursor-pointer whitespace-nowrap shadow-lg ${
                isActive
                  ? 'bg-white text-black scale-105 ring-2 ring-rose-500 font-normal'
                  : 'bg-white/10 hover:bg-white/20 text-neutral-300'
              }`}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: b.spineColor }}
              />
              <span>{b.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Physical Spread Book Viewer */}
      <div className="relative w-full max-w-4xl bg-neutral-950/90 rounded-2xl sm:rounded-3xl p-3 sm:p-6 border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col justify-between">
        {/* Book Container (2-page physical spread) */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl flex border border-white/10">
          {/* Center Spine Fold Shadow Effect */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/40 via-black/80 to-black/40 z-20 pointer-events-none" />

          {/* LEFT PAGE */}
          <div className="relative flex-1 h-full bg-neutral-900 border-r border-black/40 flex items-center justify-center overflow-hidden p-2 sm:p-4">
            {leftLeaf ? (
              leftLeaf.type === 'divider' ? (
                /* Chapter Divider Cover */
                <div
                  className="w-full h-full rounded-lg p-4 sm:p-8 flex flex-col justify-between text-white shadow-inner relative overflow-hidden"
                  style={{
                    backgroundColor: leftLeaf.color,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.4))',
                  }}
                >
                  <div className="flex items-center space-x-2 text-xs font-extralight uppercase tracking-widest text-white/80">
                    <Bookmark className="w-4 h-4 fill-current" />
                    <span>Bab Proyek Buku</span>
                  </div>

                  <div className="my-auto">
                    <h2 className="text-xl sm:text-3xl font-normal text-white mb-2 leading-tight drop-shadow">
                      {leftLeaf.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-extralight text-white/80 leading-relaxed">
                      {leftLeaf.subtitle}
                    </p>
                  </div>

                  <div className="text-[10px] sm:text-xs font-extralight text-white/70">
                    Desain Tata Letak & Layout Buku Tahunan
                  </div>
                </div>
              ) : (
                /* Regular Content Page */
                <div className="w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={leftLeaf.image}
                    alt={`${leftLeaf.projectTitle} - Halaman ${leftLeaf.pageNumberInProject}`}
                    className="w-full h-full object-contain filter brightness-95 hover:brightness-100 transition-all"
                  />
                </div>
              )
            ) : (
              /* Blank page */
              <div className="text-neutral-600 text-xs font-extralight">Halaman Kosong</div>
            )}
          </div>

          {/* RIGHT PAGE */}
          <div className="relative flex-1 h-full bg-neutral-900 flex items-center justify-center overflow-hidden p-2 sm:p-4">
            {rightLeaf ? (
              rightLeaf.type === 'divider' ? (
                /* Chapter Divider Cover */
                <div
                  className="w-full h-full rounded-lg p-4 sm:p-8 flex flex-col justify-between text-white shadow-inner relative overflow-hidden"
                  style={{
                    backgroundColor: rightLeaf.color,
                    backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.4))',
                  }}
                >
                  <div className="flex items-center space-x-2 text-xs font-extralight uppercase tracking-widest text-white/80">
                    <Bookmark className="w-4 h-4 fill-current" />
                    <span>Bab Proyek Buku</span>
                  </div>

                  <div className="my-auto">
                    <h2 className="text-xl sm:text-3xl font-normal text-white mb-2 leading-tight drop-shadow">
                      {rightLeaf.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-extralight text-white/80 leading-relaxed">
                      {rightLeaf.subtitle}
                    </p>
                  </div>

                  <div className="text-[10px] sm:text-xs font-extralight text-white/70">
                    Desain Tata Letak & Layout Buku Tahunan
                  </div>
                </div>
              ) : (
                /* Regular Content Page */
                <div className="w-full h-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={rightLeaf.image}
                    alt={`${rightLeaf.projectTitle} - Halaman ${rightLeaf.pageNumberInProject}`}
                    className="w-full h-full object-contain filter brightness-95 hover:brightness-100 transition-all"
                  />
                </div>
              )
            ) : (
              /* Blank page */
              <div className="text-neutral-600 text-xs font-extralight">Halaman Kosong</div>
            )}
          </div>
        </div>

        {/* Flip Page Navigation Bar */}
        <div className="mt-4 flex items-center justify-between px-2 text-white">
          {/* Previous Spread Button */}
          <button
            onClick={prevSpread}
            disabled={spreadIndex === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 glass-panel text-xs font-normal transition-all cursor-pointer ${
              spreadIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-white/20 active:scale-95 text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Spread Page Indicator */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-normal text-white">
              Spread {spreadIndex + 1} dari {totalSpreads}
            </span>
            <span className="text-[10px] font-extralight text-neutral-400">
              {activeProject?.title}
            </span>
          </div>

          {/* Next Spread Button */}
          <button
            onClick={nextSpread}
            disabled={spreadIndex === totalSpreads - 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full border border-white/20 glass-panel text-xs font-normal transition-all cursor-pointer ${
              spreadIndex === totalSpreads - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-white/20 active:scale-95 text-white'
            }`}
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
