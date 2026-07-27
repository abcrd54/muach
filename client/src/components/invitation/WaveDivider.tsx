export default function WaveDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative h-12 overflow-hidden">
      <svg
        className={`absolute w-full h-20 ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C240,0 480,100 720,50 C960,0 1200,100 1440,50 L1440,100 L0,100 Z"
          fill={flip ? '#121212' : '#181818'}
          opacity={flip ? 0.5 : 0.3}
        />
      </svg>
    </div>
  );
}