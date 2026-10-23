import React from 'react';
import { StreamingProvider, useStreaming } from './context/StreamingContext';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { TimeCapsule } from './components/TimeCapsule/TimeCapsule';
import { ContentRow } from './components/ContentRow/ContentRow';
import { ContentModal } from './components/ContentModal/ContentModal';
import { VideoPlayer } from './components/VideoPlayer/VideoPlayer';
import { CinemaMode } from './components/CinemaMode/CinemaMode';
import { JourneyMap } from './components/JourneyMap/JourneyMap';
import { SecretVault } from './components/SecretVault/SecretVault';
import { ConfettiCanvas } from './components/Confetti/ConfettiCanvas';
import { SearchResults } from './components/Search/SearchResults';
import { StoryTimeline } from './components/Timeline/StoryTimeline';
import { SoundtrackPlayer, PersistentMiniPlayer } from './components/Soundtrack/SoundtrackPlayer';
import { KarthikPromise } from './components/Promise/KarthikPromise';
import { EndingSection } from './components/Ending/EndingSection';
import { Footer } from './components/Footer/Footer';
import { Toast } from './components/Toast/Toast';
import { getLoveStoryRows } from './data/mockContent';
import './App.css';

const MainLayout: React.FC = () => {
  const { searchQuery, activeTab } = useStreaming();
  const rows = getLoveStoryRows();

  const isGridPage = searchQuery.trim() !== '' || activeTab !== 'home';

  return (
    <div className="cinestream-app">
      <Navbar />

      {isGridPage ? (
        <SearchResults />
      ) : (
        <>
          <Hero />

          {/* Live Love Time-Capsule & Live Infinity Counter */}
          <TimeCapsule />

          <main className="main-content-wrapper" aria-label="Our Love Story Catalogue">
            {rows.map(row => (
              <ContentRow
                key={row.id}
                id={row.id}
                title={row.title}
                tamilSubtitle={row.tamilSubtitle}
                subtitle={row.subtitle}
                items={row.items}
                variant={row.cardVariant}
                isTop10={row.isTop10}
              />
            ))}

            {/* Previously in Our Story — 9 Cinematic Milestones */}
            <StoryTimeline />

            {/* Dedicated Tamil Soundtrack Player Suite */}
            <SoundtrackPlayer />

            {/* Karthik's Emotional Promise */}
            <KarthikPromise />

            {/* The Ending That Never Ends */}
            <EndingSection />
          </main>
        </>
      )}

      <Footer />

      {/* Global Details Modal */}
      <ContentModal />

      {/* Global Video Player View */}
      <VideoPlayer />

      {/* Fullscreen Cinema Story Mode (Slideshow + Soundtrack) */}
      <CinemaMode />

      {/* Interactive Journey Map / Radar */}
      <JourneyMap />

      {/* Secret Vault / Karthik's Love Letter to Kasthuri */}
      <SecretVault />

      {/* Romantic Confetti Celebration Canvas */}
      <ConfettiCanvas />

      {/* Persistent Floating Mini Soundtrack Player */}
      <PersistentMiniPlayer />

      {/* Action Toast Notifications */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <StreamingProvider>
      <MainLayout />
    </StreamingProvider>
  );
}

export default App;
