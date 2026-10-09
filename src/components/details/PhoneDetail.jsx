import React, { useState, useEffect } from 'react';
import { accountsData } from '../../data/phoneData';
import { ChevronUp, ChevronLeft, ChevronRight, Lock, Unlock, Wifi, Battery, Signal, Grid, Bookmark, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';

/**
 * Detail Phone — "Socials Design".
 *
 * Catatan: preview di layar HP (PhoneScreen) sudah berjalan di tempat, jadi
 * komponen ini tidak lagi dipanggil dari jalur tersebut. `initialLocked` /
 * `initialTab` / `initialPostIndex` dipertahankan bila detail dibuka lewat
 * rute lain.
 */
export default function PhoneDetail({
  initialLocked = true,
  initialTab = null,
  initialPostIndex = undefined,
}) {
  const firstAccount = accountsData[0];
  const safePostIndex =
    typeof initialPostIndex === 'number'
      ? Math.min(Math.max(initialPostIndex, 0), firstAccount.posts.length - 1)
      : 0;

  const [isLocked, setIsLocked] = useState(initialLocked !== false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [activePostIndex, setActivePostIndex] = useState(safePostIndex);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(initialTab === 'grid' ? 'grid' : 'posts'); // 'posts' | 'grid'

  const account = accountsData[activeAccountIndex] || accountsData[0];
  const post = account.posts[activePostIndex];

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time (HH:MM)
  const timeString = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Format Indonesian date
  const dateString = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const nextPost = () => {
    setActivePostIndex((prev) => (prev + 1) % account.posts.length);
    setActiveImageIndex(0);
  };

  const prevPost = () => {
    setActivePostIndex((prev) => (prev - 1 + account.posts.length) % account.posts.length);
    setActiveImageIndex(0);
  };

  const nextImage = () => {
    if (post && post.images.length > 1) {
      setActiveImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post && post.images.length > 1) {
      setActiveImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto animate-fade-in flex flex-col items-center justify-center p-2 select-none">
      {/* Smartphone Device Frame */}
      <div className="relative w-[320px] sm:w-[350px] h-[640px] sm:h-[680px] bg-black rounded-[44px] border-[6px] border-neutral-700/80 shadow-[0_0_50px_rgba(59,130,246,0.25)] overflow-hidden flex flex-col justify-between">
        {/* Top Notch & Status Bar */}
        <div className="relative z-30 w-full pt-3 px-6 pb-1 flex items-center justify-between text-white text-[11px] font-normal bg-black/40 backdrop-blur-md">
          <span>{timeString}</span>

          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-black rounded-full border border-neutral-800 flex items-center justify-center space-x-1.5 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-700" />
            <div className="w-2 h-2 rounded-full bg-blue-500/80" />
          </div>

          <div className="flex items-center space-x-1.5 text-neutral-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 1. LOCK SCREEN */}
        {isLocked ? (
          <div
            onClick={() => setIsLocked(false)}
            className="relative z-20 flex-1 flex flex-col items-center justify-between px-6 py-8 text-center cursor-pointer bg-gradient-to-b from-neutral-900/90 via-black/80 to-blue-950/40"
          >
            <div className="mt-4 flex flex-col items-center">
              <Lock className="w-4 h-4 text-blue-400/80 mb-2 animate-pulse" />
              <div className="text-[13px] font-extralight text-neutral-300 tracking-wider">
                {dateString}
              </div>
              <div className="text-6xl font-extralight tracking-tight text-white mt-1">
                {timeString}
              </div>
            </div>

            {/* Notification Widget */}
            <div className="glass-panel p-3.5 rounded-2xl border border-white/10 w-full text-left shadow-lg">
              <div className="flex items-center space-x-2 text-[11px] text-blue-400 font-extralight mb-1">
                <Sparkles className="w-3 h-3" />
                <span>MonkBike Socials</span>
              </div>
              <p className="text-xs font-extralight text-neutral-300">
                6 Postingan desain baru siap dijelajahi. Ketuk layar untuk membuka.
              </p>
            </div>

            {/* Bottom Swipe Up Prompt */}
            <div className="flex flex-col items-center space-y-1 text-neutral-400 animate-bounce">
              <ChevronUp className="w-4 h-4" />
              <span className="text-[11px] font-extralight tracking-widest uppercase">
                Ketuk untuk membuka
              </span>
            </div>
          </div>
        ) : (
          /* 2. HOME SCREEN: Social Media Feed */
          <div className="relative z-20 flex-1 flex flex-col bg-neutral-950 text-white overflow-hidden">
            {/* App Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-900 bg-neutral-950/90">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-normal tracking-wide text-white">
                  {account.username}
                </span>
              </div>
              <button
                onClick={() => setIsLocked(true)}
                className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors text-[11px] flex items-center space-x-1 cursor-pointer"
                title="Kunci Layar"
              >
                <Lock className="w-3 h-3" />
                <span className="text-[10px]">Kunci</span>
              </button>
            </div>

            {/* Profile Header */}
            <div className="p-3.5 border-b border-neutral-900 bg-neutral-900/30">
              <div className="flex items-center justify-between mb-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-blue-400/40">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center space-x-4 text-center">
                  <div>
                    <div className="text-xs font-normal text-white">{account.stats.posts}</div>
                    <div className="text-[10px] font-extralight text-neutral-400">Post</div>
                  </div>
                  <div>
                    <div className="text-xs font-normal text-white">{account.stats.followers}</div>
                    <div className="text-[10px] font-extralight text-neutral-400">Pengikut</div>
                  </div>
                  <div>
                    <div className="text-xs font-normal text-white">{account.stats.following}</div>
                    <div className="text-[10px] font-extralight text-neutral-400">Mengikuti</div>
                  </div>
                </div>
              </div>

              <div className="text-xs font-normal text-white">{account.name}</div>
              <div className="text-[11px] font-extralight text-neutral-400 mt-0.5 leading-snug">
                {account.bio}
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-neutral-900">
              <button
                onClick={() => setActiveTab('posts')}
                className={`flex-1 py-2 text-center text-xs font-normal flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'posts'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>Feed Detail ({activePostIndex + 1}/{account.posts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('grid')}
                className={`flex-1 py-2 text-center text-xs font-normal flex items-center justify-center space-x-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'grid'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid Galeri</span>
              </button>
            </div>

            {/* Main Feed Carousel */}
            {activeTab === 'posts' && post ? (
              <div className="flex-1 flex flex-col justify-between p-3 overflow-y-auto no-scrollbar">
                {/* Image Display with Carousel controls */}
                <div className="relative w-full aspect-[3/4] bg-black rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center group">
                  <img
                    src={post.images[activeImageIndex] || post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Left / Right Post Navigation Buttons */}
                  <button
                    onClick={prevPost}
                    className="absolute left-1.5 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer shadow-lg"
                    aria-label="Post Sebelumnya"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={nextPost}
                    className="absolute right-1.5 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer shadow-lg"
                    aria-label="Post Berikutnya"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Multi-image indicator if post has > 1 image */}
                  {post.images.length > 1 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-[9px] text-white font-extralight backdrop-blur-md">
                      {activeImageIndex + 1}/{post.images.length}
                    </div>
                  )}

                  {/* Multi-image dot pagination */}
                  {post.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {post.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImageIndex(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                            activeImageIndex === i ? 'bg-blue-400 w-3' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Social Actions & Caption */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-neutral-300 mb-1.5">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-4 h-4 hover:text-red-400 transition-colors cursor-pointer" />
                      <MessageCircle className="w-4 h-4 hover:text-blue-400 transition-colors cursor-pointer" />
                      <Share2 className="w-4 h-4 hover:text-emerald-400 transition-colors cursor-pointer" />
                    </div>
                    <Bookmark className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
                  </div>

                  <div className="text-[11px] font-normal text-white mb-0.5">{post.title}</div>
                  <p className="text-[10px] font-extralight text-neutral-300 leading-snug">
                    <span className="font-normal text-white mr-1.5">{account.username}</span>
                    {post.caption}
                  </p>
                </div>
              </div>
            ) : (
              /* Grid View of all posts */
              <div className="flex-1 p-2 grid grid-cols-3 gap-1.5 overflow-y-auto no-scrollbar">
                {account.posts.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePostIndex(idx);
                      setActiveImageIndex(0);
                      setActiveTab('posts');
                    }}
                    className="relative aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-blue-400/50 transition-all cursor-pointer group"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    {p.images.length > 1 && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 shadow" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Home Indicator Bar */}
        <div className="w-full pb-2 pt-1 flex justify-center bg-black/90">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
