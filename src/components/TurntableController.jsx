import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Disc3, Music2, Sparkles } from 'lucide-react';
import { soundTrack } from '../utils/audioSynth';

export default function TurntableController() {
  const [audioState, setAudioState] = useState(() => soundTrack.getState());

  useEffect(() => {
    soundTrack.onStateChange = (state) => {
      setAudioState({ ...state });
    };
    return () => {
      soundTrack.onStateChange = null;
    };
  }, []);

  const handleTogglePlay = () => {
    soundTrack.toggle();
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    soundTrack.setVolume(val);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/20 text-white max-w-sm w-full shadow-2xl backdrop-blur-xl animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center space-x-2">
          <Disc3
            className={`w-5 h-5 text-pink-400 ${
              audioState.isPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          />
          <span className="text-xs uppercase tracking-widest font-extralight text-neutral-300">
            Vinyl Audio Deck
          </span>
        </div>
        <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-extralight border border-pink-500/30">
          <Sparkles className="w-2.5 h-2.5" />
          <span>{audioState.isPlaying ? 'Memutar' : 'Dijeda'}</span>
        </div>
      </div>

      {/* Track Info */}
      <div className="mb-4">
        <div className="text-xs font-extralight text-neutral-400 mb-0.5">
          Sedang Diputar
        </div>
        <div className="text-sm font-normal text-white truncate flex items-center space-x-1.5">
          <Music2 className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
          <span className="truncate">{audioState.trackTitle}</span>
        </div>
      </div>

      {/* Controls: Play/Pause & Volume */}
      <div className="space-y-4">
        {/* Play / Pause Big Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-normal text-sm transition-all duration-300 cursor-pointer shadow-lg active:scale-95 ${
            audioState.isPlaying
              ? 'bg-neutral-800 hover:bg-neutral-700 text-pink-300 border border-pink-500/40'
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          {audioState.isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Jeda Pemutar</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Putar Musik</span>
            </>
          )}
        </button>

        {/* Volume Slider */}
        <div className="flex items-center space-x-3 pt-1">
          <button
            onClick={() => soundTrack.setVolume(audioState.volume > 0 ? 0 : 0.6)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Mute / Unmute"
          >
            {audioState.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-neutral-300" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audioState.volume}
            onChange={handleVolumeChange}
            className="w-full accent-pink-500 cursor-pointer"
            aria-label="Volume Slider"
          />

          <span className="text-[11px] font-extralight text-neutral-400 w-8 text-right">
            {Math.round(audioState.volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
