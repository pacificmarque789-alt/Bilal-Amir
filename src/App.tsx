import { useCallback, useEffect, useRef, useState } from 'react';
import { ConfettiProvider } from './components/ConfettiCanvas';
import { FloatingHearts } from './components/FloatingHearts';
import { StageControls } from './components/StageControls';
import {
  FlipCardsStage,
  LanternsStage,
  RosesStage,
  StarsStage,
} from './components/stages/AffectionStages';
import {
  CrownStage,
  FireworksStage,
  GiftStage,
  MailStage,
  WandStage,
} from './components/stages/FinaleStages';
import {
  BalloonsStage,
  CakeStage,
  CandleStage,
  IntroStage,
} from './components/stages/OpeningStages';
import {
  HeartsStage,
  PinataStage,
  ScratchStage,
  WheelStage,
} from './components/stages/PlayfulStages';
import { STAGES } from './types/stages';
import { MusicBoxPlayer } from './utils/musicBox';

function BirthdayExperience() {
  const [stageIndex, setStageIndex] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [chaptersOpen, setChaptersOpen] = useState(false);
  const playerRef = useRef<MusicBoxPlayer | null>(null);

  if (!playerRef.current) {
    playerRef.current = new MusicBoxPlayer();
  }

  useEffect(() => {
    const player = playerRef.current;
    return () => {
      player?.stop();
    };
  }, []);

  const toggleMusic = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (player.active) {
      player.stop();
      setMusicPlaying(false);
    } else {
      const started = player.start();
      setMusicPlaying(started);
    }
  }, []);

  const handleStart = useCallback(() => {
    const player = playerRef.current;
    if (player && !player.active) {
      const started = player.start();
      setMusicPlaying(started);
    }
    setStageIndex(1);
  }, []);

  const goNext = useCallback(() => {
    setStageIndex((prev) => Math.min(STAGES.length - 1, prev + 1));
  }, []);

  const goPrev = useCallback(() => {
    setStageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const currentStageId = STAGES[stageIndex].id;

  const renderStage = () => {
    switch (currentStageId) {
      case 'intro':
        return <IntroStage onStart={handleStart} />;
      case 'balloons':
        return <BalloonsStage onNext={goNext} />;
      case 'cake':
        return <CakeStage onNext={goNext} />;
      case 'candle':
        return <CandleStage onNext={goNext} />;
      case 'roses':
        return <RosesStage onNext={goNext} />;
      case 'flip':
        return <FlipCardsStage onNext={goNext} />;
      case 'stars':
        return <StarsStage onNext={goNext} />;
      case 'lanterns':
        return <LanternsStage onNext={goNext} />;
      case 'hearts':
        return <HeartsStage onNext={goNext} />;
      case 'scratch':
        return <ScratchStage onNext={goNext} />;
      case 'pinata':
        return <PinataStage onNext={goNext} />;
      case 'wheel':
        return <WheelStage onNext={goNext} />;
      case 'wand':
        return <WandStage onNext={goNext} />;
      case 'crown':
        return <CrownStage onNext={goNext} />;
      case 'fireworks':
        return <FireworksStage onNext={goNext} />;
      case 'mail':
        return <MailStage onNext={goNext} />;
      case 'gift':
        return <GiftStage onRestart={() => setStageIndex(0)} />;
    }
  };

  return (
    <div className="relative min-h-dvh w-full">
      <FloatingHearts />

      <StageControls
        currentIndex={stageIndex}
        musicPlaying={musicPlaying}
        chaptersOpen={chaptersOpen}
        onToggleMusic={toggleMusic}
        onPrev={goPrev}
        onOpenChapters={() => setChaptersOpen(true)}
        onCloseChapters={() => setChaptersOpen(false)}
        onSelectStage={(idx) => setStageIndex(idx)}
      />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center px-5 pt-20 pb-10 sm:px-8">
        <div
          key={currentStageId}
          className="animate-stage-in flex w-full flex-col items-center justify-center rounded-3xl bg-white/30 px-5 py-8 shadow-[0_18px_50px_rgba(176,21,90,0.12)] backdrop-blur-[2px] sm:px-10 sm:py-10"
        >
          {renderStage()}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ConfettiProvider>
      <BirthdayExperience />
    </ConfettiProvider>
  );
}
