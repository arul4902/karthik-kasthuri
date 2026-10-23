import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ContentCard } from '../ContentCard/ContentCard';
import { ContentItem } from '../../types/content';
import './ContentRow.css';

interface ContentRowProps {
  id: string;
  title: string;
  tamilSubtitle?: string;
  subtitle?: string;
  items: ContentItem[];
  variant?: 'landscape' | 'portrait';
  isTop10?: boolean;
}

export const ContentRow: React.FC<ContentRowProps> = ({
  id,
  title,
  tamilSubtitle,
  subtitle,
  items,
  variant = 'landscape',
  isTop10 = false
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const { clientWidth } = trackRef.current;
      const scrollOffset = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      trackRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="content-row" id={`row-${id}`} aria-label={title}>
      <div className="row-header">
        <div className="row-title-group">
          <div>
            <h2 className="row-title">{title}</h2>
            {tamilSubtitle && <div className="row-tamil-subtitle">{tamilSubtitle}</div>}
          </div>
          {subtitle && <span className="row-subtitle">{subtitle}</span>}
        </div>
      </div>

      <div className="slider-container">
        {canScrollLeft && (
          <button
            className="slider-arrow left"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        <div
          className="slider-track"
          ref={trackRef}
          onScroll={checkScroll}
        >
          {items.map((item, index) => (
            <ContentCard
              key={`${id}-${item.id}`}
              item={item}
              variant={variant}
              isTop10={isTop10}
              rank={isTop10 ? index + 1 : undefined}
            />
          ))}
        </div>

        {canScrollRight && (
          <button
            className="slider-arrow right"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>
    </section>
  );
};
