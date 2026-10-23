import React, { useEffect, useRef } from 'react';
import { useStreaming } from '../../context/StreamingContext';
import './ConfettiCanvas.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  isHeart: boolean;
  opacity: number;
}

export const ConfettiCanvas: React.FC = () => {
  const { confettiTrigger } = useStreaming();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (confettiTrigger === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#E50914', '#FF414D', '#F5A623', '#FFD166', '#FFFFFF', '#FF85A1'];
    const particles: Particle[] = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 80,
        size: Math.random() * 12 + 6,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 4 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 6,
        isHeart: Math.random() > 0.4,
        opacity: 1
      });
    }

    let animationId: number;
    let startTime = Date.now();
    const duration = 3800; // 3.8 seconds

    const render = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotSpeed;

        if (elapsed > duration - 1000) {
          p.opacity = Math.max(0, (duration - elapsed) / 1000);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.isHeart) {
          // Draw mini heart
          const s = p.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-s, -s, -s * 2, s / 3, 0, s * 1.8);
          ctx.bezierCurveTo(s * 2, s / 3, s, -s, 0, 0);
          ctx.fill();
        } else {
          // Confetti ribbon rectangle
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [confettiTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="celebration-confetti-canvas"
      aria-hidden="true"
    />
  );
};
