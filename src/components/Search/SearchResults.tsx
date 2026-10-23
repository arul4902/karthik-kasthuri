import React from 'react';
import { SearchX, Heart, BookOpen } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ContentCard } from '../ContentCard/ContentCard';
import { StoryTimeline } from '../Timeline/StoryTimeline';
import { SoundtrackPlayer } from '../Soundtrack/SoundtrackPlayer';
import { KarthikPromise } from '../Promise/KarthikPromise';
import './SearchResults.css';

export const SearchResults: React.FC = () => {
  const {
    searchQuery,
    searchResults,
    activeTab,
    setActiveTab,
    setSearchQuery,
    myList,
    allEpisodes
  } = useStreaming();

  // If specific section tab is active without active text search:
  if (searchQuery.trim() === '') {
    if (activeTab === 'milestones') {
      return (
        <main className="results-container">
          <StoryTimeline />
        </main>
      );
    }

    if (activeTab === 'soundtrack') {
      return (
        <main className="results-container">
          <SoundtrackPlayer />
        </main>
      );
    }

    if (activeTab === 'promise') {
      return (
        <main className="results-container">
          <KarthikPromise />
        </main>
      );
    }
  }

  let title = '';
  let subtitle = '';
  let items = searchResults;

  if (searchQuery.trim() !== '') {
    title = `Memories Matching "${searchQuery}"`;
    subtitle = `Found ${searchResults.length} moments in our story`;
    items = searchResults;
  } else if (activeTab === 'chapters') {
    title = 'All 30 Chapters: From One Coffee to Forever';
    subtitle = 'Every conversation, handhold, journey, and promise in chronological order';
    items = allEpisodes;
  } else if (activeTab === 'my-list') {
    title = 'My Favorites — Cherished Moments';
    subtitle = 'Your personally saved memories, milestones, and vows';
    items = allEpisodes.filter(t => myList.includes(t.id));
  }

  const isSearch = searchQuery.trim() !== '';

  return (
    <main className="results-container" aria-label={title}>
      <div className="results-header">
        <div>
          <h1 className="results-title">{title}</h1>
          {subtitle && <p style={{ fontSize: '0.95rem', color: '#aaa', marginTop: 4 }}>{subtitle}</p>}
        </div>
        <span className="results-count">
          {items.length} {items.length === 1 ? 'memory' : 'memories'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="results-empty-state">
          {isSearch ? (
            <>
              <SearchX size={54} className="empty-state-icon" />
              <div className="empty-state-title">No matching memories found</div>
              <p className="empty-state-desc">
                We couldn't find any moments matching "{searchQuery}". Try searching for
                "Coffee", "Adyar", "Oreo", "Wedding", "Promise", or "Bike".
              </p>
              <button
                className="btn-empty-action"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            </>
          ) : activeTab === 'my-list' ? (
            <>
              <Heart size={54} className="empty-state-icon" fill="rgba(229, 9, 20, 0.3)" color="#E50914" />
              <div className="empty-state-title">No favorite moments saved yet</div>
              <p className="empty-state-desc">
                Browse through our 30 chapters and click the + or Heart button on any card
                to save your most cherished memories right here.
              </p>
              <button
                className="btn-empty-action"
                onClick={() => setActiveTab('home')}
              >
                Explore Our Chapters
              </button>
            </>
          ) : (
            <>
              <BookOpen size={54} className="empty-state-icon" />
              <div className="empty-state-title">No chapters available in this view</div>
              <button
                className="btn-empty-action"
                onClick={() => setActiveTab('home')}
              >
                Back to Our Story
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="results-grid">
          {items.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              variant="landscape"
            />
          ))}
        </div>
      )}
    </main>
  );
};
