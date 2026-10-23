import React, { useState } from 'react';
import { Play, Pause, BookOpen } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { TAMIL_SOUNDTRACK, ASSETS } from '../../data/mockContent';
import './SoundtrackPlayer.css';

export const SoundtrackPlayer: React.FC = () => {
  const {
    isPlayingSong,
    toggleSong,
    songCurrentTime,
    songDuration,
    songProgress,
    seekSong
  } = useStreaming();

  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLang, setLyricsLang] = useState<'tamil' | 'english'>('tamil');

  const formatSeconds = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    seekSong(Math.max(0, Math.min(100, pos * 100)));
  };

  return (
    <section className="soundtrack-section" id="soundtrack-feature" aria-label="Official Soundtrack">
      <div className="soundtrack-card">
        {/* Album Artwork */}
        <div className="album-art-container">
          <img
            src={ASSETS.WATERFALL_ROMANCE}
            alt="Official Soundtrack: ஒரு காபியில் தொடங்கிய காதல்"
            className="album-art"
          />
          <div className="vinyl-badge">OFFICIAL SOUNDTRACK</div>
        </div>

        {/* Music Information & Player Controls */}
        <div className="soundtrack-info">
          <div>
            <div className="soundtrack-badge-row">
              <span className="badge-tag-red">ORIGINAL TAMIL SONG</span>
              <span className="badge-tag">COMPOSED FOR KARTHIK & KASTHURI</span>
            </div>

            <h2 className="soundtrack-title">{TAMIL_SOUNDTRACK.title}</h2>
            <div className="soundtrack-english-title">{TAMIL_SOUNDTRACK.englishTitle}</div>
            <p className="soundtrack-desc">
              Inspired by that unscripted December evening in Adyar, this romantic melody celebrates the journey from two strangers drinking coffee to husband, wife, and a lifetime of shared dreams.
            </p>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className={`waveform-container ${isPlayingSong ? 'playing' : ''}`}>
            {Array.from({ length: 32 }).map((_, idx) => (
              <div
                key={idx}
                className="wave-bar"
                style={{
                  height: isPlayingSong
                    ? `${Math.max(15, ((idx * 7) % 36) + 12)}px`
                    : '6px',
                  animationDelay: `${(idx % 8) * 0.12}s`
                }}
              />
            ))}
          </div>

          {/* Scrubber Progress Bar */}
          <div
            className="audio-scrubber-track"
            onClick={handleScrubberClick}
            role="slider"
            aria-valuenow={songCurrentTime}
            aria-valuemin={0}
            aria-valuemax={songDuration}
            aria-label="Soundtrack Seek Bar"
          >
            <div
              className="audio-scrubber-fill"
              style={{ width: `${songProgress}%` }}
            />
          </div>

          <div className="audio-time-row">
            <span>{formatSeconds(songCurrentTime)}</span>
            <span>{formatSeconds(songDuration)}</span>
          </div>

          {/* Action Buttons */}
          <div className="audio-controls-row">
            <button
              className="btn-audio-main-play"
              onClick={toggleSong}
              aria-label={isPlayingSong ? 'Pause Song' : 'Play Song'}
            >
              {isPlayingSong ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" />}
            </button>

            <button
              className="btn-audio-lyrics-toggle"
              onClick={() => setShowLyrics(prev => !prev)}
            >
              <BookOpen size={16} />
              <span>{showLyrics ? 'Hide Lyrics' : 'View Lyrics'}</span>
            </button>
          </div>

          {/* Lyrics Box */}
          {showLyrics && (
            <div className="lyrics-box">
              <div className="lyrics-lang-switch">
                <button
                  className={`lyrics-lang-btn ${lyricsLang === 'tamil' ? 'active' : ''}`}
                  onClick={() => setLyricsLang('tamil')}
                >
                  தமிழ் வரிகள்
                </button>
                <button
                  className={`lyrics-lang-btn ${lyricsLang === 'english' ? 'active' : ''}`}
                  onClick={() => setLyricsLang('english')}
                >
                  English Meaning
                </button>
              </div>

              <div className="lyrics-lines">
                {(lyricsLang === 'tamil'
                  ? TAMIL_SOUNDTRACK.lyricsTamil
                  : TAMIL_SOUNDTRACK.lyricsEnglish
                ).map((line, idx) => (
                  <div key={idx} style={{ minHeight: line === '' ? 12 : 'auto' }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// Persistent Mini Player across the website
export const PersistentMiniPlayer: React.FC = () => {
  const { isPlayingSong, toggleSong, songProgress } = useStreaming();

  if (!isPlayingSong) return null;

  return (
    <div className="floating-mini-player" role="region" aria-label="Now Playing Mini Player">
      <img
        src={ASSETS.WATERFALL_ROMANCE}
        alt="Karthik & Kasthuri Soundtrack"
        className="mini-thumb"
      />
      <div className="mini-info">
        <div className="mini-title">{TAMIL_SOUNDTRACK.title}</div>
        <div className="mini-subtitle">Karthik & Kasthuri Official Soundtrack</div>
        <div className="mini-progress-bar">
          <div className="mini-progress-fill" style={{ width: `${songProgress}%` }} />
        </div>
      </div>
      <button
        className="mini-play-btn"
        onClick={toggleSong}
        aria-label="Pause Soundtrack"
      >
        <Pause size={18} fill="#000" />
      </button>
    </div>
  );
};
