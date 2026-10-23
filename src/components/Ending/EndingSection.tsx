import React from 'react';
import { RotateCcw, Heart, Music, List } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ASSETS } from '../../data/mockContent';
import './EndingSection.css';

export const EndingSection: React.FC = () => {
  const { toggleSong, isPlayingSong, setActiveTab } = useStreaming();

  const handleReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreAll = () => {
    setActiveTab('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="ending-section" aria-label="Closing Chapter: Our Forever">
      <img
        src={ASSETS.FIELD_WALK_PORTRAIT}
        alt="Karthik & Kasthuri Walking Hand in Hand"
        className="ending-backdrop"
      />
      <div className="ending-overlay-vignette" />

      <div className="ending-content">
        <div className="ending-symbol">
          <Heart size={16} fill="currentColor" />
          <span>EPILOGUE • THE UNWRITTEN TOMORROW</span>
        </div>

        <h2 className="ending-heading">THIS STORY HAS NO END CARD.</h2>

        <div className="ending-tamil">
          "நம் காதலுக்கு ஒரு தொடக்கம் உண்டு… முடிவில்லை."
        </div>

        <p className="ending-supporting">
          One coffee. Two strangers. One beautiful love story. One little Oreo. One family. A lifetime of dreams to build together.
        </p>

        <div className="ending-actions">
          <button className="btn-ending-replay" onClick={handleReplay}>
            <RotateCcw size={20} />
            <span>Replay From Beginning</span>
          </button>

          <button className="btn-ending-song" onClick={toggleSong}>
            <Music size={18} />
            <span>{isPlayingSong ? 'Pause Soundtrack' : 'Play Official Song'}</span>
          </button>

          <button className="btn-ending-explore" onClick={handleExploreAll}>
            <List size={18} />
            <span>Browse All 30 Chapters</span>
          </button>
        </div>
      </div>
    </section>
  );
};
