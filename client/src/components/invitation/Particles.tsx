import { useEffect, useRef } from 'react';

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  speed: number;
  drift: number;
  size: number;
}

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const maxParticles = 15;
    const particles: Particle[] = [];

    for (let i = 0; i < maxParticles; i++) {
      const el = document.createElement('div');
      const size = 2 + Math.random() * 4;
      const x = Math.random() * 100;
      const y = -10 + Math.random() * 100;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      el.style.background = `rgba(29, 185, 84, ${0.06 + Math.random() * 0.08})`;
      el.style.position = 'fixed';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '0';
      el.style.left = '0';
      el.style.top = '0';
      el.style.transform = `translate(${x}vw, ${y}vh)`;
      container.appendChild(el);

      particles.push({
        el,
        x,
        y,
        speed: 0.2 + Math.random() * 0.4,
        drift: -0.3 + Math.random() * 0.6,
        size,
      });
    }

    particlesRef.current = particles;

    const animate = () => {
      for (const p of particlesRef.current) {
        p.y += p.speed;
        p.x += p.drift * 0.15;

        if (p.y > 105) {
          p.y = -5;
          p.x = Math.random() * 100;
        }
        if (p.x > 105) p.x = -5;
        if (p.x < -5) p.x = 105;

        p.el.style.transform = `translate(${p.x}vw, ${p.y}vh)`;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      for (const p of particlesRef.current) {
        p.el.remove();
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
}