import { Player } from '../types';

export function updateStamina(player: Player, isStarter: boolean): { stamina: number; consecutiveStarts: number } {
  if (isStarter) {
    const consecutive = player.consecutiveStarts + 1;
    let stamina = player.currentStamina;

    if (consecutive >= 6) {
      stamina -= 30;
    } else if (consecutive === 5) {
      stamina -= 20;
    } else if (consecutive === 4) {
      stamina -= 10;
    }

    return { stamina: Math.max(0, Math.min(100, stamina)), consecutiveStarts: consecutive };
  }

  return { stamina: Math.min(100, player.currentStamina + 15), consecutiveStarts: 0 };
}
