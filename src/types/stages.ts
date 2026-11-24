export type StageId =
  | 'intro'
  | 'balloons'
  | 'cake'
  | 'candle'
  | 'roses'
  | 'flip'
  | 'stars'
  | 'lanterns'
  | 'hearts'
  | 'scratch'
  | 'pinata'
  | 'wheel'
  | 'wand'
  | 'crown'
  | 'fireworks'
  | 'mail'
  | 'gift';

export interface StageMeta {
  id: StageId;
  title: string;
  emoji: string;
}

export const STAGES: StageMeta[] = [
  { id: 'intro', title: 'Welcome', emoji: '🐻' },
  { id: 'balloons', title: 'Pop Balloons', emoji: '🎈' },
  { id: 'cake', title: 'Build Your Cake', emoji: '🍰' },
  { id: 'candle', title: 'Make a Wish', emoji: '🕯️' },
  { id: 'roses', title: 'Rose Bouquet', emoji: '🌹' },
  { id: 'flip', title: 'Love Cards', emoji: '💌' },
  { id: 'stars', title: 'Falling Stars', emoji: '⭐' },
  { id: 'lanterns', title: 'Wish Lanterns', emoji: '🏮' },
  { id: 'hearts', title: 'Love Meter', emoji: '💗' },
  { id: 'scratch', title: 'Scratch Surprise', emoji: '🎟️' },
  { id: 'pinata', title: 'Piñata Party', emoji: '🦄' },
  { id: 'wheel', title: 'Wheel of Wishes', emoji: '🎡' },
  { id: 'wand', title: 'Magic Wand', emoji: '✨' },
  { id: 'crown', title: 'Birthday Queen', emoji: '👑' },
  { id: 'fireworks', title: 'Fireworks Sky', emoji: '🎆' },
  { id: 'mail', title: 'Heartfelt Letter', emoji: '✉️' },
  { id: 'gift', title: 'Grand Finale', emoji: '🎁' },
];
