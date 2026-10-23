import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  MessageSquare,
  Gauge,
  SkipForward,
  Check
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import './VideoPlayer.css';

export const VideoPlayer: React.FC = () => {
  const { playingTitle, stopPlaying, allEpisodes, startPlaying, showToast } = useStreaming();

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [centerIcon, setCenterIcon] = useState<'play' | 'pause' | null>(null);
  const [showSubtitlesModal, setShowSubtitlesModal] = useState(false);
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState('English [Original]');
  const [selectedSubtitle, setSelectedSubtitle] = useState('English [CC]');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSubtitlesModal(false);
        setShowSpeedModal(false);
      }
    }, 3500);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      setCenterIcon('play');
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setCenterIcon('pause');
    }
    setTimeout(() => setCenterIcon(null), 500);
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds)
      );
      resetHideTimer();
    }
  }, [resetHideTimer]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleNext = () => {
    if (!playingTitle) return;
    const currentIndex = allEpisodes.findIndex(t => t.id === playingTitle.id);
    const nextIndex = (currentIndex + 1) % allEpisodes.length;
    startPlaying(allEpisodes[nextIndex]);
    showToast(`Now Playing: ${allEpisodes[nextIndex].title}`);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          stopPlaying();
        }
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.key === 'f') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipTime, stopPlaying, resetHideTimer]);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPlaying, resetHideTimer]);

  if (!playingTitle) return null;

  const currentProgressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={`player-overlay ${!showControls ? 'controls-hidden' : ''}`}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={playingTitle.videoSource || playingTitle.fallbackVideo}
        className="player-video"
        autoPlay
        playsInline
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
            videoRef.current.playbackRate = playbackSpeed;
          }
        }}
        onEnded={handleNext}
        onError={() => {
          if (playingTitle.fallbackVideo && videoRef.current && videoRef.current.src !== playingTitle.fallbackVideo) {
            videoRef.current.src = playingTitle.fallbackVideo;
          } else {
            setHasError(true);
          }
        }}
      />

      {/* Center Feedback Icon */}
      {centerIcon && (
        <div className="center-flash-feedback">
          {centerIcon === 'play' ? (
            <Play size={44} fill="#fff" />
          ) : (
            <Pause size={44} fill="#fff" />
          )}
        </div>
      )}

      {/* Fallback Notice if Video Error */}
      {hasError && (
        <div className="player-error-banner">
          <h3>Stream Temporarily Unavailable</h3>
          <p>
            The media stream for {playingTitle.title} is currently buffering or restricted.
            Switching to preview stream simulation.
          </p>
        </div>
      )}

      {/* Top Header Controls */}
      <div className="player-top-bar">
        <button
          className="player-back-btn"
          onClick={stopPlaying}
          aria-label="Exit player"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="player-title-info">
          <span className="player-main-title">{playingTitle.title}</span>
          <span className="player-badge">{playingTitle.maturityRating}</span>
          <span className="player-badge">{playingTitle.qualityBadge}</span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="player-bottom-controls">
        {/* Timeline Scrubber */}
        <div
          className="scrubber-container"
          onClick={handleSeek}
          role="slider"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-label="Seek timeline"
        >
          <div
            className="scrubber-fill"
            style={{ width: `${currentProgressPercent}%` }}
          >
            <div className="scrubber-thumb" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="controls-row">
          <div className="controls-group-left">
            <button
              className="control-icon-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" />
              ) : (
                <Play size={28} fill="currentColor" />
              )}
            </button>

            <button
              className="control-icon-btn"
              onClick={() => skipTime(-10)}
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw size={22} />
            </button>

            <button
              className="control-icon-btn"
              onClick={() => skipTime(10)}
              aria-label="Forward 10 seconds"
            >
              <RotateCw size={22} />
            </button>

            <div className="volume-control-box">
              <button
                className="control-icon-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Volume slider"
              />
            </div>

            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="controls-group-right">
            <button
              className="control-icon-btn"
              onClick={handleNext}
              aria-label="Next title"
              title="Next Title"
            >
              <SkipForward size={22} />
            </button>

            {/* Audio & Subtitles Selector */}
            <button
              className="control-icon-btn"
              onClick={() => {
                setShowSubtitlesModal(prev => !prev);
                setShowSpeedModal(false);
              }}
              aria-label="Audio & Subtitles"
              title="Audio & Subtitles"
            >
              <MessageSquare size={22} />
            </button>

            {/* Playback Speed Selector */}
            <button
              className="control-icon-btn"
              onClick={() => {
                setShowSpeedModal(prev => !prev);
                setShowSubtitlesModal(false);
              }}
              aria-label="Playback speed"
              title="Playback Speed"
            >
              <Gauge size={22} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              className="control-icon-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Audio & Subtitles Modal */}
      {showSubtitlesModal && (
        <div className="audio-subtitles-modal">
          <div className="audio-sub-col">
            <h4>Audio</h4>
            {['English [Original]', 'Spanish', 'French [Atmos]', 'German', 'Japanese'].map(audio => (
              <button
                key={audio}
                className={`sub-option-btn ${selectedAudio === audio ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedAudio(audio);
                  showToast(`Audio set to ${audio}`);
                }}
              >
                {selectedAudio === audio && <Check size={14} color="#E50914" />}
                <span>{audio}</span>
              </button>
            ))}
          </div>

          <div className="audio-sub-col">
            <h4>Subtitles</h4>
            {['Off', 'English [CC]', 'Spanish', 'French', 'German'].map(sub => (
              <button
                key={sub}
                className={`sub-option-btn ${selectedSubtitle === sub ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSubtitle(sub);
                  showToast(`Subtitles set to ${sub}`);
                }}
              >
                {selectedSubtitle === sub && <Check size={14} color="#E50914" />}
                <span>{sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Playback Speed Menu */}
      {showSpeedModal && (
        <div className="speed-menu-modal">
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
            <button
              key={speed}
              className={`speed-option-btn ${playbackSpeed === speed ? 'selected' : ''}`}
              onClick={() => {
                setPlaybackSpeed(speed);
                if (videoRef.current) {
                  videoRef.current.playbackRate = speed;
                }
                setShowSpeedModal(false);
                showToast(`Playback speed set to ${speed}x`);
              }}
            >
              <span>{speed === 1 ? 'Normal (1x)' : `${speed}x`}</span>
              {playbackSpeed === speed && <Check size={14} color="#E50914" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
