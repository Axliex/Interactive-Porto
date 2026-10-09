import React, { useState, useCallback, useRef, useEffect } from 'react';
import { OBJECTS } from './data/objectsData';
import IntroScreen from './components/IntroScreen';
import DeskScene from './components/DeskScene';
import NavHotspot from './components/NavHotspot';
import ObjectOverlay from './components/ObjectOverlay';
import ObjectScreen from './components/ObjectScreen';
import BikeModal from './components/BikeModal';
import ProjectDetail from './components/ProjectDetail';
import BookLift from './components/BookLift';
import { soundTrack } from './utils/audioSynth';
import { MoveHorizontal } from 'lucide-react';

export default function App() {
  // Application State Machine:
  // 'INTRO' | 'TRANSITION_INTRO_TO_HERO' | 'HERO' | 'TRANSITION_HERO_TO_OBJECT' | 'OBJECT' | 'TRANSITION_OBJECT_TO_HERO' | 'DETAIL'
  const [appState, setAppState] = useState('INTRO');
  const [currentObject, setCurrentObject] = useState(null); // 'Book' | 'Phone' | 'PC' | 'Paper' | 'Bike' | 'Turntable'
  const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
  const [currentStaticImage, setCurrentStaticImage] = useState('/assets/Hero.webp');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isBikeModalOpen, setIsBikeModalOpen] = useState(false);
  const [isZoomingToDetail, setIsZoomingToDetail] = useState(false);
  const [showPanHint, setShowPanHint] = useState(false);
  // Route params for the detail page, so the on-screen previews can jump
  // straight to a specific project / tab / post.
  const [detailRoute, setDetailRoute] = useState({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  // Animasi "mengambil buku dari meja" (Book): null | { phase: 'up'|'down', origin }
  const [bookLift, setBookLift] = useState(null);

  const scrollContainerRef = useRef(null);
  const sceneCanvasRef = useRef(null); // Canvas 16:9 — jangkar animasi ambil buku
  const preloadedVideos = useRef(new Set());

  // Drag interaction states for desktop & mobile smooth pan
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  // Helper to center the viewport on the 16:9 canvas
  const centerDeskViewport = useCallback((smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll > 0) {
      const centerPos = maxScroll / 2;
      el.scrollTo({
        left: centerPos,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  // Selalu pusatkan kembali kanvas 16:9 saat viewport berubah ukuran
  // (scrollLeft lama membuat scene meleset dari tengah setelah resize).
  useEffect(() => {
    const handleResize = () => centerDeskViewport(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [centerDeskViewport]);

  // Check if horizontal scroll is available on Hero and show hint
  useEffect(() => {
    if (appState === 'HERO' && !isVideoPlaying) {
      const el = scrollContainerRef.current;
      if (el && el.scrollWidth > el.clientWidth + 30) {
        setShowPanHint(true);
        const timer = setTimeout(() => setShowPanHint(false), 4500);
        return () => clearTimeout(timer);
      }
    } else {
      setShowPanHint(false);
    }
  }, [appState, isVideoPlaying]);

  // Ensure center on Hero state
  useEffect(() => {
    if (appState === 'HERO') {
      centerDeskViewport(true);
    }
  }, [appState, centerDeskViewport]);

  // Preload video cache
  const preloadVideo = useCallback((src) => {
    if (!src || preloadedVideos.current.has(src)) return;
    preloadedVideos.current.add(src);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = src;
    link.type = 'video/webm';
    document.head.appendChild(link);
  }, []);

  // 1. User Clicks "Lanjut" on Intro Screen
  const handleStartIntro = () => {
    soundTrack.play();
    setAppState('TRANSITION_INTRO_TO_HERO');
    setCurrentVideoSrc('/assets/Intro-Hero.webm');
    setIsVideoPlaying(true);
    centerDeskViewport(false);
  };

  // 2. Navigating from Hero to an Object
  const handleSelectObject = (objectId) => {
    if (appState !== 'HERO' || isVideoPlaying) return;
    if (hasMovedRef.current) return; // Prevent selection if user was dragging

    const target = OBJECTS[objectId];
    if (!target) return;

    setCurrentObject(objectId);
    setAppState('TRANSITION_HERO_TO_OBJECT');
    setCurrentVideoSrc(target.videoIn);
    setIsVideoPlaying(true);

    // As the 3D video camera zooms and centers the object into the middle of the 16:9 canvas,
    // smoothly center the scroll container so the object lands dead-center on screen!
    centerDeskViewport(true);
  };

  // 3. Navigating from Object back to Hero
  const handleBackToHero = () => {
    if (appState !== 'OBJECT' || !currentObject || isVideoPlaying) return;

    const target = OBJECTS[currentObject];
    if (!target) return;

    setAppState('TRANSITION_OBJECT_TO_HERO');
    setCurrentVideoSrc(target.videoOut);
    setIsVideoPlaying(true);

    // Keep centered as the video camera zooms out to the full desk scene
    centerDeskViewport(true);
  };

  // 4. Video onEnded Transition Handler
  const handleVideoEnded = () => {
    setIsVideoPlaying(false);

    if (appState === 'TRANSITION_INTRO_TO_HERO' || appState === 'TRANSITION_OBJECT_TO_HERO') {
      setAppState('HERO');
      setCurrentStaticImage('/assets/Hero.webp');
      setCurrentObject(null);
      setCurrentVideoSrc(null);
      centerDeskViewport(true);
    } else if (appState === 'TRANSITION_HERO_TO_OBJECT') {
      const target = OBJECTS[currentObject];
      if (target) {
        setCurrentStaticImage(target.image);
      }
      setAppState('OBJECT');
      setCurrentVideoSrc(null);
      centerDeskViewport(false);
    }
  };

  // Hitung kotak buku merah pada frame 16:9 (dalam piksel viewport)
  // untuk animasi "ambil buku dari meja" — diambil sebelum canvas di-zoom.
  const computeBookOrigin = () => {
    const el = sceneCanvasRef.current;
    const anchor = OBJECTS.Book?.liftAnchor;
    if (!el || !anchor) return null;
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + (anchor.left / 100) * rect.width,
      top: rect.top + (anchor.top / 100) * rect.height,
      width: (anchor.width / 100) * rect.width,
      height: (anchor.height / 100) * rect.height,
    };
  };

  // 5. Open Project Detail (Book, PC, Paper)
  // `route` lets the on-screen previews jump straight to a target:
  // e.g. { view:'project', category:'uiux', itemId:'...' } for PC,
  // { tab:'about', section:'pengalaman' } for Paper, { projectId } for Book.
  // Catatan: Phone tidak lewat sini — preview HP berjalan di tempat.
  const handleOpenDetail = (objectId, route = {}) => {
    if (bookLift) return;
    setDetailRoute(route);

    // Book: buku diangkat dari meja dulu, baru detail (buku 3D) muncul
    if (objectId === 'Book') {
      const origin = computeBookOrigin();
      setBookLift({ phase: 'up', origin });
      setIsZoomingToDetail(true);
      setTimeout(() => {
        setAppState('DETAIL');
        setIsZoomingToDetail(false);
      }, 800);
      return;
    }

    setIsZoomingToDetail(true);
    setTimeout(() => {
      setAppState('DETAIL');
      setIsZoomingToDetail(false);
    }, 450);
  };

  // 6. Return from Detail back to Object state
  const handleBackFromDetail = () => {
    // Book: buku diturunkan kembali ke posisi semula di meja
    if (currentObject === 'Book') {
      const origin = computeBookOrigin();
      setAppState('OBJECT');
      setBookLift({ phase: 'down', origin });
      centerDeskViewport(false);
      return;
    }
    setAppState('OBJECT');
    centerDeskViewport(false);
  };

  // Global Sound Mute Toggle
  const toggleMute = () => {
    const state = soundTrack.getState();
    if (state.volume > 0) {
      soundTrack.setVolume(0);
      setIsAudioMuted(true);
    } else {
      soundTrack.setVolume(0.6);
      setIsAudioMuted(false);
    }
  };

  // Mouse drag handling for desktop panning convenience (only active on HERO state)
  const handleMouseDown = (e) => {
    if (appState !== 'HERO' || isVideoPlaying) return;
    isMouseDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeftRef.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isMouseDownRef.current || !scrollContainerRef.current || appState !== 'HERO') return;
    const x = e.pageX - (scrollContainerRef.current.offsetLeft || 0);
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
      setShowPanHint(false);
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  const isHeroState = appState === 'HERO' && !isVideoPlaying;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans font-normal text-white select-none">
      {/* 1. Intro Screen Layer */}
      {appState === 'INTRO' && (
        <IntroScreen onStart={handleStartIntro} />
      )}

      {/* Bottom Pan Indicator (Only shown on small screens) */}
      {isHeroState && (
        <div className="fixed bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none md:hidden animate-fade-in">
          <div className="glass-panel px-4 py-2 rounded-full border border-white/20 flex items-center space-x-2.5 shadow-2xl backdrop-blur-xl">
            <MoveHorizontal className="w-3.5 h-3.5 text-neutral-300 animate-pulse" />
            <span className="text-xs font-extralight text-neutral-200 tracking-wider">
              Pan to Right or Left
            </span>
          </div>
        </div>
      )}

      {/* 2. Scrollable / Pannable Desk Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={() => setShowPanHint(false)}
        className={`w-full h-full no-scrollbar ${
          isHeroState
            ? 'overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing'
            : 'overflow-x-hidden overflow-y-hidden pointer-events-none'
        }`}
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: isHeroState ? 'pan-x' : 'none',
        }}
      >
        {/* Unified 16:9 Scene Canvas: Holds Video, Static Image, and Hotspots */}
        <div
          ref={sceneCanvasRef}
          className={`relative h-full aspect-[16/9] flex items-center justify-center transition-transform duration-500 mx-auto ${
            isZoomingToDetail ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
          }`}
          style={{
            height: '100%',
            minWidth: 'max(100vw, 177.78vh)',
          }}
        >
          {/* Desk Scene (Single Video Element & WebP Layer) */}
          <DeskScene
            currentVideoSrc={currentVideoSrc}
            currentStaticImage={currentStaticImage}
            isVideoPlaying={isVideoPlaying}
            onVideoEnded={handleVideoEnded}
          />

          {/* Interactive "screens" pinned on top of the object (monitor / paper / phone) */}
          {appState === 'OBJECT' && !isVideoPlaying && currentObject && (
            <ObjectScreen
              currentObject={currentObject}
              onOpenDetail={handleOpenDetail}
            />
          )}

          {/* Desk Hotspot Buttons (Pinned to exact coordinates on the 16:9 canvas) */}
          {isHeroState && (
            <>
              {Object.values(OBJECTS).map((item) => (
                <NavHotspot
                  key={item.id}
                  item={item}
                  onClick={handleSelectObject}
                  onHover={preloadVideo}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* 3. Object State Overlay (Kembali ke Hero, Detail Proyek, Bike Modal, Turntable) */}
      {appState === 'OBJECT' && !isVideoPlaying && currentObject && !bookLift && (
        <ObjectOverlay
          currentObject={currentObject}
          objectData={OBJECTS[currentObject]}
          onBackToHero={handleBackToHero}
          onOpenDetail={handleOpenDetail}
          onOpenBikeJourney={() => setIsBikeModalOpen(true)}
        />
      )}

      {/* 4. Bike Journey Modal */}
      <BikeModal
        isOpen={isBikeModalOpen}
        onClose={() => setIsBikeModalOpen(false)}
      />

      {/* 4b. Animasi mengambil / menurunkan buku dari meja (Book of Books) */}
      {bookLift?.origin && (
        <BookLift
          phase={bookLift.phase}
          origin={bookLift.origin}
          onDone={() => setBookLift(null)}
        />
      )}

      {/* 5. Project Detail View (<state> Detail) */}
      {appState === 'DETAIL' && currentObject && (
        <ProjectDetail
          objectKey={currentObject}
          objectData={OBJECTS[currentObject]}
          route={detailRoute}
          onBack={handleBackFromDetail}
        />
      )}
    </div>
  );
}
