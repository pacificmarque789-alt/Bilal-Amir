import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  a: number;
  va: number;
}

interface ConfettiContextValue {
  burst: (x?: number, y?: number, count?: number) => void;
  firework: (x: number, y: number, color?: string) => void;
}

const ConfettiContext = createContext<ConfettiContextValue | null>(null);

const CONFETTI_COLORS = ['#f0508a', '#ffd166', '#a78bfa', '#6fcf97', '#ffffff', '#ff9ec4'];

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const runningRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      runningRef.current = false;
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      runningRef.current = false;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const nextParticles: Particle[] = [];
    for (const p of particlesRef.current) {
      p.vy += 0.26;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.a += p.va;

      if (p.y < canvas.height + 24) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
        ctx.restore();
        nextParticles.push(p);
      }
    }

    particlesRef.current = nextParticles;

    if (nextParticles.length > 0) {
      rafRef.current = window.requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const ensureRunning = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = window.requestAnimationFrame(loop);
    }
  }, [loop]);

  const burst = useCallback(
    (x?: number, y?: number, count = 90) => {
      const cx = x ?? window.innerWidth / 2;
      const cy = y ?? window.innerHeight * 0.48;
      for (let k = 0; k < count; k += 1) {
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 13,
          vy: -Math.random() * 13 - 3,
          r: Math.random() * 6 + 3,
          c: CONFETTI_COLORS[k % CONFETTI_COLORS.length],
          a: Math.random() * Math.PI * 2,
          va: (Math.random() - 0.5) * 0.3,
        });
      }
      ensureRunning();
    },
    [ensureRunning],
  );

  const firework = useCallback(
    (x: number, y: number, color?: string) => {
      const col = color ?? CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      for (let j = 0; j < 70; j += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 7;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 4.5,
          c: col,
          a: angle,
          va: 0.1,
        });
      }
      ensureRunning();
    },
    [ensureRunning],
  );

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <ConfettiContext.Provider value={{ burst, firework }}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      />
      {children}
    </ConfettiContext.Provider>
  );
}

export function useConfetti(): ConfettiContextValue {
  const ctx = useContext(ConfettiContext);
  if (!ctx) {
    throw new Error('useConfetti must be used inside ConfettiProvider');
  }
  return ctx;
}
