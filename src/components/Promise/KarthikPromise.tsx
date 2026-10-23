import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import './KarthikPromise.css';

export const KarthikPromise: React.FC = () => {
  const { showToast } = useStreaming();
  const [lang, setLang] = useState<'tamil' | 'english'>('tamil');
  const [sealed, setSealed] = useState(false);

  const handleSeal = () => {
    setSealed(true);
    showToast('Hand Held Forever: Your promise is sealed in eternity ❤️');
  };

  return (
    <section className="promise-section" id="karthik-promise-feature" aria-label="Karthik's Promise">
      <div className="promise-backdrop-blur" />

      <div className="promise-card">
        <div className="promise-badge">
          <Heart size={16} fill="currentColor" />
          <span>INSCRIBED IN THE HEART</span>
        </div>

        <h2 className="promise-heading">FOR YOU, IN EVERY CHAPTER.</h2>
        <div className="promise-tamil-sub">உனக்காக, ஒவ்வொரு அத்தியாயத்திலும்...</div>

        <div className="promise-language-toggle">
          <button
            className={`lang-btn ${lang === 'tamil' ? 'active' : ''}`}
            onClick={() => setLang('tamil')}
          >
            தமிழ் வரிகள் (Original)
          </button>
          <button
            className={`lang-btn ${lang === 'english' ? 'active' : ''}`}
            onClick={() => setLang('english')}
          >
            English Translation
          </button>
        </div>

        <div className="poem-box">
          {lang === 'tamil' ? (
            <>
              <div className="poem-salutation">கஸ்தூரி…</div>

              <div className="poem-stanza">
                உன் கனவுகளுக்கு துணையாய் இருப்பேன்.<br />
                உன் சோர்வில் உன் பலமாய் இருப்பேன்.<br />
                உன் கண்ணீரில் உன் தோளாய் இருப்பேன்.<br />
                உன் வெற்றியில் உன் மகிழ்ச்சியாய் இருப்பேன்.
              </div>

              <div className="poem-stanza highlight">
                வாழ்க்கை எத்தனை முறை சோதித்தாலும்,<br />
                உன் கையை விடாமல் நடப்பேன்.
              </div>

              <div className="poem-stanza">
                எத்தனை வெற்றிகள் வந்தாலும்,<br />
                நம் முதல் காபியை மறக்க மாட்டேன்.
              </div>

              <div className="poem-stanza highlight">
                நம் காதலுக்கு ஒரு தொடக்கம் இருக்கலாம்…<br />
                ஆனால் முடிவுரை வேண்டாம்.
              </div>

              <div className="poem-signoff">
                <span>என்றென்றும் உன் கார்த்திக்.</span>
                <Heart size={20} fill="#E50914" color="#E50914" />
              </div>
            </>
          ) : (
            <>
              <div className="poem-salutation">Kasthuri…</div>

              <div className="poem-stanza">
                I will stand by your dreams.<br />
                I will be your strength in weariness.<br />
                I will be your shoulder in tears.<br />
                I will be your celebration in victory.
              </div>

              <div className="poem-stanza highlight">
                No matter how many times life tests us,<br />
                I will walk holding your hand without letting go.
              </div>

              <div className="poem-stanza">
                No matter how many successes come our way,<br />
                I will never forget our first coffee.
              </div>

              <div className="poem-stanza highlight">
                Our love may have had a beginning…<br />
                but it shall never have an ending.
              </div>

              <div className="poem-signoff">
                <span>Forever Yours, Karthik.</span>
                <Heart size={20} fill="#E50914" color="#E50914" />
              </div>
            </>
          )}
        </div>

        <button className="btn-seal-promise" onClick={handleSeal}>
          <Heart size={20} fill="#fff" />
          <span>{sealed ? 'Hand Held Forever ❤️' : 'Seal This Promise Together'}</span>
        </button>
      </div>
    </section>
  );
};
