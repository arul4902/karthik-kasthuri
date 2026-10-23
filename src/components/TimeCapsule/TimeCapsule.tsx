import React, { useState, useEffect } from 'react';
import {
  Heart,
  Clock,
  Sparkles,
  MapPin,
  Lock,
  Smile
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import './TimeCapsule.css';

interface TimeCounter {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const TimeCapsule: React.FC = () => {
  const {
    openJourneyMap,
    openSecretVault,
    triggerConfetti
  } = useStreaming();

  // Reference dates
  // First Coffee: December 15, 2023, 6:30 PM IST
  const coffeeDate = new Date('2023-12-15T18:30:00+05:30').getTime();
  // Wedding Date: March 24, 2024
  const weddingDate = new Date('2024-03-24T09:00:00+05:30').getTime();

  const [coffeeTime, setCoffeeTime] = useState<TimeCounter>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [weddingDays, setWeddingDays] = useState(0);

  // Live timer tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();

      // Coffee counter
      const diffCoffee = Math.max(0, now - coffeeDate);
      const days = Math.floor(diffCoffee / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffCoffee % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffCoffee % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffCoffee % (1000 * 60)) / 1000);
      setCoffeeTime({ days, hours, minutes, seconds });

      // Wedding counter
      const diffWed = Math.max(0, now - weddingDate);
      setWeddingDays(Math.floor(diffWed / (1000 * 60 * 60 * 24)));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="time-capsule-section" aria-label="Love Time Capsule & Live Counters">
      <div className="time-capsule-card">
        {/* Header Bar */}
        <div className="capsule-header-bar">
          <div className="capsule-live-tag">
            <span className="live-pulse-dot" />
            <span className="live-tag-text">LIVE LOVE TIME-CAPSULE</span>
            <span className="infinity-badge">∞ & BEYOND</span>
          </div>
          <div className="capsule-subtitle-text">
            <span>KARTHIK & KASTHURI • SINCE DECEMBER 2023</span>
          </div>
        </div>

        {/* 3 Live Stat Cards */}
        <div className="capsule-stats-grid">
          {/* Card 1: Since First Coffee */}
          <div className="stat-card coffee">
            <div className="stat-icon-wrap red">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                <span className="num">{coffeeTime.days}</span>
                <span className="unit">d</span>
                <span className="num">{coffeeTime.hours}</span>
                <span className="unit">h</span>
                <span className="num">{coffeeTime.minutes}</span>
                <span className="unit">m</span>
                <span className="num tick">{coffeeTime.seconds}</span>
                <span className="unit">s</span>
              </div>
              <div className="stat-label">Since That Adyar Coffee (Dec 2023)</div>
              <div className="stat-tamil">முதல் காபியில் மலர்ந்த நாட்கள்</div>
            </div>
          </div>

          {/* Card 2: Days as Husband & Wife */}
          <div className="stat-card wedding">
            <div className="stat-icon-wrap gold">
              <Heart size={20} fill="#F5A623" />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                <span className="num">{weddingDays}</span>
                <span className="unit">Days</span>
              </div>
              <div className="stat-label">As Husband & Wife</div>
              <div className="stat-tamil">இல்லறப் பயணம்</div>
            </div>
          </div>

          {/* Card 3: Oreo */}
          <div className="stat-card oreo">
            <div className="stat-icon-wrap green">
              <Smile size={20} />
            </div>
            <div className="stat-content">
              <div className="stat-value">
                <span className="num">100%</span>
                <span className="unit">Joy</span>
              </div>
              <div className="stat-label">With Oreo 🐾 Our Furry Kid</div>
              <div className="stat-tamil">வாலின் அசைவில் மகிழ்ச்சி</div>
            </div>
          </div>
        </div>

        {/* Feature Actions Strip */}
        <div className="capsule-actions-strip">
          <div className="strip-label">INTERACTIVE STORY EXPERIENCES:</div>
          <div className="strip-buttons-group">
            <button
              className="strip-btn map"
              onClick={openJourneyMap}
              title="Explore memory locations on Chennai map"
            >
              <MapPin size={16} />
              <span>🗺️ Interactive Journey Map</span>
            </button>

            <button
              className="strip-btn vault"
              onClick={openSecretVault}
              title="A private note for Kasthuri's eyes only"
            >
              <Lock size={16} />
              <span>💌 Secret Note for Kasthuri</span>
            </button>

            <button
              className="strip-btn celebrate"
              onClick={triggerConfetti}
              title="Shower romantic confetti"
            >
              <Sparkles size={16} />
              <span>💖 Celebrate Our Love</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
