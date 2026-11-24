import { ChevronLeft, ListMusic, Pause, Play, X } from 'lucide-react';
import { STAGES } from '../types/stages';

interface StageControlsProps {
  currentIndex: number;
  musicPlaying: boolean;
  chaptersOpen: boolean;
  onToggleMusic: () => void;
  onPrev: () => void;
  onOpenChapters: () => void;
  onCloseChapters: () => void;
  onSelectStage: (index: number) => void;
}

export function StageControls({
  currentIndex,
  musicPlaying,
  chaptersOpen,
  onToggleMusic,
  onPrev,
  onOpenChapters,
  onCloseChapters,
  onSelectStage,
}: StageControlsProps) {
  const currentStage = STAGES[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / STAGES.length) * 100);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-1.5">
          {currentIndex > 0 && (
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous chapter"
              className="focus-ink flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-white/75 text-[var(--ink)] backdrop-blur-sm transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={onOpenChapters}
            className="focus-ink flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition hover:bg-white whitespace-nowrap shrink-0"
          >
            <span className="tabular-nums">
              {currentIndex + 1} / {STAGES.length}
            </span>
            <span aria-hidden="true">·</span>
            <span>{currentStage.title}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleMusic}
          aria-pressed={musicPlaying}
          className="focus-ink flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--ink)] backdrop-blur-sm transition hover:bg-white whitespace-nowrap shrink-0"
        >
          {musicPlaying ? (
            <>
              <Pause className="h-4 w-4" aria-hidden="true" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" aria-hidden="true" />
              <span>Music</span>
            </>
          )}
        </button>
      </header>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-30 h-1 bg-white/35"
      >
        <div
          className="h-full bg-gradient-to-r from-[#ff9ec4] to-[#d12b6b] transition-[width] duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {chaptersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Jump to a birthday chapter"
          className="fixed inset-0 z-40 flex items-end justify-center bg-[#320c1f]/45 p-0 backdrop-blur-xs sm:items-center sm:p-6"
          onClick={onCloseChapters}
        >
          <div
            className="w-full max-w-lg rounded-t-3xl bg-[#fff7fb] p-5 shadow-2xl sm:rounded-3xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic className="h-5 w-5 text-[var(--deep)]" aria-hidden="true" />
                <h2 className="font-display text-3xl text-[var(--deep)]">Birthday Chapters</h2>
              </div>
              <button
                type="button"
                onClick={onCloseChapters}
                aria-label="Close chapters"
                className="focus-ink flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-white text-[var(--ink)] shadow-xs transition hover:bg-[#ffe9f2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid max-h-[60vh] grid-cols-2 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-3">
              {STAGES.map((stage, idx) => {
                const active = idx === currentIndex;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      onSelectStage(idx);
                      onCloseChapters();
                    }}
                    className={`focus-ink flex min-h-[48px] cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      active
                        ? 'bg-gradient-to-br from-[#f0508a] to-[#d12b6b] text-white shadow-sm'
                        : 'bg-white text-[var(--ink)] hover:bg-[#ffe9f2]'
                    }`}
                  >
                    <span className="text-lg" aria-hidden="true">
                      {stage.emoji}
                    </span>
                    <span className="truncate">
                      <span className="mr-1 opacity-75 tabular-nums">{idx + 1}.</span>
                      {stage.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
