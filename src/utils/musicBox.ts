const NOTE_FREQUENCIES: Record<string, number> = {
  G4: 392,
  A4: 440,
  B4: 494,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

const HAPPY_BIRTHDAY_TUNE: Array<[keyof typeof NOTE_FREQUENCIES, number]> = [
  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['C5', 1],
  ['B4', 2],
  ['G4', 0.75],
  ['G4', 0.25],
  ['A4', 1],
  ['G4', 1],
  ['D5', 1],
  ['C5', 2],
  ['G4', 0.75],
  ['G4', 0.25],
  ['G5', 1],
  ['E5', 1],
  ['C5', 1],
  ['B4', 1],
  ['A4', 2],
  ['F5', 0.75],
  ['F5', 0.25],
  ['E5', 1],
  ['C5', 1],
  ['D5', 1],
  ['C5', 3],
];

const KEY_MULTIPLIERS = [1, 1.122, 1.26, 1.122];

export class MusicBoxPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private loopTimer: number | null = null;
  private loopIndex = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx || this.ctx.state === 'closed') {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private scheduleNote(ctx: AudioContext, freq: number, startTime: number, duration: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.6);
  }

  private playLoop = () => {
    if (!this.isPlaying) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const beatSeconds = 0.55;
    const multiplier = KEY_MULTIPLIERS[this.loopIndex % KEY_MULTIPLIERS.length];
    this.loopIndex += 1;

    let time = ctx.currentTime + 0.1;
    for (const [noteName, beats] of HAPPY_BIRTHDAY_TUNE) {
      const freq = NOTE_FREQUENCIES[noteName] * multiplier;
      this.scheduleNote(ctx, freq, time, beats * beatSeconds);
      time += beats * beatSeconds;
    }

    const waitMs = Math.max(500, (time - ctx.currentTime + 1) * 1000);
    this.loopTimer = window.setTimeout(this.playLoop, waitMs);
  };

  public start(): boolean {
    if (this.isPlaying) return true;
    const ctx = this.ensureContext();
    if (!ctx) return false;
    this.isPlaying = true;
    this.playLoop();
    return true;
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.loopTimer !== null) {
      window.clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      void this.ctx.close();
      this.ctx = null;
    }
  }

  public get active(): boolean {
    return this.isPlaying;
  }
}
