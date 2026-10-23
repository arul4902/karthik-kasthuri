import React, { useState, useRef, useEffect } from 'react';
import { Play, Plus, Check, Heart, ChevronDown } from 'lucide-react';
import { ContentItem } from '../../types/content';
import { useStreaming } from '../../context/StreamingContext';
import './ContentCard.css';

interface ContentCardProps {
  item: ContentItem;
  variant?: 'landscape' | 'portrait';
  isTop10?: boolean;
  rank?: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  variant = 'landscape',
  isTop10 = false,
  rank
}) => {
  const {
    openDetailsModal,
    startPlaying,
    isInMyList,
    toggleMyList,
    isLiked,
    toggleLike
  } = useStreaming();

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);

  const inList = isInMyList(item.id);
  const liked = isLiked(item.id);

  const handleMouseEnter = () => {
    if (window.matchMedia('(pointer: fine)').matches) {
      hoverTimerRef.current = window.setTimeout(() => {
        setIsHovered(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleCardClick = () => {
    openDetailsModal(item);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startPlaying(item);
  };

  const handleListClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMyList(item.id);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(item.id);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDetailsModal(item);
  };

  const displayImage = variant === 'portrait' ? item.poster : item.backdrop;

  return (
    <div
      className={`card-wrapper ${variant}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${item.title}, ${item.memoryDate || ''}`}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetailsModal(item);
        }
      }}
    >
      <div className={isTop10 ? 'top10-item-container' : ''}>
        {isTop10 && rank !== undefined && (
          <div className={`top10-rank-number ${rank <= 3 ? 'top3' : ''}`}>
            {rank}
          </div>
        )}

        <div className="card-inner">
          <div className="card-thumb-container">
            <img
              src={displayImage}
              alt={item.title}
              className="card-img"
              loading="lazy"
            />

            {/* Episode Badge */}
            {item.chapterNumber && (
              <span className="card-episode-badge">
                CH {item.chapterNumber < 10 ? `0${item.chapterNumber}` : item.chapterNumber}
              </span>
            )}

            {/* Title Overlay for landscape cards */}
            {variant === 'landscape' && !item.progress && (
              <div className="card-title-overlay">
                <div className="card-title-main">{item.title}</div>
                {item.tamilTitle && <div className="card-title-tamil">{item.tamilTitle}</div>}
              </div>
            )}

            {/* Progress Bar for Continue Watching */}
            {item.progress !== undefined && (
              <div className="card-progress-bar-bg">
                <div
                  className="card-progress-bar-fill"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Netflix Expanded Hover Preview Card */}
      {isHovered && (
        <div
          className="hover-preview-card"
          onClick={e => e.stopPropagation()}
        >
          <div className="preview-media-container">
            {item.videoSource ? (
              <video
                src={item.videoSource}
                className="preview-video"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={item.backdrop}
                alt={item.title}
                className="preview-img"
              />
            )}
            <div className="preview-title-badge">
              <span>{item.title}</span>
              {item.tamilTitle && <small className="preview-tamil-sub">{item.tamilTitle}</small>}
            </div>
          </div>

          <div className="preview-body">
            <div className="preview-actions">
              <div className="preview-actions-left">
                <button
                  className="round-btn play-btn"
                  onClick={handlePlayClick}
                  aria-label="Play now"
                >
                  <Play size={16} fill="currentColor" />
                </button>
                <button
                  className={`round-btn ${inList ? 'active' : ''}`}
                  onClick={handleListClick}
                  aria-label={inList ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                  {inList ? <Check size={16} /> : <Plus size={16} />}
                </button>
                <button
                  className={`round-btn ${liked ? 'active' : ''}`}
                  onClick={handleLikeClick}
                  aria-label={liked ? 'Unlike' : 'Like'}
                >
                  <Heart size={15} fill={liked ? '#E50914' : 'none'} color={liked ? '#E50914' : '#fff'} />
                </button>
              </div>

              <button
                className="round-btn"
                onClick={handleInfoClick}
                aria-label="More details"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="preview-meta">
              <span className="match">{item.matchScore}% Match</span>
              <span className="badge-mini">{item.memoryDate || 'Memory'}</span>
              <span className="badge-mini">{item.location || 'Chennai'}</span>
            </div>

            <p className="preview-synopsis-mini">{item.synopsis}</p>

            <div className="preview-genres">
              {item.genres.slice(0, 3).map((genre, idx) => (
                <React.Fragment key={genre}>
                  <span>{genre}</span>
                  {idx < Math.min(item.genres.length - 1, 2) && (
                    <span className="genre-dot">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
