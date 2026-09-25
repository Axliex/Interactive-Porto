import React, { useRef, useEffect, useState } from 'react';

export default function DeskScene({
  currentVideoSrc,
  currentStaticImage,
  isVideoPlaying,
  onVideoEnded,
  onVideoReady,
}) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // When video source changes and isVideoPlaying is true, play the video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (currentVideoSrc && isVideoPlaying) {
      setVideoLoaded(false);
      video.src = currentVideoSrc;
      video.load();

      const handleCanPlay = () => {
        setVideoLoaded(true);
        video.play().catch((err) => {
          console.warn('Video auto-play prevented or interrupted:', err);
        });
        if (onVideoReady) onVideoReady();
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    } else if (!isVideoPlaying) {
      video.pause();
    }
  }, [currentVideoSrc, isVideoPlaying, onVideoReady]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background Static WebP Frame Layer (Active when video is ended or paused) */}
      {currentStaticImage && (
        <img
          src={currentStaticImage}
          alt="Desk Scene"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isVideoPlaying && videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          draggable={false}
        />
      )}

      {/* Single Dynamic Video Transition Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 pointer-events-none ${
          isVideoPlaying && videoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onEnded={onVideoEnded}
      />
    </div>
  );
}
