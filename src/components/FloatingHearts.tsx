import { useMemo } from 'react';

interface HeartSpec {
  id: number;
  left: string;
  fontSize: string;
  duration: string;
  delay: string;
}

export function FloatingHearts() {
  const hearts = useMemo<HeartSpec[]>(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: `${((i * 6.3 + 3) % 96).toFixed(1)}%`,
      fontSize: `${15 + ((i * 7) % 24)}px`,
      duration: `${9 + ((i * 3.1) % 10)}s`,
      delay: `${-((i * 1.9) % 15)}s`,
    }));
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="animate-float-heart fixed -bottom-12 select-none text-[#f48fb8] opacity-55"
          style={{
            left: h.left,
            fontSize: h.fontSize,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
