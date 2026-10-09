import React from 'react';
import { ArrowLeft, ExternalLink, Compass, MousePointerClick } from 'lucide-react';
import TurntableController from './TurntableController';

export default function ObjectOverlay({
  currentObject,
  objectData,
  onBackToHero,
  onOpenDetail,
  onOpenBikeJourney,
}) {
  if (!currentObject || !objectData) return null;

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-6 md:p-10 select-none">
      {/* Top Bar: Always consistent "Kembali ke Hero" button */}
      <header className="flex items-center justify-between w-full max-w-6xl mx-auto gap-2">
        <button
          onClick={onBackToHero}
          className="pointer-events-auto group flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full glass-panel hover:bg-white/20 text-white transition-all duration-300 shadow-xl cursor-pointer active:scale-95 border border-white/20"
          aria-label="Kembali ke tampilan Hero utama"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1 text-white" />
          <span className="text-xs sm:text-sm font-normal tracking-wide">
            Kembali ke Hero
          </span>
        </button>

        {/* Object Badge */}
        <div className="pointer-events-auto flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/15 text-xs text-neutral-300 font-extralight">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: objectData.accentColor || '#ffffff' }}
          />
          <span className="font-normal text-white">{objectData.title}</span>
          <span className="text-neutral-500 hidden xs:inline">•</span>
          <span className="hidden sm:inline text-neutral-400">{objectData.category}</span>
        </div>
      </header>

      {/* Bottom Area / Contextual Action Card */}
      <footer className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 sm:gap-4">
        {/* Left Side: Object Info Card */}
        <div className="pointer-events-auto glass-panel p-3.5 sm:p-5 rounded-2xl max-w-sm border border-white/15 shadow-2xl animate-fade-in backdrop-blur-xl">
          <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-neutral-400 font-extralight mb-0.5 sm:mb-1">
            Objek Terfokus
          </div>
          <h2 className="text-base sm:text-lg md:text-xl font-normal text-white mb-1">
            {objectData.label}
          </h2>
          <p className="text-xs font-extralight text-neutral-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
            {objectData.description}
          </p>
        </div>

        {/* Right Side: Object Specific Actions */}
        <div className="pointer-events-auto flex flex-col items-stretch sm:items-end gap-2.5 sm:gap-3 animate-fade-in">
          {/* For Book: generic "Lihat Detail Proyek" action (PC/Paper/Phone entry langsung dari layar/kertas/HP) */}
          {objectData.hasDetail && !objectData.screenEntry && (
            <button
              onClick={() => onOpenDetail(currentObject)}
              className="group flex items-center justify-center space-x-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-white text-black hover:bg-neutral-100 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] cursor-pointer active:scale-95"
            >
              <span className="text-xs sm:text-sm font-normal tracking-wide">
                Lihat Detail Proyek
              </span>
              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}

          {/* For PC, Paper, Phone: hint that the object's own screen is the entry point */}
          {objectData.screenEntry && (
            <div className="flex items-center space-x-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full glass-panel border border-white/15 shadow-2xl backdrop-blur-xl">
              <MousePointerClick className="w-4 h-4 text-white/85 animate-pulse-subtle" />
              <span className="text-[11px] sm:text-xs font-extralight text-neutral-200 tracking-wide">
                {objectData.screenHint}
              </span>
            </div>
          )}

          {/* For Bike: "Lihat Perjalanan" Action */}
          {objectData.hasJourney && (
            <button
              onClick={onOpenBikeJourney}
              className="group flex items-center justify-center space-x-2.5 px-5 py-3 sm:px-6 sm:py-3.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.4)] cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
              <span className="text-xs sm:text-sm font-normal tracking-wide">
                Lihat Perjalanan
              </span>
            </button>
          )}

          {/* For Turntable: Turntable Audio Deck Controller */}
          {objectData.hasTurntableControls && (
            <TurntableController />
          )}
        </div>
      </footer>
    </div>
  );
}
