import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Music,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  Film
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { TAMIL_SOUNDTRACK } from '../../data/mockContent';
import './CinemaMode.css';

export const CinemaMode: React.FC = () => {
  const {
    isCinemaMode,
    closeCinemaMode,
    allEpisodes,
    cinemaChapterIndex,
    setCinemaChapterIndex,
    isPlayingSong,
    toggleSong,
    songCurrentTime,
    songDuration,
    triggerConfetti,
    toggleLike,
    isLiked
  } = useStreaming();

  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideSpeed, setSlideSpeed] = useState<number>(7); // seconds per slide
  const [slideProgress, setSlideProgress] = useState(0);
  const [showFilmstrip, setShowFilmstrip] = useState(true);

  const currentChapter = allEpisodes[cinemaChapterIndex] || allEpisodes[0];
  const totalChapters = allEpisodes.length;

  // Auto-advance timer
  useEffect(() => {
    if (!isCinemaMode || !isAutoPlaying) return;

    setSlideProgress(0);
    const intervalMs = 100;
    const stepIncrement = 100 / ((slideSpeed * 1000) / intervalMs);

    const timer = setInterval(() => {
      setSlideProgress(prev => {
        if (prev >= 100) {
          setCinemaChapterIndex((cinemaChapterIndex + 1) % totalChapters);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isCinemaMode, isAutoPlaying, slideSpeed, cinemaChapterIndex, totalChapters, setCinemaChapterIndex]);

  // Keyboard shortcut navigation
  useEffect(() => {
    if (!isCinemaMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCinemaMode();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinemaMode, cinemaChapterIndex, totalChapters]);

  if (!isCinemaMode) return null;

  const nextSlide = () => {
    setSlideProgress(0);
    setCinemaChapterIndex((cinemaChapterIndex + 1) % totalChapters);
  };

  const prevSlide = () => {
    setSlideProgress(0);
    setCinemaChapterIndex((cinemaChapterIndex - 1 + totalChapters) % totalChapters);
  };

  const handleCherish = () => {
    toggleLike(currentChapter.id);
    triggerConfetti();
  };

  const formatSeconds = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const liked = isLiked(currentChapter.id);

  return (
    <div className="cinema-theater-overlay" role="dialog" aria-modal="true" aria-label="Cinema Story Theater">
      {/* Top Slide Progress Bar */}
      <div className="cinema-top-progress-bar">
        <div
          className="cinema-progress-fill"
          style={{ width: isAutoPlaying ? `${slideProgress}%` : '0%' }}
        />
      </div>

      {/* Top Header Controls */}
      <header className="cinema-header">
        <div className="cinema-brand-chip">
          <span className="cinema-live-dot" />
          <span className="cinema-brand-title">KARTHIK & KASTHURI CINEMA THEATER</span>
          <span className="cinema-chapter-counter">
            CHAPTER {cinemaChapterIndex + 1} OF {totalChapters}
          </span>
        </div>

        <div className="cinema-header-actions">
          {/* Speed Switcher */}
          <div className="cinema-speed-pills">
            <span className="speed-label">Pace:</span>
            {[4, 7, 10].map(sec => (
              <button
                key={sec}
                className={`speed-pill-btn ${slideSpeed === sec ? 'active' : ''}`}
                onClick={() => setSlideSpeed(sec)}
              >
                {sec}s
              </button>
            ))}
          </div>

          {/* Soundtrack Quick Controller */}
          <div className="cinema-soundtrack-badge" onClick={toggleSong}>
            <div className={`cinema-sound-bars ${isPlayingSong ? 'active' : ''}`}>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </div>
            <span className="cinema-sound-text">
              {isPlayingSong ? 'Soundtrack Playing' : 'Play Soundtrack'}
            </span>
          </div>

          <button
            className="cinema-exit-btn"
            onClick={closeCinemaMode}
            aria-label="Exit Cinema Theater"
          >
            <X size={20} />
            <span className="exit-text">Exit Theater (ESC)</span>
          </button>
        </div>
      </header>

      {/* Main Cinematic Visual Stage */}
      <div className="cinema-stage">
        {/* Background Visual with Ken-Burns Animation */}
        <div className="cinema-media-frame">
          {currentChapter.videoSource ? (
            <video
              key={`vid-${currentChapter.id}`}
              src={currentChapter.videoSource}
              autoPlay
              loop
              muted={true}
              playsInline
              className="cinema-video-asset"
            />
          ) : (
            <img
              key={`img-${currentChapter.id}`}
              src={currentChapter.backdrop || currentChapter.poster}
              alt={currentChapter.title}
              className="cinema-backdrop-kenburns"
            />
          )}
          <div className="cinema-vignette-layer" />
        </div>

        {/* Floating Chevrons for Quick Click */}
        <button
          className="cinema-chevron-btn left"
          onClick={prevSlide}
          aria-label="Previous Chapter"
        >
          <ChevronLeft size={32} />
        </button>

        <button
          className="cinema-chevron-btn right"
          onClick={nextSlide}
          aria-label="Next Chapter"
        >
          <ChevronRight size={32} />
        </button>

        {/* Emotional Subtitles / Narrative Card */}
        <div className="cinema-narrative-card">
          <div className="cinema-narrative-meta">
            <span className="cinema-chapter-tag">CH {currentChapter.chapterNumber || cinemaChapterIndex + 1}</span>
            {currentChapter.location && (
              <span className="cinema-meta-item">
                <MapPin size={14} />
                {currentChapter.location}
              </span>
            )}
            {currentChapter.memoryDate && (
              <span className="cinema-meta-item">
                <Clock size={14} />
                {currentChapter.memoryDate}
              </span>
            )}
            <span className="cinema-quality-badge">4K ULTRA HD</span>
          </div>

          <h2 className="cinema-title">{currentChapter.title}</h2>
          {currentChapter.tamilTitle && (
            <div className="cinema-tamil-title">{currentChapter.tamilTitle}</div>
          )}

          <p className="cinema-story-text">
            {currentChapter.detailedStory || currentChapter.synopsis}
          </p>

          <div className="cinema-actions-row">
            <button
              className={`cinema-cherish-btn ${liked ? 'cherished' : ''}`}
              onClick={handleCherish}
            >
              <Heart size={18} fill={liked ? '#E50914' : 'none'} />
              <span>{liked ? 'Cherished Forever ❤️' : 'Cherish Memory'}</span>
            </button>

            <button
              className="cinema-celebrate-btn"
              onClick={triggerConfetti}
            >
              <Sparkles size={18} />
              <span>Shower Love ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar & Filmstrip Scrubber */}
      <footer className="cinema-footer">
        <div className="cinema-controls-bar">
          <div className="cinema-playback-controls">
            <button
              className="cinema-playpause-btn"
              onClick={() => setIsAutoPlaying(prev => !prev)}
              aria-label={isAutoPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
            >
              {isAutoPlaying ? <Pause size={20} fill="#fff" /> : <Play size={20} fill="#fff" />}
              <span>{isAutoPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}</span>
            </button>

            <button
              className="cinema-toggle-filmstrip"
              onClick={() => setShowFilmstrip(prev => !prev)}
            >
              <Film size={18} />
              <span>{showFilmstrip ? 'Hide Chapters Ribbon' : 'Show All 30 Chapters'}</span>
            </button>
          </div>

          {/* Current Song status */}
          <div className="cinema-audio-status">
            <Music size={16} className="music-pulse" />
            <span className="song-title-text">{TAMIL_SOUNDTRACK.title} ({TAMIL_SOUNDTRACK.englishTitle})</span>
            <span className="song-time-text">{formatSeconds(songCurrentTime)} / {formatSeconds(songDuration)}</span>
          </div>
        </div>

        {/* 30-Chapter Filmstrip Drawer */}
        {showFilmstrip && (
          <div className="cinema-filmstrip-drawer">
            <div className="filmstrip-scroll">
              {allEpisodes.map((ep, idx) => (
                <div
                  key={ep.id}
                  className={`filmstrip-item ${idx === cinemaChapterIndex ? 'active' : ''}`}
                  onClick={() => {
                    setSlideProgress(0);
                    setCinemaChapterIndex(idx);
                  }}
                >
                  <img
                    src={ep.poster || ep.backdrop}
                    alt={ep.title}
                    className="filmstrip-thumb"
                  />
                  <div className="filmstrip-badge">CH {idx + 1}</div>
                  <div className="filmstrip-label">{ep.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
};
