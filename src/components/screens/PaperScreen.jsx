import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * Teks interaktif di atas kertas notepad (state Paper).
 * Tanpa latar panel — hanya dua tautan (About Me & Resume) yang menempel
 * langsung di atas foto kertas, masing-masing membuka bagian tersebut
 * di halaman Profile & Resume.
 */
const LINKS = [
  { id: 'about', emoji: '👋', label: 'About Me', route: { tab: 'about', section: null } },
  { id: 'resume', emoji: '📄', label: 'Resume', route: { tab: 'resume' } },
];

export default function PaperScreen({ onOpenDetail, floating = false }) {
  return (
    <div
      className={`screen-ui-paper relative flex h-full w-full flex-col overflow-hidden text-[#241c15] ${
        floating ? 'bg-[#f7f4ec]/95 backdrop-blur-sm' : ''
      }`}
    >
      <nav className="flex min-h-0 flex-1 flex-col justify-center gap-[0.35em] px-[0.5em]">
        {LINKS.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => onOpenDetail('Paper', link.route)}
            className="group flex w-full items-center justify-between gap-[0.5em] rounded-[0.4em] px-[0.5em] py-[0.4em] text-left transition-colors hover:bg-amber-500/15"
          >
            <span className="flex min-w-0 items-center gap-[0.55em]">
              <span className="text-[0.95em] leading-none">{link.emoji}</span>
              <span className="truncate text-[1em] font-normal text-[#2a221b] transition-colors group-hover:text-amber-700">
                {link.label}
              </span>
            </span>
            <ArrowRight className="h-[0.95em] w-[0.95em] shrink-0 text-[#ab9d8b] transition-all duration-200 group-hover:translate-x-[0.2em] group-hover:text-amber-700" />
          </button>
        ))}
      </nav>
    </div>
  );
}
