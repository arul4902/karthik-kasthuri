import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import './Footer.css';

export const Footer: React.FC = () => {
  const { setActiveTab } = useStreaming();
  const [serviceCode, setServiceCode] = useState<string | null>(null);

  const handleServiceCode = () => {
    if (!serviceCode) {
      setServiceCode('K&K-DEC2023-FOREVER-∞');
    } else {
      setServiceCode(null);
    }
  };

  const loveStoryLinks = [
    { title: 'The December Coffee (Adyar)', tab: 'chapters' as const },
    { title: 'The Unspoken Handhold', tab: 'chapters' as const },
    { title: 'Our Midnight Bike Rides', tab: 'chapters' as const },
    { title: 'The Sacred Wedding Day', tab: 'chapters' as const },
    { title: 'Our Little Baby Oreo 🐾', tab: 'chapters' as const },
    { title: 'Tamil Soundtrack 🎵', tab: 'soundtrack' as const },
    { title: 'Karthik\'s Eternal Promise', tab: 'promise' as const },
    { title: 'Previously In Our Story Timeline', tab: 'milestones' as const },
    { title: 'Kasthuri\'s Delicious Recipes', tab: 'chapters' as const },
    { title: 'Building Our Empire Together', tab: 'chapters' as const },
    { title: 'My Saved Favorites ❤️', tab: 'my-list' as const },
    { title: 'This Story Has No End Card', tab: 'home' as const }
  ];

  return (
    <footer className="footer-container" role="contentinfo">
      <div className="footer-top-query">
        <Heart size={16} fill="#E50914" color="#E50914" style={{ display: 'inline', marginRight: 8 }} />
        <span>"ஒரு காபியில் தொடங்கிய காதல்… முடிவில்லா வாழ்க்கைப் பயணம்."</span>
      </div>

      <ul className="footer-links-grid">
        {loveStoryLinks.map((link, idx) => (
          <li key={idx} className="footer-link-item">
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                setActiveTab(link.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>

      <button className="service-code-btn" onClick={handleServiceCode}>
        {serviceCode ? `Eternal Code: ${serviceCode}` : 'Memory Service Code'}
      </button>

      <div className="footer-copyright">
        © 2026 Karthik & Kasthuri. Dedicated to our eternal love, marriage, little Oreo, and the life we continue to build together.
      </div>
    </footer>
  );
};
