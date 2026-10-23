import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useStreaming } from '../../context/StreamingContext';
import { MilestoneItem } from '../../types/content';
import './StoryTimeline.css';

export const StoryTimeline: React.FC = () => {
  const { milestones, allEpisodes, openDetailsModal } = useStreaming();

  const handleMilestoneClick = (milestone: MilestoneItem) => {
    const episode = allEpisodes.find(ep => ep.id === milestone.targetEpisodeId);
    if (episode) {
      openDetailsModal(episode);
    }
  };

  return (
    <section className="timeline-section" id="story-milestones" aria-label="Previously in Our Story">
      <div className="timeline-header">
        <div className="timeline-tag">A CINEMATIC TIMELINE</div>
        <h2 className="timeline-title">PREVIOUSLY IN OUR STORY</h2>
        <p className="timeline-subtitle">
          The 9 sacred milestones that turned two strangers over a December coffee in Adyar into husband, wife, and a lifetime of unshakeable togetherness.
        </p>
      </div>

      <div className="timeline-track-container">
        <div className="timeline-center-line" />

        {milestones.map((m, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={m.id}
              className={`timeline-item ${isEven ? 'left' : 'right'}`}
            >
              <div className="timeline-node">{m.stepNumber}</div>

              <div
                className="milestone-card"
                onClick={() => handleMilestoneClick(m)}
                role="button"
                tabIndex={0}
                aria-label={`Milestone: ${m.title}`}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleMilestoneClick(m);
                }}
              >
                <div className="milestone-image-box">
                  <img src={m.image} alt={m.title} className="milestone-img" loading="lazy" />
                  <span className="milestone-date-badge">{m.date}</span>
                </div>

                <div className="milestone-content">
                  <div className="milestone-location">
                    <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {m.location}
                  </div>
                  <h3 className="milestone-title">{m.title}</h3>
                  <div className="milestone-tamil-title">{m.tamilTitle}</div>
                  <p className="milestone-desc">{m.description}</p>
                  {m.quote && <div className="milestone-quote">"{m.quote}"</div>}

                  <button className="milestone-action-btn">
                    <span>Watch Chapter Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
