import { useEffect, useRef } from 'react';

const PETAL_COUNT = 20;

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function FallingFlowers() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const petals: HTMLDivElement[] = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('div');
      const size = randomBetween(12, 24);
      const left = randomBetween(0, 100);
      const duration = randomBetween(8, 18);
      const delay = randomBetween(0, 10);
      const opacity = randomBetween(0.15, 0.35);
      const rotation = randomBetween(0, 360);

      petal.style.cssText = `
        position: absolute;
        top: -${size}px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        opacity: ${opacity};
        transform: rotate(${rotation}deg);
        animation: flower-fall ${duration}s linear ${delay}s infinite;
        pointer-events: none;
        z-index: 0;
      `;

      petal.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" style="color: #C79031; width:100%; height:100%;"><path d="M12 2C12 2 10 8 6 10C10 10 12 16 12 16C12 16 14 10 18 10C14 8 12 2 12 2Z"/></svg>`;
      container.appendChild(petal);
      petals.push(petal);
    }

    return () => {
      petals.forEach((p) => p.remove());
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes flower-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--petal-opacity, 0.3);
          }
          90% {
            opacity: var(--petal-opacity, 0.3);
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0" />
    </>
  );
}