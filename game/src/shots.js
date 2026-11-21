// Screenshot staging: ?shot=start|play|round2|win&seed=N freezes the game in
// a chosen state so the screenshots are real renders of the game itself.
// The timer is frozen in shot mode, so every capture is identical.

import { ROUNDS } from './differences.js';

export function applyShot(state, params) {
  const shot = params.get('shot');
  if (!shot) return false;
  state.shot = shot;
  state.frozen = true;
  if (shot === 'start') {
    state.mode = 'title';
  } else if (shot === 'play') {
    state.mode = 'playing';
    state.roundIndex = 0;
    state.found = new Set([ROUNDS[0].diffs[0].id, ROUNDS[0].diffs[2].id, ROUNDS[0].diffs[4].id]);
    state.score = 300;
    state.roundScore = 300;
    state.timeLeft = 154;
    state.cursor = { x: 300, y: 270 };
  } else if (shot === 'round2') {
    state.mode = 'playing';
    state.roundIndex = 1;
    state.found = new Set([ROUNDS[1].diffs[1].id, ROUNDS[1].diffs[5].id]);
    state.score = 200;
    state.roundScore = 200;
    state.timeLeft = 142;
    state.cursor = { x: 300, y: 270 };
  } else if (shot === 'win') {
    state.mode = 'roundComplete';
    state.roundIndex = 0;
    state.found = new Set(ROUNDS[0].diffs.map((d) => d.id));
    state.roundScore = 700;
    state.lastBonus = 480;
    state.score = 1180;
    state.timeLeft = 96;
    state.accuracy = 100;
  }
  return true;
}
