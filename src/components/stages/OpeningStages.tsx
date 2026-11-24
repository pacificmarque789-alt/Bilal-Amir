import { useEffect, useState } from 'react';
import { useConfetti } from '../ConfettiCanvas';

interface StageProps {
  onNext: () => void;
}

export function IntroStage({
  onStart,
}: {
  onStart: () => void;
}) {
  const { burst } = useConfetti();

  useEffect(() => {
    const t1 = window.setTimeout(() => burst(), 450);
    const t2 = window.setTimeout(() => burst(), 1650);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [burst]);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <h1 className="font-display text-balance text-5xl leading-[1.12] text-[var(--deep)] sm:text-6xl">
        Happy Birthday,
        <br />
        Fatima
      </h1>
      <div className="animate-gentle-bob select-none text-6xl tracking-widest sm:text-7xl" aria-hidden="true">
        🐻🎂🐼
      </div>
      <p className="text-lg font-semibold text-[var(--ink)]">A little surprise, made with love</p>
      <button
        type="button"
        onClick={onStart}
        className="btn-celebrate min-h-[48px] cursor-pointer rounded-full px-9 py-3 text-lg whitespace-nowrap shrink-0"
      >
        Start 💗
      </button>
    </div>
  );
}

const BALLOON_WORDS = ['You', 'are', 'truly', 'loved'] as const;
const BALLOON_COLORS = ['#6fcf97', '#a78bfa', '#f9a8d4', '#fbbf24'] as const;

export function BalloonsStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false]);
  const poppedCount = popped.filter(Boolean).length;

  useEffect(() => {
    if (poppedCount === 4) {
      const t = window.setTimeout(() => burst(), 350);
      return () => window.clearTimeout(t);
    }
  }, [poppedCount, burst]);

  const handlePop = (idx: number, clientX: number, clientY: number) => {
    if (popped[idx]) return;
    setPopped((prev) => prev.map((v, i) => (i === idx ? true : v)));
    burst(clientX || undefined, clientY || undefined, 45);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Pop all 4 balloons
      </h2>

      <div className="flex min-h-[2.6rem] flex-wrap items-center justify-center gap-3 font-display text-3xl text-[var(--pink)]">
        {BALLOON_WORDS.map((word, idx) => (
          <span
            key={word}
            className="min-w-[3.5rem] border-b-2 border-dashed border-[#e8a1c0] px-1 text-center transition-all duration-300"
          >
            {popped[idx] ? word : ''}
          </span>
        ))}
      </div>

      <div className="relative h-[290px] w-full max-w-md">
        {BALLOON_WORDS.map((word, idx) => {
          const isPopped = popped[idx];
          return (
            <button
              key={word}
              type="button"
              aria-label={`Pop balloon ${idx + 1}`}
              disabled={isPopped}
              onClick={(e) => handlePop(idx, e.clientX, e.clientY)}
              className={`balloon-gloss focus-ink absolute bottom-20 h-[88px] w-[70px] cursor-pointer rounded-[50%_50%_46%_46%] border-0 transition-all duration-300 ${
                isPopped
                  ? 'pointer-events-none scale-150 opacity-0'
                  : 'animate-balloon-bob hover:scale-105'
              }`}
              style={{
                backgroundColor: BALLOON_COLORS[idx],
                left: `${6 + idx * 23}%`,
                animationDelay: `${idx * 0.45}s`,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-full left-1/2 h-[86px] w-[1.5px] -translate-x-1/2 bg-[#b57a8e]"
              />
            </button>
          );
        })}
      </div>

      {poppedCount === 4 && (
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

const CAKE_LAYERS = [
  { bg: '#f3c98b', width: '216px', label: 'Golden sponge layer' },
  { bg: '#ffffff', width: '192px', label: 'Whipped cream layer' },
  { bg: '#f48fb8', width: '168px', label: 'Strawberry frosting layer' },
  { bg: '#ffffff', width: '144px', label: 'Vanilla icing layer' },
];

export function CakeStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [steps, setSteps] = useState(0);

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (steps >= 5) return;
    const nextSteps = steps + 1;
    setSteps(nextSteps);
    burst(e.clientX || undefined, e.clientY || undefined, nextSteps === 5 ? 85 : 28);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Build your cake 🍰
      </h2>

      <div
        aria-live="polite"
        className="flex h-[240px] w-full flex-col-reverse items-center justify-start pt-4"
      >
        <div className="h-3 w-64 rounded-full bg-white/80 shadow-sm" aria-hidden="true" />
        {CAKE_LAYERS.slice(0, Math.min(steps, 4)).map((layer, index) => (
          <div
            key={layer.label}
            className="animate-cake-drop -mb-1 h-10 rounded-xl shadow-[0_3px_10px_rgba(176,21,90,0.2)]"
            style={{
              backgroundColor: layer.bg,
              width: layer.width,
              zIndex: index + 1,
            }}
          />
        ))}
        {steps >= 5 && (
          <div className="animate-cake-drop z-10 -mb-1 select-none text-4xl leading-none">🍒</div>
        )}
      </div>

      {steps < 5 ? (
        <button
          type="button"
          onClick={handleAdd}
          className="btn-celebrate min-h-[48px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          {steps === 4 ? 'Add the cherry 🍒' : 'Add a layer ➕'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="btn-celebrate min-h-[48px] cursor-pointer rounded-full px-8 py-3 text-base whitespace-nowrap shrink-0"
        >
          Continue →
        </button>
      )}
    </div>
  );
}

export function CandleStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [blown, setBlown] = useState(false);

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    burst();
    window.setTimeout(() => burst(), 450);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Blow the candle,
        <br />
        Fatima
      </h2>

      <div className="my-2 flex flex-col items-center">
        <button
          type="button"
          onClick={handleBlow}
          disabled={blown}
          aria-label="Blow out the candle"
          className={`focus-ink min-h-[60px] cursor-pointer rounded-full border-0 bg-transparent px-10 py-2 text-5xl transition-opacity duration-500 ${
            blown ? 'cursor-default opacity-15' : 'animate-candle-flicker hover:scale-110'
          }`}
        >
          🕯️
        </button>
        <div className="-mt-2 select-none text-8xl leading-none" aria-hidden="true">
          🎂
        </div>
      </div>

      <p className="font-display text-2xl text-[#7a3a68] sm:text-3xl">
        {blown ? (
          'Your wish is on its way ✨'
        ) : (
          <>
            Close your eyes &amp; make a wish
            <br />
            <span className="font-sans text-sm font-semibold">then tap the candle</span>
          </>
        )}
      </p>

      {blown && (
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
