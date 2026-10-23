import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Heart,
  Volume2,
  VolumeX,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Music
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ContentItem } from '../../types/content';
import { ASSETS } from '../../data/mockContent';
import './ContentModal.css';

export const ContentModal: React.FC = () => {
  const {
    selectedTitle,
    closeDetailsModal,
    startPlaying,
    isInMyList,
    toggleMyList,
    isLiked,
    toggleLike,
    allEpisodes,
    openDetailsModal,
    toggleSong,
    isPlayingSong
  } = useStreaming();

  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTitle) {
      document.body.classList.add('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedTitle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDetailsModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeDetailsModal]);

  if (!selectedTitle) return null;

  const inList = isInMyList(selectedTitle.id);
  const liked = isLiked(selectedTitle.id);

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDetailsModal();
    }
  };

  // Previous & Next Chapter navigation
  const currentIndex = allEpisodes.findIndex(e => e.id === selectedTitle.id);
  const prevChapter = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextChapter = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  const similarItems: ContentItem[] = selectedTitle.similarIds
    ? allEpisodes.filter(t => selectedTitle.similarIds?.includes(t.id))
    : allEpisodes.filter(t => t.id !== selectedTitle.id).slice(0, 4);

  // Gallery of authentic photos for this memory
  const memoryGallery = [
    selectedTitle.backdrop,
    selectedTitle.poster,
    ASSETS.BENCH_GARDEN,
    ASSETS.ROOFTOP_EVENING
  ].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container" ref={containerRef}>
        <button
          className="modal-close-btn"
          onClick={closeDetailsModal}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Banner */}
        <div className="modal-banner">
          {!videoError && selectedTitle.videoSource ? (
            <video
              ref={videoRef}
              src={selectedTitle.videoSource}
              className="modal-banner-media"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onError={() => {
                if (selectedTitle.fallbackVideo && videoRef.current && videoRef.current.src !== selectedTitle.fallbackVideo) {
                  videoRef.current.src = selectedTitle.fallbackVideo;
                } else {
                  setVideoError(true);
                }
              }}
            />
          ) : (
            <img
              src={selectedTitle.backdrop}
              alt={selectedTitle.title}
              className="modal-banner-media"
            />
          )}

          <div className="modal-banner-gradient" />

          {/* Chapter Navigation Floating Chevrons */}
          <div className="modal-nav-chevrons">
            {prevChapter && (
              <button
                className="modal-chevron-btn left"
                onClick={() => openDetailsModal(prevChapter)}
                title={`Previous: ${prevChapter.title}`}
                aria-label="Previous Chapter"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {nextChapter && (
              <button
                className="modal-chevron-btn right"
                onClick={() => openDetailsModal(nextChapter)}
                title={`Next: ${nextChapter.title}`}
                aria-label="Next Chapter"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          <div className="modal-banner-actions">
            <div className="modal-banner-actions-left">
              <button
                className="btn-play"
                onClick={() => startPlaying(selectedTitle)}
              >
                <Play size={20} fill="currentColor" />
                <span>Play Chapter</span>
              </button>

              <button
                className={`round-btn ${inList ? 'active' : ''}`}
                onClick={() => toggleMyList(selectedTitle.id)}
                aria-label={inList ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                {inList ? <Check size={18} /> : <Plus size={18} />}
              </button>

              <button
                className={`round-btn ${liked ? 'active' : ''}`}
                onClick={() => toggleLike(selectedTitle.id)}
                aria-label={liked ? 'Unlike' : 'Like'}
              >
                <Heart size={16} fill={liked ? '#E50914' : 'none'} color={liked ? '#E50914' : '#fff'} />
              </button>

              <button
                className="round-btn"
                onClick={toggleSong}
                title={isPlayingSong ? 'Pause Soundtrack' : 'Play Official Tamil Soundtrack'}
                aria-label="Soundtrack"
              >
                <Music size={16} />
              </button>
            </div>

            {!videoError && selectedTitle.videoSource && (
              <button
                className="modal-sound-btn"
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}
          </div>
        </div>

        {/* Modal Content Details */}
        <div className="modal-body">
          <div className="modal-details-grid">
            <div className="modal-main-info">
              <div className="modal-meta-row">
                <span className="match-score">100% Match</span>
                <span className="badge-tag">
                  {selectedTitle.chapterNumber ? `EPISODE ${selectedTitle.chapterNumber < 10 ? `0${selectedTitle.chapterNumber}` : selectedTitle.chapterNumber}` : 'MOMENT'}
                </span>
                <span className="badge-tag">{selectedTitle.memoryDate || 'December 2023'}</span>
                <span className="badge-tag quality">{selectedTitle.qualityBadge}</span>
                <span className="duration">
                  <MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {selectedTitle.location || 'Chennai'}
                </span>
              </div>

              <h2 id="modal-title" style={{ fontSize: '2rem', marginTop: 14, marginBottom: 4 }}>
                {selectedTitle.title}
              </h2>

              {selectedTitle.tamilTitle && (
                <div style={{ fontSize: '1.2rem', color: '#F5A623', fontWeight: 700, marginBottom: 16 }}>
                  {selectedTitle.tamilTitle}
                </div>
              )}

              <p className="modal-synopsis">
                {selectedTitle.detailedStory || selectedTitle.synopsis}
              </p>
            </div>

            <div className="modal-sidebar">
              <div className="modal-sidebar-item">
                <span className="modal-sidebar-label">In This Memory: </span>
                <span className="modal-sidebar-value">Karthik & Kasthuri</span>
              </div>
              <div className="modal-sidebar-item">
                <span className="modal-sidebar-label">Location: </span>
                <span className="modal-sidebar-value">{selectedTitle.location || 'Chennai'}</span>
              </div>
              <div className="modal-sidebar-item">
                <span className="modal-sidebar-label">Time: </span>
                <span className="modal-sidebar-value">{selectedTitle.memoryDate || 'Eternal'}</span>
              </div>
              <div className="modal-sidebar-item">
                <span className="modal-sidebar-label">Themes: </span>
                <span className="modal-sidebar-value">{selectedTitle.tags.join(' • ')}</span>
              </div>
            </div>
          </div>

          {/* Authentic Memory Gallery */}
          <div className="modal-gallery-section">
            <h3 style={{ fontSize: '1.25rem', marginBottom: 14 }}>Authentic Memory Photos</h3>
            <div className="memory-gallery-grid">
              {memoryGallery.map((imgSrc, idx) => (
                <div key={idx} className="memory-gallery-card">
                  <img src={imgSrc} alt="Memory photograph" className="memory-gallery-img" />
                </div>
              ))}
            </div>
          </div>

          {/* More Like This / Related Chapters */}
          {similarItems.length > 0 && (
            <div className="modal-similar-section">
              <h3>More Cherished Chapters</h3>
              <div className="similar-grid">
                {similarItems.map(sim => (
                  <div
                    key={sim.id}
                    className="similar-card"
                    onClick={() => openDetailsModal(sim)}
                  >
                    <img src={sim.backdrop} alt={sim.title} className="similar-thumb" />
                    <div className="similar-card-body">
                      <div className="similar-card-title">{sim.title}</div>
                      <div className="similar-card-meta">
                        <span style={{ color: '#46d369', fontWeight: 700 }}>
                          100% Match
                        </span>
                        <span>{sim.memoryDate || 'Forever'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
