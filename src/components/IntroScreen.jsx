import React from 'react';
import { ArrowRight, Volume2, Sparkles } from 'lucide-react';

export default function IntroScreen({ onStart }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white px-6 py-12 select-none overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(40,40,50,0.4)_0%,rgba(0,0,0,0.95)_70%)] pointer-events-none" />

      {/* Top Bar / Header */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between opacity-80 animate-fade-in">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.3em] font-extralight text-neutral-400">
            Portfolio Interaktif
          </span>
        </div>
        <div className="text-xs tracking-wider font-extralight text-neutral-500">
          3D Desk Workspace
        </div>
      </header>

      {/* Center Content */}
      <main className="relative z-10 max-w-xl text-center flex flex-col items-center my-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-neutral-300 text-xs tracking-widest font-extralight mb-6">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          <span>Eksplorasi Meja Kerja 3D</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight mb-4 text-white">
          Ruang Kerja & <br />
          <span className="font-normal text-neutral-200">Karya Interaktif</span>
        </h1>

        <p className="text-sm md:text-base font-extralight text-neutral-400 max-w-md mx-auto leading-relaxed mb-10">
          Jelajahi setiap sudut dan objek di atas meja untuk menelusuri proyek, konsep, dan pengalaman interaktif.
        </p>

        {/* Action Button: "Lanjut" */}
        <div className="relative flex items-center justify-center">
          {/* Sonar Ripple Waves */}
          <div className="sonar-wave sonar-wave-1 border-white/40" />
          <div className="sonar-wave sonar-wave-2 border-white/30" />
          <div className="sonar-wave sonar-wave-3 border-white/20" />

          <button
            onClick={onStart}
            className="group relative z-10 flex items-center space-x-3 px-8 py-4 rounded-full bg-white text-black hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer active:scale-95"
            aria-label="Lanjut ke Meja Kerja"
          >
            <span className="text-sm font-normal tracking-wider">Lanjut</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </main>

      {/* Footer Info & Music Badge */}
      <footer className="relative z-10 flex flex-col items-center space-y-2 text-center text-xs font-extralight text-neutral-500">
        <div className="flex items-center space-x-2 bg-neutral-900/60 border border-white/10 px-3.5 py-1.5 rounded-full text-neutral-400">
          <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
          <span className="tracking-wide">BGM: Rainy Days on the Sidewalk — Mondo Gascaro</span>
        </div>
        <p className="text-[11px] text-neutral-600">
          Klik 'Lanjut' untuk memulai pengalaman audio & visual
        </p>
      </footer>
    </div>
  );
}
