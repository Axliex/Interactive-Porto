import React, { useState } from 'react';
import { PC_CATEGORIES } from '../../data/pcData';
import { ArrowLeft, ExternalLink, Sparkles, Layers, Eye, X } from 'lucide-react';

export default function PCDetail() {
  const [selectedCategory, setSelectedCategory] = useState(null); // 'uiux' | 'frontend' | null
  const [activeFigmaEmbed, setActiveFigmaEmbed] = useState(null);

  const category = selectedCategory ? PC_CATEGORIES[selectedCategory] : null;

  return (
    <div className="w-full max-w-5xl mx-auto my-auto animate-fade-in text-white py-4 px-2">
      {/* 1. Category Selection Screen */}
      {!selectedCategory ? (
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-300 text-xs font-extralight mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pilih Kategori Portofolio</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extralight tracking-tight mb-3">
            Web Development & <span className="font-normal text-emerald-300">UI Design</span>
          </h2>
          <p className="text-xs md:text-sm font-extralight text-neutral-400 max-w-lg mb-8">
            Eksplorasi antarmuka pengguna, prototyping interaktif di Figma, dan implementasi kode front-end modern.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl">
            {Object.values(PC_CATEGORIES).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group p-6 sm:p-8 rounded-2xl glass-panel border border-white/15 hover:border-emerald-400/40 hover:bg-white/[0.08] transition-all duration-300 text-left flex flex-col justify-between shadow-2xl cursor-pointer active:scale-98"
              >
                <div>
                  <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform origin-left">
                    {cat.emoji}
                  </div>
                  <h3 className="text-lg sm:text-xl font-normal text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-xs font-extralight text-neutral-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center space-x-1.5 text-xs text-emerald-400 font-extralight group-hover:translate-x-1 transition-transform">
                  <span>Lihat Proyek ({cat.items.length})</span>
                  <span>→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 2. Category Project List Screen */
        <div className="animate-fade-in">
          {/* Header inside category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-xs font-extralight text-neutral-300 hover:text-white transition-all cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Pilihan Kategori</span>
            </button>

            <div className="flex items-center space-x-2 text-xs font-extralight text-neutral-400">
              <span className="text-base">{category.emoji}</span>
              <span className="font-normal text-white">{category.label}</span>
              <span>•</span>
              <span>{category.items.length} Proyek</span>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl glass-panel border border-white/15 overflow-hidden flex flex-col justify-between hover:border-emerald-400/40 transition-all duration-300 shadow-xl"
              >
                {/* Thumbnail Preview */}
                {item.thumbnail && (
                  <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-neutral-950 border-b border-white/10">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] tracking-wider text-emerald-300 font-extralight">
                      {item.tag}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-normal text-white mb-2 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-extralight text-neutral-300 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 pt-3 border-t border-white/10">
                    {item.type === 'figma' && item.figmaEmbed && (
                      <button
                        onClick={() => setActiveFigmaEmbed(item.figmaEmbed)}
                        className="flex-1 py-2 px-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-normal flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau Figma</span>
                      </button>
                    )}

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-normal flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>Buka tab baru</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Figma Embed Modal Preview */}
      {activeFigmaEmbed && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-5xl h-[85vh] bg-neutral-900 border border-white/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-3.5 px-5 bg-neutral-950 border-b border-white/15 text-white">
              <div className="flex items-center space-x-2 text-xs font-extralight text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Figma Prototype Viewer</span>
              </div>
              <button
                onClick={() => setActiveFigmaEmbed(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 w-full h-full bg-black">
              <iframe
                title="Figma Prototype Embed"
                className="w-full h-full border-0"
                src={activeFigmaEmbed}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
