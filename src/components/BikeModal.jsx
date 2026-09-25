import React from 'react';
import { X, MapPin, Compass, Award, Calendar, ChevronRight } from 'lucide-react';

export default function BikeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const journeys = [
    {
      title: 'Morning Coastal & Ridge Ride',
      date: 'September 2026',
      distance: '48.5 km',
      elevation: '+420 m',
      desc: 'Eksplorasi garis pantai dan jalur perbukitan saat matahari terbit untuk mencari inspirasi visual baru.',
    },
    {
      title: 'Urban Architecture Night Commute',
      date: 'Agustus 2026',
      distance: '32.0 km',
      elevation: '+110 m',
      desc: 'Menyusuri sudut kota di malam hari, mengamati pencahayaan lampu kota dan geometri gedung-gedung modern.',
    },
    {
      title: 'Highland Trail & Gravel Adventure',
      date: 'Juli 2026',
      distance: '64.2 km',
      elevation: '+890 m',
      desc: 'Rute kerikil dan udara pegunungan yang menyegarkan pikiran di sela-sela proyek desain intensif.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-neutral-900/90 border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-purple-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-400 font-extralight">
                Jurnal Eksplorasi
              </div>
              <h2 className="text-xl md:text-2xl font-normal text-white">
                Catatan Perjalanan & Rute Sepeda
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup Jurnal Perjalanan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs font-extralight text-neutral-400 mb-1">Total Jarak</div>
            <div className="text-lg md:text-xl font-normal text-white">1,420 km</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs font-extralight text-neutral-400 mb-1">Rute Favorit</div>
            <div className="text-lg md:text-xl font-normal text-purple-300">Gravel & Coast</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <div className="text-xs font-extralight text-neutral-400 mb-1">Status Helm</div>
            <div className="text-lg md:text-xl font-normal text-emerald-400">Siap Gowes</div>
          </div>
        </div>

        {/* Journey Timeline List */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {journeys.map((item, idx) => (
            <div
              key={idx}
              className="group p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-normal text-white group-hover:text-purple-300 transition-colors">
                  {item.title}
                </h3>
                <span className="text-[11px] font-extralight text-neutral-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{item.date}</span>
                </span>
              </div>
              <p className="text-xs font-extralight text-neutral-300 leading-relaxed mb-2">
                {item.desc}
              </p>
              <div className="flex items-center space-x-4 text-[11px] font-extralight text-neutral-400">
                <span className="flex items-center space-x-1 text-neutral-300">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span>{item.distance}</span>
                </span>
                <span className="flex items-center space-x-1 text-neutral-300">
                  <Award className="w-3 h-3 text-purple-400" />
                  <span>Elevasi {item.elevation}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs font-extralight text-neutral-400">
            Perjalanan luar ruang melatih fokus dan perspektif perancangan.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-normal transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
