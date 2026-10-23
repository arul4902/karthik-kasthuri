import React, { useState } from 'react';
import {
  X,
  MapPin,
  Compass,
  Heart,
  Play,
  Music,
  Navigation
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ASSETS } from '../../data/mockContent';
import './JourneyMap.css';

interface JourneySpot {
  id: string;
  number: number;
  name: string;
  tamilName: string;
  coords: string;
  date: string;
  category: string;
  image: string;
  quote: string;
  description: string;
  targetEpisodeId: string;
  xPercent: number; // Position on custom stylized map radar
  yPercent: number;
}

const JOURNEY_SPOTS: JourneySpot[] = [
  {
    id: 'spot-1-adyar',
    number: 1,
    name: 'Café Coffee Day, Adyar',
    tamilName: 'அடையாறு கஃபே காபி டே',
    coords: '13.0067° N, 80.2570° E',
    date: 'December 2023',
    category: 'The Spark',
    image: ASSETS.CAFE_COFFEE_DATE,
    quote: '"You said the coffee was bitter, so I smiled and made it sweet."',
    description: 'The exact table where two strangers sat facing each other for an informal meeting that stretched into unforgettable hours of laughter.',
    targetEpisodeId: 'ep-01-one-december-coffee',
    xPercent: 24,
    yPercent: 46
  },
  {
    id: 'spot-2-besant-nagar',
    number: 2,
    name: 'Besant Nagar Promenade & Tree',
    tamilName: 'பெசன்ட் நகர் கடற்கரை மரம்',
    coords: '12.9995° N, 80.2707° E',
    date: 'Early 2024',
    category: 'The Bond',
    image: ASSETS.BENCH_GARDEN,
    quote: '"Under the canopy of trees, words felt unnecessary."',
    description: 'Looking up through the branches, talking about childhood, fears, and dreams under Chennai skies.',
    targetEpisodeId: 'ep-07-besant-nagar-tree',
    xPercent: 36,
    yPercent: 54
  },
  {
    id: 'spot-3-ecr',
    number: 3,
    name: 'East Coast Road (ECR) Coastal Highway',
    tamilName: 'கிழக்குக் கடற்கரை சாலை',
    coords: '12.8718° N, 80.2427° E',
    date: '2024',
    category: 'Freedom & Joy',
    image: ASSETS.HERO_FIELD_RUN,
    quote: '"Running through golden fields with the coastal breeze in our hair."',
    description: 'Late night rides, ocean waves roaring in the dark, and running carefree in the open golden countryside.',
    targetEpisodeId: 'ep-12-golden-hour-run',
    xPercent: 48,
    yPercent: 72
  },
  {
    id: 'spot-4-waterfall',
    number: 4,
    name: 'Western Ghats Waterfall Haven',
    tamilName: 'மேற்குத் தொடர்ச்சி மலை அருவி',
    coords: '11.4102° N, 76.6950° E',
    date: 'Monsoon 2024',
    category: 'Romance in Mist',
    image: ASSETS.WATERFALL_ROMANCE,
    quote: '"Standing together against the roaring cascade, drenched in happiness."',
    description: 'A getaway into lush mist and cold mountain streams where Karthik pulled Kasthuri close for that unforgettable romantic embrace.',
    targetEpisodeId: 'ep-14-mountain-waterfall',
    xPercent: 18,
    yPercent: 82
  },
  {
    id: 'spot-5-mandapam',
    number: 5,
    name: 'The Sacred Wedding Mandapam',
    tamilName: 'திருமண மண்டபம் • புனித பந்தம்',
    coords: '13.0418° N, 80.2341° E',
    date: 'The Big Day 2024',
    category: 'Sacred Forever',
    image: ASSETS.TRADITIONAL_SAREE,
    quote: '"A thousands prayers answered in one sacred knot."',
    description: 'Surrounded by jasmine, auspicious nadaswaram melodies, family blessings, and Kasthuri looking ethereal in traditional silk.',
    targetEpisodeId: 'ep-15-became-husband-wife',
    xPercent: 62,
    yPercent: 38
  },
  {
    id: 'spot-6-home-oreo',
    number: 6,
    name: 'Our Cozy First Home with Oreo 🐾',
    tamilName: 'நமது இல்லம் • குட்டி ஓரியோ',
    coords: '12.9815° N, 80.2180° E',
    date: 'Forever & Always',
    category: 'Family & Laughter',
    image: ASSETS.OREO_CAR,
    quote: '"Every night coming home to Kasthuri and Oreo is our real award."',
    description: 'Puppy zoomies in the living room, weekend road trips in the car with Oreo sticking his head out the window, and making chai together.',
    targetEpisodeId: 'ep-18-our-little-oreo',
    xPercent: 78,
    yPercent: 52
  }
];

export const JourneyMap: React.FC = () => {
  const {
    isJourneyMapOpen,
    closeJourneyMap,
    allEpisodes,
    openDetailsModal,
    startPlaying,
    playSong,
    isPlayingSong
  } = useStreaming();

  const [selectedSpot, setSelectedSpot] = useState<JourneySpot>(JOURNEY_SPOTS[0]);

  if (!isJourneyMapOpen) return null;

  const handleWatchSpot = () => {
    const episode = allEpisodes.find(ep => ep.id === selectedSpot.targetEpisodeId);
    if (episode) {
      closeJourneyMap();
      openDetailsModal(episode);
    }
  };

  const handlePlayVideo = () => {
    const episode = allEpisodes.find(ep => ep.id === selectedSpot.targetEpisodeId);
    if (episode) {
      closeJourneyMap();
      startPlaying(episode);
    }
  };

  return (
    <div className="journey-map-overlay" role="dialog" aria-modal="true" aria-label="Our Journey Map">
      <div className="journey-map-modal">
        {/* Close Button */}
        <button
          className="journey-map-close"
          onClick={closeJourneyMap}
          aria-label="Close Journey Map"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <header className="journey-map-header">
          <div className="map-badge-tag">
            <Compass size={16} className="compass-icon" />
            <span>INTERACTIVE CHENNAI & BEYOND RADAR</span>
          </div>
          <h2 className="map-title">OUR JOURNEY MAP</h2>
          <div className="map-tamil-title">நமது காதல் வரைபடம் — காபியில் இருந்து என்றென்றும் வரை</div>
          <p className="map-subtitle">
            From that single coffee cup in Adyar to mountain waterfalls, wedding vows, and our puppy Oreo's car rides — trace the exact coordinates where our love story was written.
          </p>
        </header>

        {/* Interactive Layout: Radar Map on Left/Top, Memory Card on Right/Bottom */}
        <div className="journey-map-grid">
          {/* Stylized Visual Radar Board */}
          <div className="radar-canvas-container">
            <div className="radar-grid-lines" />
            <div className="radar-sweep-beam" />
            <div className="radar-compass-center">
              <Navigation size={24} className="radar-needle" />
              <span>CHENNAI HQ</span>
            </div>

            {/* Glowing Journey Path SVG Line */}
            <svg className="radar-route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 24 46 Q 30 50, 36 54 T 48 72 T 18 82 T 62 38 T 78 52"
                fill="none"
                stroke="rgba(229, 9, 20, 0.45)"
                strokeWidth="0.8"
                strokeDasharray="2, 2"
              />
            </svg>

            {/* Interactive Location Pins */}
            {JOURNEY_SPOTS.map(spot => {
              const isSelected = spot.id === selectedSpot.id;
              return (
                <button
                  key={spot.id}
                  className={`radar-pin-btn ${isSelected ? 'active' : ''}`}
                  style={{ left: `${spot.xPercent}%`, top: `${spot.yPercent}%` }}
                  onClick={() => setSelectedSpot(spot)}
                  aria-label={spot.name}
                >
                  <div className="pin-pulse" />
                  <div className="pin-inner">
                    <MapPin size={14} />
                    <span className="pin-num">{spot.number}</span>
                  </div>
                  <div className="pin-tooltip">{spot.name}</div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Spot Spotlight Card */}
          <div className="journey-spotlight-card">
            <div className="spotlight-image-container">
              <img
                src={selectedSpot.image}
                alt={selectedSpot.name}
                className="spotlight-img"
              />
              <div className="spotlight-category-chip">{selectedSpot.category}</div>
              <div className="spotlight-step-tag">STOP #{selectedSpot.number}</div>
            </div>

            <div className="spotlight-body">
              <div className="spotlight-meta-row">
                <span className="spotlight-coords">{selectedSpot.coords}</span>
                <span className="spotlight-date">{selectedSpot.date}</span>
              </div>

              <h3 className="spotlight-name">{selectedSpot.name}</h3>
              <div className="spotlight-tamil-name">{selectedSpot.tamilName}</div>

              <blockquote className="spotlight-quote">
                {selectedSpot.quote}
              </blockquote>

              <p className="spotlight-description">
                {selectedSpot.description}
              </p>

              <div className="spotlight-actions">
                <button
                  className="spotlight-btn-watch"
                  onClick={handlePlayVideo}
                >
                  <Play size={18} fill="#000" />
                  <span>Play Chapter Video</span>
                </button>

                <button
                  className="spotlight-btn-explore"
                  onClick={handleWatchSpot}
                >
                  <Heart size={16} />
                  <span>Story Details</span>
                </button>

                <button
                  className="spotlight-btn-song"
                  onClick={playSong}
                  title="Play Soundtrack for this moment"
                >
                  <Music size={16} />
                  <span>{isPlayingSong ? 'Song Playing 🎵' : 'Play Song'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Location Pills at Bottom */}
        <div className="journey-pills-row">
          {JOURNEY_SPOTS.map(spot => (
            <button
              key={spot.id}
              className={`journey-pill ${spot.id === selectedSpot.id ? 'active' : ''}`}
              onClick={() => setSelectedSpot(spot)}
            >
              <span className="pill-dot" />
              <span className="pill-title">#{spot.number} {spot.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
