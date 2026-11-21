// Harbor Lights — bootstrap and game state. The loop ticks the timer, draws
// every frame, and hands input to the actions below. Nothing here fetches
// anything: the whole game is the files beside this one.

import { ROUND_TIME_SEC, POINTS_PER_FIND, POINTS_WRONG_CLICK, POINTS_HINT, TIME_BONUS_PER_SEC, HINT_GLOW_MS, PANEL_W, PANEL_H } from './config.js';
import { ROUNDS } from './differences.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { applyShot } from './shots.js';
import { sfx } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function freshState() {
  return {
    mode: 'title',
    roundIndex: 0,
    found: new Set(),
    score: 0,
    roundScore: 0,
    roundStartScore: 0,
    lastBonus: 0,
    timeLeft: ROUND_TIME_SEC,
    clicks: 0,
    hits: 0,
    accuracy: 100,
    cursor: { x: PANEL_W / 2, y: PANEL_H / 2 },
    wrongFlash: null,
    hint: null,
    pulse: null,
    hover: null,
    muted: false,
    frozen: false,
    shot: null,
  };
}

const state = freshState();

function resetRound() {
  state.found = new Set();
  state.roundScore = 0;
  state.roundStartScore = state.score;
  state.timeLeft = ROUND_TIME_SEC;
  state.wrongFlash = null;
  state.hint = null;
  state.pulse = null;
  state.cursor = { x: PANEL_W / 2, y: PANEL_H / 2 };
}

function startRound(i) {
  state.roundIndex = i;
  resetRound();
  state.mode = 'playing';
}

function completeRound() {
  const bonus = Math.ceil(state.timeLeft) * TIME_BONUS_PER_SEC;
  state.lastBonus = bonus;
  state.score += bonus;
  sfx.win();
  state.mode = state.roundIndex === 0 ? 'roundComplete' : 'gameComplete';
}

const actions = {
  select(x, y) {
    if (state.mode !== 'playing') return;
    const round = ROUNDS[state.roundIndex];
    state.clicks++;
    for (const d of round.diffs) {
      if (state.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        state.found.add(d.id);
        state.hits++;
        state.score += POINTS_PER_FIND;
        state.roundScore += POINTS_PER_FIND;
        state.pulse = { id: d.id, t: performance.now() };
        sfx.find();
        if (state.found.size === round.diffs.length) completeRound();
        return;
      }
    }
    state.score = Math.max(0, state.score + POINTS_WRONG_CLICK);
    state.wrongFlash = { x, y, t: performance.now() };
    sfx.wrong();
  },
  hint() {
    if (state.mode !== 'playing') return;
    const round = ROUNDS[state.roundIndex];
    const rest = round.diffs.filter((d) => !state.found.has(d.id));
    if (!rest.length) return;
    const pick = rest[Math.floor(Math.random() * rest.length)];
    state.hint = { id: pick.id, until: performance.now() + HINT_GLOW_MS };
    state.score = Math.max(0, state.score + POINTS_HINT);
    sfx.hint();
  },
  restart() {
    state.score = state.roundStartScore;
    resetRound();
    state.mode = 'playing';
  },
  toggleMute() {
    state.muted = sfx.toggleMute();
  },
  toTitle() {
    const s = freshState();
    Object.assign(state, s);
  },
  press(id) {
    if (id === 'start') {
      sfx.click();
      state.score = 0;
      startRound(0);
    } else if (id === 'hint') actions.hint();
    else if (id === 'sound') actions.toggleMute();
    else if (id === 'restart') actions.restart();
    else if (id === 'next') {
      sfx.click();
      if (state.roundIndex === 0) startRound(1);
      else actions.press('again');
    } else if (id === 'again') {
      sfx.click();
      const s = freshState();
      Object.assign(state, s);
      state.score = 0;
      startRound(0);
    } else if (id === 'retry') {
      sfx.click();
      state.score = state.roundStartScore;
      resetRound();
      state.mode = 'playing';
    }
  },
};

attachInput(canvas, state, actions);

const params = new URLSearchParams(window.location.search);
applyShot(state, params);

let last = performance.now();
let frames = 0;
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (state.mode === 'playing' && !state.frozen) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.mode = 'timeout';
      sfx.lose();
    }
  }
  if (state.hint && now > state.hint.until) state.hint = null;
  if (state.clicks > 0) state.accuracy = Math.round((state.hits / state.clicks) * 100);
  drawGame(ctx, state);
  frames++;
  if (state.shot && frames >= 2 && !window.__shotReady) window.__shotReady = true;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
