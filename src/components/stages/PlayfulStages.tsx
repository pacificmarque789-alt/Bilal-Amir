import { useEffect, useRef, useState } from 'react';
import { useConfetti } from '../ConfettiCanvas';

interface StageProps {
  onNext: () => void;
}

interface FloatingHeartItem {
  id: number;
  emoji: string;
  left: number;
  duration: number;
}

const HEART_EMOJIS = ['💗', '💖', '💕', '💞'];

export function HeartsStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [percent, setPercent] = useState(0);
  const [items, setItems] = useState<FloatingHeartItem[]>([]);
  const nextIdRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (doneRef.current) return;
      const id = nextIdRef.current++;
      setItems((prev) => [
        ...prev.slice(-14),
        {
          id,
          emoji: HEART_EMOJIS[id % HEART_EMOJIS.length],
          left: 6 + Math.random() * 78,
          duration: 3.4 + Math.random() * 1.8,
        },
      ]);
    }, 550);
    return () => window.clearInterval(interval);
  }, []);

  const tapHeart = (id: number, clientX: number, clientY: number) => {
    if (doneRef.current) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
    burst(clientX || undefined, clientY || undefined, 22);
    setPercent((prev) => {
      const next = Math.min(100, prev + 10);
      if (next >= 100) {
        doneRef.current = true;
        window.setTimeout(() => burst(), 150);
      }
      return next;
    });
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Love meter 💗
      </h2>

      <div className="h-4 w-full max-w-md overflow-hidden rounded-full bg-white shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#ff9ec4] to-[#e0467c] transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="font-display text-2xl text-[#7a3a68] tabular-nums" aria-live="polite">
        {percent >= 100 ? 'Fatima is loved 100% 💖' : `Tap the hearts: ${percent}%`}
      </p>

      <div className="relative h-[280px] w-full max-w-md overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xs">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label="Tap heart"
            onClick={(e) => tapHeart(item.id, e.clientX, e.clientY)}
            onAnimationEnd={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
            className="animate-heart-rise focus-ink absolute -bottom-14 flex min-h-[52px] min-w-[52px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-4xl select-none"
            style={{
              left: `${item.left}%`,
              animationDuration: `${item.duration}s`,
            }}
          >
            {item.emoji}
          </button>
        ))}
        {percent >= 100 && (
          <div className="flex h-full items-center justify-center font-display text-4xl text-[var(--deep)]">
            100% Loved 💖
          </div>
        )}
      </div>

      {percent >= 100 && (
        <button
          type="button"
          onClick={onNext}
          className="btn-celebrate min-h-[46px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

export function ScratchStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const movesRef = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const revealedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const w = Math.max(260, Math.floor(rect.width));
    const h = Math.max(180, Math.floor(rect.height));
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#c9c9d6');
    grad.addColorStop(0.5, '#f4f4fa');
    grad.addColorStop(1, '#a9a9bb');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#6f6f85';
    ctx.font = '700 22px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Scratch here ✨', w / 2, h / 2 + 8);
  }, []);

  const scratchAt = (clientX: number, clientY: number) => {
    if (revealedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    movesRef.current += 1;
    if (movesRef.current % 10 === 0) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let cleared = 0;
      let sampled = 0;
      for (let i = 3; i < data.length; i += 64) {
        sampled += 1;
        if (data[i] === 0) cleared += 1;
      }
      if (sampled > 0 && cleared / sampled > 0.38) {
        revealedRef.current = true;
        setRevealed(true);
        burst();
      }
    }
  };

  const quickReveal = () => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setRevealed(true);
    burst();
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Scratch your surprise 🎟️
      </h2>

      <div className="relative h-[196px] w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(176,21,90,0.22)]">
        <div className="flex h-full w-full items-center justify-center px-5 font-display text-3xl leading-snug text-[var(--deep)]">
          You are the best part of my life, Fatima 💖
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            drawingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (drawingRef.current) scratchAt(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            drawingRef.current = false;
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
          }}
          className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
            revealed ? 'pointer-events-none opacity-0' : 'cursor-grab opacity-100 active:cursor-grabbing'
          }`}
        />
      </div>

      {!revealed ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-semibold text-[var(--ink)]">Scratch with your finger or mouse</p>
          <button
            type="button"
            onClick={quickReveal}
            className="focus-ink min-h-[44px] cursor-pointer rounded-full bg-white/75 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white"
          >
            Tap to reveal
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="btn-celebrate min-h-[46px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

const PINATA_MESSAGES = [
  'Stay happy 🎈',
  'Always smile 😊',
  'Dream big ⭐',
  'Be blessed 🤲',
];

export function PinataStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [hits, setHits] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const broken = hits >= 5;

  const handleHit = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (broken) return;
    const next = hits + 1;
    setHits(next);
    setShakeKey((k) => k + 1);
    burst(e.clientX || undefined, e.clientY || undefined, 42);
    if (next >= 5) {
      burst();
      burst(window.innerWidth * 0.3, window.innerHeight * 0.5, 70);
      burst(window.innerWidth * 0.7, window.innerHeight * 0.5, 70);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Smash the piñata 🦄
      </h2>
      <p className="font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {broken
          ? 'It broke! Surprise! 🎉'
          : hits === 0
            ? 'Tap it 5 times!'
            : `${PINATA_MESSAGES[hits - 1]} (${5 - hits} left)`}
      </p>

      <button
        key={shakeKey}
        type="button"
        disabled={broken}
        onClick={handleHit}
        aria-label={broken ? 'Piñata broken' : 'Hit the piñata'}
        className={`focus-ink animate-gift-shake min-h-[120px] min-w-[120px] cursor-pointer rounded-3xl border-0 bg-transparent p-3 text-8xl leading-none transition-transform select-none ${
          broken ? 'cursor-default' : 'hover:scale-105 active:scale-95'
        }`}
      >
        {broken ? '🍬🍭🍫' : '🦄'}
      </button>

      {broken && (
        <button
          type="button"
          onClick={onNext}
          className="btn-celebrate min-h-[46px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

const WHEEL_SLICES = [
  { emoji: '🎂', wish: 'Lots of cake 🍰' },
  { emoji: '🎈', wish: 'A year full of smiles 😊' },
  { emoji: '🌸', wish: 'Dreams coming true ✨' },
  { emoji: '⭐', wish: 'Endless happiness 💖' },
  { emoji: '💖', wish: 'Blessings always 🤲' },
  { emoji: '🎁', wish: 'A big hug 🤗' },
];

export function WheelStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedWish, setSelectedWish] = useState<string | null>(null);

  const handleSpin = () => {
    if (spinning || selectedWish !== null) return;
    setSpinning(true);
    const chosenIndex = Math.floor(Math.random() * WHEEL_SLICES.length);
    const targetRotation = 1800 - (chosenIndex * 60 + 30);
    setRotation(targetRotation);

    window.setTimeout(() => {
      setSpinning(false);
      setSelectedWish(WHEEL_SLICES[chosenIndex].wish);
      burst();
    }, 4600);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Spin the wheel of wishes 🎡
      </h2>

      <div className="relative pt-7">
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 z-10 -translate-x-1/2 text-3xl text-[var(--deep)]"
        >
          ▼
        </div>
        <button
          type="button"
          onClick={handleSpin}
          disabled={spinning || selectedWish !== null}
          aria-label="Spin the wheel of wishes"
          className="focus-ink relative h-[244px] w-[244px] cursor-pointer rounded-full border-[6px] border-white shadow-[0_10px_26px_rgba(176,21,90,0.28)] transition-transform duration-[4500ms] ease-[cubic-bezier(0.1,0.7,0.1,1)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            background:
              'conic-gradient(#ff9ec4 0 60deg, #ffd166 60deg 120deg, #b9a3ff 120deg 180deg, #8bf0b0 180deg 240deg, #7fd6ff 240deg 300deg, #ff8a8a 300deg 360deg)',
          }}
        >
          {WHEEL_SLICES.map((slice, idx) => (
            <span
              key={slice.wish}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -m-3.5 text-2xl select-none"
              style={{
                transform: `rotate(${idx * 60 + 30}deg) translateY(-84px)`,
              }}
            >
              {slice.emoji}
            </span>
          ))}
        </button>
      </div>

      <p className="font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {selectedWish
          ? `Your wish: ${selectedWish}`
          : spinning
            ? 'Spinning…'
            : 'Tap the wheel to spin'}
      </p>

      {selectedWish && (
        <button
          type="button"
          onClick={onNext}
          className="btn-celebrate min-h-[46px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          Continue →
        </button>
      )}
    </div>
  );
}
