import { useEffect, useRef, useState } from 'react';
import { useConfetti } from '../ConfettiCanvas';

interface StageProps {
  onNext: () => void;
}

interface SparkleMark {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

const SPARKLE_SET = ['✨', '⭐', '💫', '🌟'];

export function WandStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [sparkles, setSparkles] = useState<SparkleMark[]>([]);
  const [count, setCount] = useState(0);
  const drawingRef = useRef(false);
  const lastTimeRef = useRef(0);
  const idRef = useRef(0);
  const completedRef = useRef(false);

  const addSparkle = (clientX: number, clientY: number, rect: DOMRect) => {
    const now = Date.now();
    if (now - lastTimeRef.current < 36) return;
    lastTimeRef.current = now;

    const id = idRef.current++;
    const x = clientX - rect.left - 12;
    const y = clientY - rect.top - 12;

    setSparkles((prev) => [...prev.slice(-28), { id, emoji: SPARKLE_SET[id % 4], x, y }]);
    setCount((prev) => {
      const next = prev + 1;
      if (next >= 65 && !completedRef.current) {
        completedRef.current = true;
        burst();
      }
      return next;
    });
  };

  const statusText =
    count >= 65
      ? 'Your wish is on its way 🌠'
      : count >= 40
        ? 'Almost there…'
        : count >= 18
          ? 'Hold it in your heart…'
          : 'Draw on the sky with your finger or mouse';

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Magic wand ✨
      </h2>
      <p className="font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {statusText}
      </p>

      <div
        role="application"
        aria-label="Magic sky drawing pad"
        onPointerDown={(e) => {
          drawingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          addSparkle(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
        }}
        onPointerMove={(e) => {
          if (!drawingRef.current) return;
          addSparkle(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
        }}
        onPointerUp={() => {
          drawingRef.current = false;
        }}
        onPointerCancel={() => {
          drawingRef.current = false;
        }}
        className="relative h-[310px] w-full max-w-md cursor-crosshair touch-none overflow-hidden rounded-3xl bg-gradient-to-b from-[#150a28] to-[#4b1f63] shadow-inner select-none"
      >
        {count === 0 && (
          <div className="pointer-events-none flex h-full items-center justify-center font-display text-2xl text-white/75">
            Drag to cast magic ✨
          </div>
        )}
        {sparkles.map((s) => (
          <span
            key={s.id}
            aria-hidden="true"
            onAnimationEnd={() => setSparkles((prev) => prev.filter((item) => item.id !== s.id))}
            className="animate-sparkle-fade pointer-events-none absolute text-2xl"
            style={{ left: `${s.x}px`, top: `${s.y}px` }}
          >
            {s.emoji}
          </span>
        ))}
      </div>

      {count >= 65 && (
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

export function CrownStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [crowned, setCrowned] = useState(false);

  const handleCrown = () => {
    if (crowned) return;
    setCrowned(true);
    window.setTimeout(() => {
      burst();
      burst(window.innerWidth * 0.25, window.innerHeight * 0.4, 60);
      burst(window.innerWidth * 0.75, window.innerHeight * 0.4, 60);
    }, 500);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Crown the Birthday Queen 👑
      </h2>

      <div className="flex h-[240px] flex-col items-center justify-end">
        <button
          type="button"
          onClick={handleCrown}
          disabled={crowned}
          aria-label="Place crown on the birthday queen"
          className={`focus-ink cursor-pointer rounded-full border-0 bg-transparent px-6 py-2 text-6xl leading-none transition-all duration-700 ease-[cubic-bezier(0.3,1.5,0.5,1)] ${
            crowned
              ? '-mb-3 cursor-default'
              : 'animate-gentle-bob mb-14 hover:scale-110'
          }`}
        >
          👑
        </button>
        <div className="select-none text-8xl leading-none" aria-hidden="true">
          👸
        </div>
      </div>

      <p className="font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {crowned ? 'Queen Fatima 👑✨' : 'Tap the crown'}
      </p>

      {crowned && (
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

const FIREWORK_COLORS = ['#ffd166', '#ff6fa5', '#7fd6ff', '#b9a3ff', '#8bf0b0'];

export function FireworksStage({ onNext }: StageProps) {
  const { firework } = useConfetti();
  const [launches, setLaunches] = useState(0);
  const skyRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const rect = skyRef.current?.getBoundingClientRect();
      if (rect) {
        firework(rect.left + rect.width / 2, rect.top + rect.height / 3, FIREWORK_COLORS[0]);
      }
    }, 450);
    return () => window.clearTimeout(t);
  }, [firework]);

  const handleLaunch = (e: React.MouseEvent<HTMLButtonElement>) => {
    const color = FIREWORK_COLORS[launches % FIREWORK_COLORS.length];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;
    firework(x, y, color);
    setLaunches((prev) => prev + 1);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Light up the sky 🎆
      </h2>
      <p className="text-base font-semibold text-[var(--ink)]">Tap the sky to launch fireworks</p>

      <button
        ref={skyRef}
        type="button"
        onClick={handleLaunch}
        aria-label="Tap sky to launch firework"
        className="focus-ink flex h-[300px] w-full max-w-md cursor-pointer items-center justify-center rounded-3xl border-0 bg-gradient-to-b from-[#1c1030] to-[#5b2a6e] font-display text-4xl text-white shadow-inner"
      >
        {launches === 0 ? 'Tap!' : `${launches} ${launches === 1 ? 'firework' : 'fireworks'} launched 🎆`}
      </button>

      {launches >= 4 && (
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

const LETTER_LINES = [
  'Dear Fatima,',
  'Happy Birthday to someone truly special! 🎂',
  'You are kind, caring, and the kind of friend who makes life lighter. I’m so grateful to have you in my life.',
  'You bring warmth and sweetness into every day, and every moment with you is precious.',
  'On your special day, I wish you all the happiness, love, and joy you deserve.',
  'May this year bring you countless beautiful moments and wonderful memories.',
  'Never forget how much you matter.',
  'With love,\nYour friend 💗',
];

export function MailStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [opened, setOpened] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const paperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!opened) return;
    const timers: number[] = [];
    LETTER_LINES.forEach((_, idx) => {
      timers.push(
        window.setTimeout(() => {
          setVisibleLines(idx + 1);
          burst(
            window.innerWidth * (0.2 + Math.random() * 0.6),
            window.innerHeight * 0.72,
            14,
          );
        }, 650 + idx * 1450),
      );
    });
    return () => timers.forEach(window.clearTimeout);
  }, [opened, burst]);

  useEffect(() => {
    if (paperRef.current) {
      paperRef.current.scrollTo({
        top: paperRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [visibleLines]);

  const handleOpen = () => {
    setOpened(true);
    burst();
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        A Message From My Heart
      </h2>

      {!opened ? (
        <button
          type="button"
          onClick={handleOpen}
          aria-label="Open the letter"
          className="animate-gentle-bob focus-ink flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-0 bg-transparent p-6 text-8xl leading-none"
        >
          <span>✉️</span>
          <span className="font-sans text-base font-semibold text-[var(--ink)]">Tap to open</span>
        </button>
      ) : (
        <>
          <div
            ref={paperRef}
            className="font-handwritten max-h-[54vh] w-full max-w-md overflow-y-auto rounded-xl border border-[#e5c98a] bg-[#fffaf0] px-5 py-6 text-left text-2xl leading-snug text-[#4d2036] shadow-[0_12px_28px_rgba(120,40,80,0.18)]"
          >
            {LETTER_LINES.map((line, idx) => (
              <p
                key={line}
                className={`mb-3 whitespace-pre-line transition-all duration-700 ease-out last:mb-0 ${
                  idx < visibleLines ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                {line}
              </p>
            ))}
          </div>

          {visibleLines >= LETTER_LINES.length ? (
            <button
              type="button"
              onClick={onNext}
              className="btn-celebrate min-h-[46px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setVisibleLines(LETTER_LINES.length)}
              className="focus-ink min-h-[44px] cursor-pointer rounded-full bg-white/75 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white"
            >
              Read full letter
            </button>
          )}
        </>
      )}
    </div>
  );
}

export function GiftStage({ onRestart }: { onRestart: () => void }) {
  const { burst } = useConfetti();
  const [tapsLeft, setTapsLeft] = useState(3);
  const [shakeKey, setShakeKey] = useState(0);
  const [unwrapped, setUnwrapped] = useState(false);

  useEffect(() => {
    if (!unwrapped) return;
    const timers: number[] = [];
    for (let k = 0; k < 8; k += 1) {
      timers.push(
        window.setTimeout(() => {
          burst(Math.random() * window.innerWidth, window.innerHeight * 0.35, 70);
        }, k * 700),
      );
    }
    return () => timers.forEach(window.clearTimeout);
  }, [unwrapped, burst]);

  const handleGiftTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (unwrapped) return;
    const next = tapsLeft - 1;
    setTapsLeft(next);
    setShakeKey((k) => k + 1);
    burst(e.clientX || undefined, e.clientY || undefined, 50);
    if (next <= 0) {
      window.setTimeout(() => setUnwrapped(true), 450);
    }
  };

  if (unwrapped) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="font-display text-balance text-5xl leading-[1.12] text-[var(--deep)] sm:text-6xl">
          Happy Birthday,
          <br />
          Fatima 🎉
        </h1>
        <div className="animate-gentle-bob select-none text-6xl tracking-widest sm:text-7xl" aria-hidden="true">
          🎂💖🎈
        </div>
        <p className="text-xl font-bold text-[var(--ink)]">
          May this year be your sweetest one yet.
        </p>
        <button
          type="button"
          onClick={onRestart}
          className="btn-celebrate min-h-[48px] cursor-pointer rounded-full px-9 py-3 text-base whitespace-nowrap shrink-0"
        >
          Watch again 🔁
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        One Last Thing…
      </h2>
      <p className="text-base font-semibold text-[var(--ink)]">Tap the gift</p>

      <button
        key={shakeKey}
        type="button"
        onClick={handleGiftTap}
        aria-label={`Open gift (${tapsLeft} taps remaining)`}
        className="animate-gift-shake focus-ink relative flex min-h-[120px] min-w-[120px] cursor-pointer items-center justify-center rounded-3xl border-0 bg-transparent p-4 text-8xl leading-none select-none hover:scale-105"
      >
        <span aria-hidden="true">🎁</span>
        <span className="absolute top-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pink)] font-sans text-lg font-bold text-white shadow-md tabular-nums">
          {tapsLeft}
        </span>
      </button>
    </div>
  );
}
