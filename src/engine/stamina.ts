import { Player } from '../types';
import { POSITION_GROUPS } from '../utils/constants';

export function drainStamina(player: Player, isStarter: boolean): number {
  if (!isStarter) {
    // Subs lose 5-10
    const drain = 5 + Math.random() * 5;
    return Math.max(0, Math.min(100, player.currentStamina - drain));
  }

  // Starters lose 20-35, midfielders on the higher end
  const group = POSITION_GROUPS[player.position];
  const base = group === 'midfield' ? 28 : 20;
  const range = group === 'midfield' ? 7 : 15;
  const drain = base + Math.random() * range;
  return Math.max(0, Math.min(100, player.currentStamina - drain));
}

export function recoverStamina(player: Player, didPlay: boolean): number {
  const recovery = didPlay ? 10 : 25;
  return Math.max(0, Math.min(100, player.currentStamina + recovery));
}
