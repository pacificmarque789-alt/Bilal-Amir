import { useEffect, useRef, useState } from 'react';
import { useConfetti } from '../ConfettiCanvas';

interface StageProps {
  onNext: () => void;
}

const ROSE_NOTES = [
  { text: 'Forever grateful 🤍', pos: 'left-0 top-[2%]' },
  { text: 'You make my world beautiful', pos: 'right-0 top-0' },
  { text: 'You are my sunshine ☀️', pos: 'left-0 top-[37%]' },
  { text: 'Happy Birthday Fatima 💗', pos: 'right-0 top-[35%]' },
  { text: 'I’m lucky to have you 😊', pos: 'left-0 top-[72%]' },
  { text: 'You are my favorite person 💕', pos: 'right-0 top-[70%]' },
];

export function RosesStage({ onNext }: StageProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    ROSE_NOTES.forEach((_, idx) => {
      timers.push(window.setTimeout(() => setVisibleCount(idx + 1), 800 + idx * 1700));
    });
    return () => timers.forEach(window.clearTimeout);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Your Rose Bouquet 🌹
      </h2>

      <div className="relative h-[370px] w-full max-w-md">
        <div
          className="animate-gentle-bob absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-7xl sm:text-8xl"
          aria-hidden="true"
        >
          💐
        </div>
        {ROSE_NOTES.slice(0, visibleCount).map((note) => (
          <div
            key={note.text}
            className={`animate-bubble-pop absolute w-[40%] rounded-2xl bg-white px-3 py-2.5 text-sm font-semibold text-[var(--ink)] shadow-[0_6px_16px_rgba(176,21,90,0.16)] sm:w-[38%] ${note.pos}`}
          >
            {note.text}
          </div>
        ))}
      </div>

      {visibleCount < ROSE_NOTES.length ? (
        <button
          type="button"
          onClick={() => setVisibleCount(ROSE_NOTES.length)}
          className="focus-ink min-h-[44px] cursor-pointer rounded-full bg-white/75 px-5 py-2 text-sm font-semibold text-[var(--ink)] transition hover:bg-white"
        >
          Reveal all notes
        </button>
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

const FLIP_CARDS = [
  { emoji: '💖', title: 'Kind heart', body: 'You care so deeply about everyone around you.' },
  { emoji: '😊', title: 'Beautiful smile', body: 'It can brighten the darkest day.' },
  { emoji: '🌟', title: 'Rare soul', body: 'There is truly no one else like you.' },
  { emoji: '🤝', title: 'Loyal friend', body: 'You show up, always. Thank you.' },
];

export function FlipCardsStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false, false]);
  const allFlipped = flipped.every(Boolean);

  const handleFlip = (idx: number, clientX: number, clientY: number) => {
    if (flipped[idx]) return;
    setFlipped((prev) => prev.map((v, i) => (i === idx ? true : v)));
    burst(clientX || undefined, clientY || undefined, 32);
  };

  return (
    <div className="flex w-full flex-col items-center gap-5 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Tap the cards 💌
      </h2>

      <div className="grid w-full max-w-md grid-cols-2 gap-3.5">
        {FLIP_CARDS.map((card, idx) => {
          const isOpen = flipped[idx];
          return (
            <button
              key={card.title}
              type="button"
              onClick={(e) => handleFlip(idx, e.clientX, e.clientY)}
              aria-pressed={isOpen}
              aria-label={isOpen ? `${card.title}: ${card.body}` : `Reveal card ${idx + 1}`}
              className="focus-ink h-[175px] w-full cursor-pointer border-0 bg-transparent p-0 [perspective:900px]"
            >
              <div
                className={`preserve-3d relative h-full w-full transition-transform duration-700 ${
                  isOpen ? 'rotate-y-180' : 'hover:-translate-y-0.5'
                }`}
              >
                <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff9ec4] to-[#e0467c] text-5xl shadow-[0_6px_18px_rgba(176,21,90,0.22)]">
                  {card.emoji}
                </div>
                <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-white p-3.5 text-center shadow-[0_6px_18px_rgba(176,21,90,0.18)]">
                  <span className="text-base font-bold text-[var(--deep)]">{card.title}</span>
                  <span className="text-sm leading-snug text-[var(--ink)]">{card.body}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {allFlipped && (
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

const STAR_WISHES = [
  'You deserve all the happiness 💖',
  'Your dreams will come true ✨',
  'Good things are coming your way 🌸',
  'You are loved more than you know 💞',
  'Today, the whole sky is yours 🌠',
];

interface FallingStar {
  id: number;
  left: number;
  duration: number;
}

export function StarsStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [caught, setCaught] = useState(0);
  const [stars, setStars] = useState<FallingStar[]>([]);
  const nextIdRef = useRef(0);
  const caughtRef = useRef(0);

  const spawnStar = () => {
    if (caughtRef.current >= 5) return;
    const id = nextIdRef.current++;
    setStars((prev) => [
      ...prev,
      {
        id,
        left: 10 + Math.random() * 76,
        duration: 4.5 + Math.random() * 2,
      },
    ]);
  };

  useEffect(() => {
    const timers: number[] = [];
    for (let i = 0; i < 5; i += 1) {
      timers.push(window.setTimeout(spawnStar, i * 950));
    }
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const catchStar = (id: number, clientX: number, clientY: number) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    burst(clientX || undefined, clientY || undefined, 36);
    if (caughtRef.current < 5) {
      caughtRef.current += 1;
      setCaught(caughtRef.current);
    }
  };

  const handleMiss = (id: number) => {
    setStars((prev) => prev.filter((s) => s.id !== id));
    if (caughtRef.current < 5) {
      spawnStar();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Catch 5 falling stars ⭐
      </h2>
      <p className="min-h-[2.4rem] font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {caught === 0
          ? 'Tap a star to read your wish'
          : `${STAR_WISHES[caught - 1]} (${caught}/5)`}
      </p>

      <div className="relative h-[320px] w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-[#2a1240] to-[#8a3a76] shadow-inner">
        {stars.map((star) => (
          <button
            key={star.id}
            type="button"
            aria-label="Catch falling star"
            onClick={(e) => catchStar(star.id, e.clientX, e.clientY)}
            onAnimationEnd={() => handleMiss(star.id)}
            className="animate-star-fall focus-ink absolute -top-14 flex min-h-[52px] min-w-[52px] cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-4xl select-none"
            style={{
              left: `${star.left}%`,
              animationDuration: `${star.duration}s`,
            }}
          >
            ⭐
          </button>
        ))}
        {caught >= 5 && (
          <div className="flex h-full items-center justify-center font-display text-3xl text-white/95">
            All 5 wishes caught 🌠
          </div>
        )}
      </div>

      {caught >= 5 && (
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

const LANTERN_MESSAGES = [
  'Stay happy, always 💛',
  'Chase every dream ✨',
  'Stay safe and blessed 🤲',
  'Keep smiling like this 😊',
];

interface ReleasedLantern {
  id: number;
  x: number;
}

export function LanternsStage({ onNext }: StageProps) {
  const { burst } = useConfetti();
  const [lanterns, setLanterns] = useState<ReleasedLantern[]>([]);
  const count = lanterns.length;

  const releaseLantern = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (count >= 4) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left - 22 : rect.width / 2 - 22;
    setLanterns((prev) => [...prev, { id: prev.length + 1, x: Math.max(12, Math.min(rect.width - 56, x)) }]);
    burst(e.clientX || undefined, e.clientY || undefined, 26);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 text-center">
      <h2 className="font-display text-balance text-4xl text-[var(--deep)] sm:text-5xl">
        Release the wish lanterns 🏮
      </h2>
      <p className="min-h-[2.4rem] font-display text-2xl text-[#7a3a68]" aria-live="polite">
        {count === 0 ? 'Tap the sky to send a wish' : LANTERN_MESSAGES[count - 1]}
      </p>

      <button
        type="button"
        onClick={releaseLantern}
        aria-label="Tap sky to release a wish lantern"
        className="focus-ink relative flex h-[320px] w-full max-w-md cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-0 bg-gradient-to-b from-[#1c1030] to-[#c2477f] font-display text-3xl text-white"
      >
        {count === 0 && <span>Tap!</span>}
        {lanterns.map((lantern) => (
          <span
            key={lantern.id}
            aria-hidden="true"
            className="animate-lantern-rise pointer-events-none absolute -bottom-3 text-4xl"
            style={{ left: `${lantern.x}px` }}
          >
            🏮
          </span>
        ))}
      </button>

      {count >= 4 && (
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
