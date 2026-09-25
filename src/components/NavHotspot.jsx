import React from 'react';

export default function NavHotspot({
  item,
  onClick,
  onHover,
  disabled = false,
}) {
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
      style={{ top: item.position.top, left: item.position.left }}
    >
      {/* Ripple / Sonar Ping Waves radiating from circle edge */}
      {!disabled && (
        <>
          <div className="sonar-wave sonar-wave-1 border-white/60" />
          <div className="sonar-wave sonar-wave-2 border-white/40" />
          <div className="sonar-wave sonar-wave-3 border-white/20" />
        </>
      )}

      {/* Frosted Glass Circular Button (Blurred background, no image) */}
      <button
        onClick={() => !disabled && onClick(item.id)}
        onMouseEnter={() => !disabled && onHover && onHover(item.videoIn)}
        disabled={disabled}
        className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-full backdrop-blur-md bg-white/15 hover:bg-white/25 border-2 border-white/70 shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 ${
          disabled
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:scale-115 active:scale-95 cursor-pointer hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]'
        }`}
        aria-label={`Navigasi ke ${item.label}`}
      >
        {/* Glowing Center Core */}
        <div
          className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full transition-transform duration-300 group-hover:scale-125 shadow-sm"
          style={{
            backgroundColor: item.accentColor || '#ffffff',
            boxShadow: `0 0 12px ${item.accentColor || '#ffffff'}`,
          }}
        />
        
        {/* Subtle Frosted Inner Ring */}
        <div className="absolute inset-1 rounded-full border border-white/30 pointer-events-none" />
      </button>

      {/* Label Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2.5 pointer-events-none transition-all duration-300 opacity-90 group-hover:opacity-100 group-hover:translate-y-0.5">
        <div className="glass-panel px-3.5 py-1 rounded-full whitespace-nowrap shadow-xl flex items-center space-x-1.5 border border-white/20 backdrop-blur-xl">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: item.accentColor || '#ffffff' }}
          />
          <span className="text-xs text-white font-normal tracking-wide drop-shadow">
            {item.label}
          </span>
        </div>
      </div>
    </div>
  );
}
