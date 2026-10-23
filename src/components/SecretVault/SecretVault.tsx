import React, { useState } from 'react';
import {
  X,
  Heart,
  Unlock,
  Music,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { ASSETS } from '../../data/mockContent';
import './SecretVault.css';

export const SecretVault: React.FC = () => {
  const {
    isSecretVaultOpen,
    closeSecretVault,
    playSong,
    triggerConfetti
  } = useStreaming();

  const [isSealed, setIsSealed] = useState(true);
  const [hasDedicated, setHasDedicated] = useState(false);

  if (!isSecretVaultOpen) return null;

  const handleBreakSeal = () => {
    setIsSealed(false);
    playSong(); // Starts the couple's song softly
    triggerConfetti();
  };

  const handleDedicateForever = () => {
    setHasDedicated(true);
    triggerConfetti();
  };

  return (
    <div className="secret-vault-overlay" role="dialog" aria-modal="true" aria-label="Karthik's Private Note to Kasthuri">
      <div className="secret-vault-card">
        <button
          className="vault-close-btn"
          onClick={closeSecretVault}
          aria-label="Close Note"
        >
          <X size={20} />
        </button>

        {isSealed ? (
          /* Sealed State: Cinematic Wax Envelope */
          <div className="vault-sealed-view">
            <div className="vault-confidential-stamp">TOP SECRET • PRIVATE MEMORY ARCHIVE</div>
            <div className="vault-title-sealed">FOR KASTHURI'S EYES ONLY</div>
            <div className="vault-tamil-sealed">கஸ்தூரிக்காக கார்த்திக் எழுதிய அந்தரங்கக் கடிதம்</div>

            <p className="vault-teaser">
              Behind this seal lies the unedited, deeply personal promise written by Karthik for Kasthuri — from that first Adyar coffee to every storm and joy of the future.
            </p>

            <div className="wax-seal-container" onClick={handleBreakSeal}>
              <div className="wax-seal-ring">
                <div className="wax-seal-stamp">
                  <span className="wax-monogram">K&K</span>
                  <span className="wax-year">2023–∞</span>
                </div>
              </div>
              <span className="wax-prompt">Tap to Break Wax Seal</span>
            </div>

            <button className="btn-break-seal" onClick={handleBreakSeal}>
              <Unlock size={18} />
              <span>Break Seal & Read Letter</span>
            </button>
          </div>
        ) : (
          /* Unsealed State: Intimate Love Letter */
          <div className="vault-letter-view">
            <div className="letter-header">
              <div className="letter-meta-badge">
                <Heart size={14} fill="#E50914" color="#E50914" />
                <span>UNLOCKED: KARTHIK'S LETTER</span>
              </div>
              <div className="letter-date">Written with Love • Adyar to Forever</div>
            </div>

            <div className="letter-layout">
              <div className="letter-portrait-wrap">
                <img
                  src={ASSETS.TRADITIONAL_SAREE}
                  alt="Kasthuri"
                  className="letter-portrait"
                />
                <div className="portrait-caption">"என் இதயத்தின் ராணி — கஸ்தூரி"</div>
              </div>

              <div className="letter-body-scroll">
                <h3 className="letter-salutation">என் அன்புக் கஸ்தூரி,</h3>

                <p className="letter-paragraph tamil">
                  அன்று அடையாறு கஃபே காபி டே வாசலில் உன்னை முதல்முறை பார்த்தபோது, எனக்குத் தெரியாது என் ஆயுள் முழுக்க சிரிக்க வைக்கப் போகும் தேவதை நீதான் என்று.
                </p>

                <p className="letter-paragraph">
                  அந்த முதல் காபி கசப்பாக இருந்தது என்று நீ சொன்னதும், உன்னைப் பார்த்து சிரித்த தருணத்தில் என் வாழ்க்கையின் மிக அழகான அத்தியாயம் தொடங்கியது.
                </p>

                <p className="letter-paragraph tamil">
                  வாழ்க்கையில் வணிக சவால்கள் வந்தபோதும், கண்ணீர் துளிகள் விழுந்தபோதும், ஒரு நொடி கூட என் கையை நீ விட்டதில்லை. உன் இந்த அன்பும் நம்பிக்கையும்தான் என்னை ஒவ்வொரு நாளும் ஒரு சிறந்த மனிதனாக மாற்றுகிறது.
                </p>

                <p className="letter-paragraph">
                  நம் வீட்டு ஹாலில் ஓரியோ வாலை ஆட்டிக் கொண்டு ஓடுவதும், மாலையில் நாம் ஒன்றாக சேர்ந்து டீ குடிப்பதும்... இந்த எளிய தருணங்கள்தான் எனக்கு உலகத்திலேயே மிகப்பெரிய செல்வம்.
                </p>

                <p className="letter-paragraph highlight">
                  "நம் காதலுக்கு ஒரு தொடக்கம் இருக்கலாம்... ஆனால் முடிவுரை என்றைக்கும் வேண்டாம்."
                </p>

                <div className="letter-signoff">
                  <div>என்றென்றும் உன் அன்புக் கணவன்,</div>
                  <div className="letter-signature">கார்த்திக் ❤️</div>
                </div>
              </div>
            </div>

            <footer className="letter-footer">
              <div className="letter-soundtrack-note">
                <Music size={16} className="music-icon" />
                <span>Soundtrack: ஒரு காபியில் தொடங்கிய காதல்</span>
              </div>

              <button
                className={`btn-dedicate-forever ${hasDedicated ? 'done' : ''}`}
                onClick={handleDedicateForever}
              >
                {hasDedicated ? <CheckCircle2 size={18} /> : <Bookmark size={18} />}
                <span>{hasDedicated ? 'Sealed in Our Hearts Forever ❤️' : 'Seal Forever in Heart'}</span>
              </button>
            </footer>
          </div>
        )}
      </div>
    </div>
  );
};
