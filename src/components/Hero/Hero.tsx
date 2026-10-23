import React, { useState, useRef, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX, Heart, Music, Coffee, Film } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ASSETS } from '../../data/mockContent';
import './Hero.css';

export const Hero: React.FC = () => {
  const {
    heroTitle,
    openDetailsModal,
    startPlaying,
    toggleSong,
    isPlayingSong,
    openCinemaMode,
    currentProfile
  } = useStreaming();

  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const isOreoMode = currentProfile.name === 'Oreo';

  return (
    <section className="hero-container" aria-label="Featured Story: Karthik & Kasthuri">
      {/* Background Media: Real Couple Video Trailer with High-Res Photo Fallback */}
      <div className="hero-media">
        {!videoError && heroTitle.videoSource ? (
          <video
            ref={videoRef}
            className="hero-video"
            src={heroTitle.videoSource}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => {
              if (heroTitle.fallbackVideo && videoRef.current && videoRef.current.src !== heroTitle.fallbackVideo) {
                videoRef.current.src = heroTitle.fallbackVideo;
              } else {
                setVideoError(true);
              }
            }}
          />
        ) : (
          <img
            src={heroTitle.backdrop || ASSETS.HERO_FIELD_RUN}
            alt="Karthik & Kasthuri"
            className="hero-backdrop-img"
          />
        )}
      </div>

      {/* Cinematic Gradient Overlays */}
      <div className="hero-overlay-vignette" />
      <div className="hero-overlay-top" />
      <div className="hero-overlay-bottom" />

      {/* Hero Text & Controls */}
      <div className="hero-content">
        {isOreoMode && (
          <div className="oreo-pov-badge">
            🐾 OREO'S SPECIAL CUT: "Watching my parents' love story through puppy eyes!"
          </div>
        )}

        <div className="hero-featured-tag">
          <span className="kk-symbol">K&K</span>
          <span>A KARTHIK & KASTHURI ORIGINAL SERIES</span>
        </div>

        <h1 className="hero-title">ONE COFFEE. TWO STRANGERS. ONE FOREVER.</h1>

        <div className="hero-tamil-subtitle">
          <Coffee size={20} className="coffee-icon" />
          <span>அன்று ஒரு காபி… இன்று ஒரு குடும்பம்.</span>
        </div>

        <div className="hero-metadata">
          <span className="match-score">
            <Heart size={16} fill="currentColor" /> 100% Match
          </span>
          <span className="badge-tag">LOVE STORY • REAL MEMORIES • FOREVER</span>
          <span className="badge-tag">{heroTitle.memoryDate || 'December 2023'}</span>
          <span className="badge-tag quality">4K Ultra HD</span>
          <span className="badge-tag">Spatial Audio</span>
          <span className="duration">{heroTitle.location || 'Adyar, Chennai'}</span>
        </div>

        <p className="hero-synopsis">
          An unexpected December coffee in Adyar. A little joke, a hand held without a confession, countless bike rides, a love that survived life's hardest chapters, and two hearts building a future together.
        </p>

        <div className="hero-actions">
          <button
            className="btn-play"
            onClick={() => startPlaying(heroTitle)}
            aria-label="Play Our Story"
          >
            <Play size={22} fill="currentColor" />
            <span>Play Our Story</span>
          </button>

          <button
            className="btn-cinema-hero"
            onClick={() => openCinemaMode(0)}
            aria-label="Binge Our Story in Fullscreen Cinema Mode"
          >
            <Film size={20} />
            <span>🎬 Binge Our Story</span>
          </button>

          <button
            className="btn-info"
            onClick={() => openDetailsModal(heroTitle)}
            aria-label="Explore Their Journey"
          >
            <Info size={22} />
            <span>Explore Journey</span>
          </button>

          <button
            className="btn-soundtrack-hero"
            onClick={toggleSong}
            aria-label="Listen to Official Tamil Song"
          >
            <Music size={18} />
            <span>{isPlayingSong ? 'Pause Song 🎵' : 'Play Official Song'}</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Audio Toggle and Maturity Badge */}
      <div className="hero-right-controls">
        {!videoError && heroTitle.videoSource && (
          <button
            className="audio-toggle-btn"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        )}
        <div className="maturity-tag">
          KARTHIK & KASTHURI • FOREVER
        </div>
      </div>
    </section>
  );
};
