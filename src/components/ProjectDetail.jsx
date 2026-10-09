import React, { useState } from 'react';
import { ArrowLeft, Layers, Sparkles } from 'lucide-react';
import PhoneDetail from './details/PhoneDetail';
import PaperDetail from './details/PaperDetail';
import BookDetail from './details/BookDetail';

export default function ProjectDetail({
  objectKey,
  objectData,
  route = {},
  onBack,
}) {
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 450);
  };

  // Render specific detail content based on objectKey.
  // `route` membawa tujuan langsung dari preview di layar objek:
  // Paper  -> { tab: 'about' | 'resume', section, focus }
  // Book   -> { projectId } (buku terbuka langsung di bab proyek tsb)
  // PC     -> sudah dipindah seluruhnya ke layar monitor (MonitorScreen):
  //           pilih kategori → preview proyek → buka link Figma/website.
  // Phone  -> sudah dipindah ke preview di tempat (PhoneScreen), bukan halaman ini.
  const renderDetailContent = () => {
    switch (objectKey) {
      case 'Phone':
        return (
          <PhoneDetail
            initialLocked={route.locked}
            initialTab={route.tab || null}
            initialPostIndex={route.postIndex}
          />
        );
      case 'Paper':
        return (
          <PaperDetail
            initialTab={route.tab || null}
            initialSection={route.section}
            initialFocus={route.focus || null}
          />
        );
      case 'Book':
        return <BookDetail initialProjectId={route.projectId || null} />;
      default:
        return (
          <div className="my-auto text-center">
            <h1 className="text-3xl font-extralight text-white mb-2">
              {objectKey} Detail
            </h1>
            <p className="text-sm font-extralight text-neutral-400">
              {objectData?.description}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 bg-black/95 text-white flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none overflow-y-auto no-scrollbar transition-all duration-500 ${
        isExiting
          ? 'opacity-0 scale-95 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Global Header Bar */}
      <header className="relative z-20 flex items-center justify-between max-w-6xl mx-auto w-full mb-2 sm:mb-4">
        <button
          onClick={handleBack}
          className="group flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/20 glass-panel hover:bg-white/15 transition-all duration-300 text-xs sm:text-sm font-normal text-neutral-200 hover:text-white cursor-pointer active:scale-95 shadow-xl"
          aria-label={`Kembali ke tampilan ${objectKey}`}
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Kembali ke Objek</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-extralight text-neutral-400 glass-panel px-3.5 py-1.5 rounded-full border border-white/15">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: objectData?.accentColor || '#ffffff' }}
          />
          <span className="font-normal text-white">{objectData?.label || objectKey}</span>
        </div>
      </header>

      {/* Main Detail Component Container */}
      <main className="relative z-10 w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center my-auto">
        {renderDetailContent()}
      </main>

      {/* Footer */}
      <footer className="relative z-20 text-center text-[11px] font-extralight text-neutral-600 max-w-5xl mx-auto w-full pt-3">
        Tekan 'Kembali ke Objek' untuk kembali ke scene 3D meja kerja
      </footer>
    </div>
  );
}
