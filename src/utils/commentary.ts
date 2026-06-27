import { MatchEvent, MatchStatEvent } from '../types';

const GOAL_TEMPLATES = [
  '{player} müthiş bir gol atıyor! {minute}\' | {score}',
  'GOOOOL! {player} topu ağlara gönderiyor! {minute}\'',
  '{player} harika bir vuruşla skoru değiştiriyor! {minute}\'',
  'Gol! {player} fileleri havalandırıyor! {minute}\'',
  '{player} kalecinin açığını buluyor ve gol! {minute}\'',
];

const ASSIST_TEMPLATES = [
  '{assister} harika bir pas atıyor, {player} gol buluyor!',
  '{assister} asisti yapıyor, {player} bitiriyor!',
  '{assister} muhteşem bir asist! {player} kaçırmadı!',
];

const YELLOW_CARD_TEMPLATES = [
  '{player} sarı kart görüyor.',
  'Hakem cebine gidiyor, {player}\'a sarı kart!',
  'Sert faul! {player} sarı kartla uyarılıyor.',
];

const INJURY_TEMPLATES = [
  '{player} sakatlanıyor! Sedye sahaya giriyor.',
  '{player} yerde kaldı, sakatlık ciddi görünüyor.',
];

const SUBSTITUTION_TEMPLATES = [
  'Oyuncu değişikliği: {detail}',
];

const SHOT_ON_TEMPLATES = [
  '{team} tehlikeli geliyor ama kaleci kurtarıyor!',
  'İsabetli şut! Kaleci son anda müdahale ediyor.',
  'Güzel pozisyon! Ama kaleciyi geçemiyor.',
];

const CORNER_TEMPLATES = [
  '{team} korner kazanıyor.',
];

const FOUL_TEMPLATES = [
  '{team} faul yapıyor, serbest vuruş.',
];

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

export interface CommentaryLine {
  minute: number;
  text: string;
}

export function generateCommentary(
  events: MatchEvent[],
  statEvents: MatchStatEvent[],
  homeTeamName: string,
  awayTeamName: string,
  homeTeamId: string,
  playerNames: Record<string, string>,
  finalHomeGoals: number,
  finalAwayGoals: number
): CommentaryLine[] {
  const lines: CommentaryLine[] = [];
  let homeGoals = 0;
  let awayGoals = 0;

  lines.push({ minute: 0, text: 'Maç başlıyor! Hakem düdüğü çaldı.' });

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const playerName = playerNames[e.playerId] ?? 'Bilinmeyen';
    switch (e.type) {
      case 'goal': {
        if (e.teamId === homeTeamId) homeGoals++; else awayGoals++;
        const score = `${homeGoals}-${awayGoals}`;
        if (e.detail?.startsWith('Asist:')) {
          const assisterName = e.detail.replace('Asist: ', '');
          lines.push({
            minute: e.minute,
            text: pick(ASSIST_TEMPLATES, i).replace('{player}', playerName).replace('{assister}', assisterName).replace('{score}', score),
          });
        } else {
          lines.push({
            minute: e.minute,
            text: pick(GOAL_TEMPLATES, i).replace('{player}', playerName).replace('{minute}', String(e.minute)).replace('{score}', score),
          });
        }
        break;
      }
      case 'yellow_card':
        lines.push({ minute: e.minute, text: pick(YELLOW_CARD_TEMPLATES, i).replace('{player}', playerName) });
        break;
      case 'injury':
        lines.push({ minute: e.minute, text: pick(INJURY_TEMPLATES, i).replace('{player}', playerName) });
        break;
      case 'substitution':
        lines.push({ minute: e.minute, text: pick(SUBSTITUTION_TEMPLATES, i).replace('{detail}', e.detail ?? '') });
        break;
    }
  }

  for (let i = 0; i < statEvents.length; i++) {
    const se = statEvents[i];
    const seTeamName = se.teamId === homeTeamId ? homeTeamName : awayTeamName;

    switch (se.type) {
      case 'shot_on':
        if (i % 3 === 0) lines.push({ minute: se.minute, text: pick(SHOT_ON_TEMPLATES, i).replace('{team}', seTeamName) });
        break;
      case 'corner':
        if (i % 2 === 0) lines.push({ minute: se.minute, text: pick(CORNER_TEMPLATES, i).replace('{team}', seTeamName) });
        break;
      case 'foul':
        if (i % 3 === 0) lines.push({ minute: se.minute, text: pick(FOUL_TEMPLATES, i).replace('{team}', seTeamName) });
        break;
    }
  }

  lines.push({ minute: 45, text: 'İlk yarı sona erdi.' });
  lines.push({ minute: 90, text: `Maç sona erdi! Skor: ${finalHomeGoals}-${finalAwayGoals}` });

  lines.sort((a, b) => a.minute - b.minute);
  return lines;
}
