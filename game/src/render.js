// Harbor Lights — everything the player sees: the framed panels, the header
// with its timer and score, the counter, the markers, and the title/win/timeout
// screens. The scenes themselves live in scenes.js / garden.js.

import {
  VIEW_W, VIEW_H, PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X,
  ROUND_TIME_SEC, TITLE_FONT, HEADING_FONT, HUD_FONT, SMALL_FONT, BIG_FONT,
} from './config.js';
import { drawHarborBase, rr, ellipse } from './scenes.js';
import { drawGardenBase } from './garden.js';
import { ROUNDS } from './differences.js';

const sceneCache = new Map();

function sceneCanvas(round, side) {
  const key = round.name + ':' + side;
  if (sceneCache.has(key)) return sceneCache.get(key);
  const c = document.createElement('canvas');
  c.width = PANEL_W;
  c.height = PANEL_H;
  const g = c.getContext('2d');
  if (round.scene === 'harbor') drawHarborBase(g, round.seed);
  else drawGardenBase(g, round.seed);
  for (const d of round.diffs) d.draw(g, side);
  sceneCache.set(key, c);
  return c;
}

function fmtTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function pill(ctx, x, y, w, h, fill, stroke) {
  rr(ctx, x, y, w, h, h / 2);
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

function text(ctx, s, x, y, font, color, align = 'left') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(s, x, y);
}

// Button rectangles, shared with input.js so clicks land on what is drawn.
export function computeButtons(state) {
  const btns = [];
  if (state.mode === 'title') {
    btns.push({ id: 'start', x: VIEW_W / 2 - 110, y: 512, w: 220, h: 54 });
  } else if (state.mode === 'playing' || state.mode === 'timeout') {
    btns.push({ id: 'hint', x: 480, y: 668, w: 118, h: 38 });
    btns.push({ id: 'sound', x: 608, y: 668, w: 132, h: 38 });
    btns.push({ id: 'restart', x: 750, y: 668, w: 128, h: 38 });
  }
  if (state.mode === 'roundComplete') {
    btns.push({ id: 'next', x: VIEW_W / 2 - 110, y: 470, w: 220, h: 54 });
  }
  if (state.mode === 'gameComplete') {
    btns.push({ id: 'again', x: VIEW_W / 2 - 110, y: 470, w: 220, h: 54 });
  }
  if (state.mode === 'timeout') {
    btns.push({ id: 'retry', x: VIEW_W / 2 - 110, y: 470, w: 220, h: 54 });
  }
  return btns;
}

function drawButton(ctx, b, label, hovered) {
  pill(ctx, b.x, b.y, b.w, b.h, hovered ? '#3a2c1c' : '#241c12', '#c9a86a');
  text(ctx, label, b.x + b.w / 2, b.y + b.h / 2 + 1, HUD_FONT, '#f2e6c9', 'center');
}

function drawHeader(ctx, state) {
  const g = ctx.createLinearGradient(0, 0, 0, 96);
  g.addColorStop(0, '#16213a');
  g.addColorStop(1, '#0d1526');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VIEW_W, 96);
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(0, 95, VIEW_W, 1);
  // wordmark
  text(ctx, 'HARBOR LIGHTS', 24, 34, '700 30px Georgia, "Times New Roman", serif', '#f2e6c9');
  ctx.save();
  ctx.globalAlpha = 0.85;
  text(ctx, 'S P O T   T H E   D I F F E R E N C E', 25, 66, '600 12px system-ui, sans-serif', '#c9a86a');
  ctx.restore();
  const round = ROUNDS[state.roundIndex];
  // round chip
  const chip = 'ROUND ' + (state.roundIndex + 1) + '  ·  ' + round.name.toUpperCase();
  ctx.font = HUD_FONT;
  const cw = ctx.measureText(chip).width + 36;
  pill(ctx, VIEW_W / 2 - cw / 2, 26, cw, 40, '#1c2942', '#3d5a80');
  text(ctx, chip, VIEW_W / 2, 47, HUD_FONT, '#dbe7ff', 'center');
  // timer
  const frac = Math.max(0, state.timeLeft / ROUND_TIME_SEC);
  const tcol = frac > 0.5 ? '#37d67a' : frac > 0.25 ? '#f7c948' : '#ff6b5e';
  text(ctx, fmtTime(state.timeLeft), 1060, 34, '700 26px system-ui, sans-serif', tcol, 'center');
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  rr(ctx, 980, 56, 160, 8, 4);
  ctx.fill();
  ctx.fillStyle = tcol;
  rr(ctx, 980, 56, 160 * frac, 8, 4);
  ctx.fill();
  // score pill
  pill(ctx, 1160, 22, 96, 40, '#241c12', '#c9a86a');
  text(ctx, String(state.score), 1208, 48, '700 20px system-ui, sans-serif', '#f2e6c9', 'center');
  text(ctx, 'SCORE', 1208, 31, '500 9px system-ui, sans-serif', '#c9a86a', 'center');
}

function drawMarkers(ctx, state, side) {
  const x0 = side === 'left' ? LEFT_X : RIGHT_X;
  const round = ROUNDS[state.roundIndex];
  const now = performance.now();
  for (const d of round.diffs) {
    if (!state.found.has(d.id)) continue;
    const cx = x0 + d.x;
    const cy = PANEL_Y + d.y;
    ctx.save();
    ctx.shadowColor = 'rgba(55,214,122,0.8)';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, d.r + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    // check mark at the ring's upper right
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + d.r * 0.45, cy - d.r * 0.55);
    ctx.lineTo(cx + d.r * 0.7, cy - d.r * 0.3);
    ctx.lineTo(cx + d.r * 1.05, cy - d.r * 0.75);
    ctx.stroke();
    if (state.pulse && state.pulse.id === d.id) {
      const age = (now - state.pulse.t) / 600;
      if (age < 1) {
        ctx.globalAlpha = 1 - age;
        ctx.strokeStyle = '#a7f3c9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, d.r + 5 + age * 14, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  // hint glow on an unfound difference
  if (state.hint && now < state.hint.until) {
    const d = round.diffs.find((k) => k.id === state.hint.id);
    if (d && !state.found.has(d.id)) {
      const pulse = 0.55 + 0.45 * Math.sin(now / 160);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = '#f7c948';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x0 + d.x, PANEL_Y + d.y, d.r + 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
  // wrong-click flash
  if (state.wrongFlash) {
    const age = (now - state.wrongFlash.t) / 450;
    if (age < 1) {
      const wx = x0 + state.wrongFlash.x;
      const wy = PANEL_Y + state.wrongFlash.y;
      ctx.globalAlpha = 1 - age;
      ctx.strokeStyle = '#ff6b5e';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(wx - 10, wy - 10);
      ctx.lineTo(wx + 10, wy + 10);
      ctx.moveTo(wx + 10, wy - 10);
      ctx.lineTo(wx - 10, wy + 10);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

function drawPanels(ctx, state) {
  for (const side of ['left', 'right']) {
    const x = side === 'left' ? LEFT_X : RIGHT_X;
    const round = ROUNDS[state.roundIndex];
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    rr(ctx, x - 6, PANEL_Y - 6, PANEL_W + 12, PANEL_H + 12, 14);
    ctx.fillStyle = '#0a0f1e';
    ctx.fill();
    ctx.restore();
    ctx.save();
    rr(ctx, x, PANEL_Y, PANEL_W, PANEL_H, 10);
    ctx.clip();
    ctx.drawImage(sceneCanvas(round, side), x, PANEL_Y);
    ctx.restore();
    rr(ctx, x - 2, PANEL_Y - 2, PANEL_W + 4, PANEL_H + 4, 12);
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 3;
    ctx.stroke();
    // A / B badge
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#c9a86a';
    ctx.beginPath();
    ctx.arc(x + 18, PANEL_Y + 18, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    text(ctx, side === 'left' ? 'A' : 'B', x + 18, PANEL_Y + 19, '700 16px Georgia, serif', '#241c12', 'center');
    drawMarkers(ctx, state, side);
  }
  // keyboard cursor, mirrored on both panels
  if (state.mode === 'playing' && state.cursor) {
    for (const x0 of [LEFT_X, RIGHT_X]) {
      const cx = x0 + state.cursor.x;
      const cy = PANEL_Y + state.cursor.y;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 19, cy);
      ctx.lineTo(cx - 8, cy);
      ctx.moveTo(cx + 8, cy);
      ctx.lineTo(cx + 19, cy);
      ctx.moveTo(cx, cy - 19);
      ctx.lineTo(cx, cy - 8);
      ctx.moveTo(cx, cy + 8);
      ctx.lineTo(cx, cy + 19);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFooter(ctx, state) {
  const round = ROUNDS[state.roundIndex];
  const found = state.found.size;
  const total = round.diffs.length;
  // found dots
  for (let i = 0; i < total; i++) {
    const dx = 36 + i * 26;
    ctx.beginPath();
    ctx.arc(dx, 687, 8, 0, Math.PI * 2);
    ctx.fillStyle = i < found ? '#37d67a' : 'rgba(255,255,255,0.18)';
    ctx.fill();
    if (i < found) {
      ctx.strokeStyle = '#0d1526';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dx - 3.5, 687);
      ctx.lineTo(dx - 1, 689.5);
      ctx.lineTo(dx + 4, 684);
      ctx.stroke();
    }
  }
  text(ctx, found + ' found  ·  ' + (total - found) + ' remaining', 230, 687, HUD_FONT, '#e8ecf5');
  const btns = computeButtons(state);
  for (const b of btns) {
    if (b.id === 'hint') drawButton(ctx, b, 'Hint  (H)  −50', state.hover === 'hint');
    if (b.id === 'sound') drawButton(ctx, b, state.muted ? 'Sound: Off  (M)' : 'Sound: On  (M)', state.hover === 'sound');
    if (b.id === 'restart') drawButton(ctx, b, 'Restart  (R)', state.hover === 'restart');
  }
  text(ctx, 'Click, or arrows + Enter', 1280 - 24, 687, SMALL_FONT, 'rgba(232,236,245,0.55)', 'right');
}

function drawCard(ctx, title, lines, button, hovered) {
  ctx.fillStyle = 'rgba(8,12,24,0.72)';
  ctx.fillRect(0, 96, VIEW_W, VIEW_H - 96);
  const cw = 560;
  const ch = 380;
  const cx = VIEW_W / 2 - cw / 2;
  const cy = 160;
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 24;
  rr(ctx, cx, cy, cw, ch, 18);
  ctx.fillStyle = '#141d33';
  ctx.fill();
  ctx.restore();
  rr(ctx, cx, cy, cw, ch, 18);
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, title, VIEW_W / 2, cy + 52, BIG_FONT, '#f2e6c9', 'center');
  lines.forEach((ln, i) => text(ctx, ln, VIEW_W / 2, cy + 108 + i * 32, HUD_FONT, '#dbe7ff', 'center'));
  if (button) drawButton(ctx, button, button.label, hovered);
}

function drawTitle(ctx, state) {
  const bg = sceneCanvas(ROUNDS[0], 'left');
  ctx.drawImage(bg, 0, 0, VIEW_W, VIEW_H);
  ctx.fillStyle = 'rgba(10,14,30,0.62)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  // gold rules
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(VIEW_W / 2 - 130, 118, 260, 2);
  text(ctx, 'HARBOR LIGHTS', VIEW_W / 2, 178, TITLE_FONT, '#f2e6c9', 'center');
  text(ctx, 'S P O T   T H E   D I F F E R E N C E', VIEW_W / 2, 222, '600 15px system-ui, sans-serif', '#c9a86a', 'center');
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(VIEW_W / 2 - 130, 246, 260, 2);
  const lines = [
    'Two pictures, side by side — seven differences hide between them.',
    'Round one: a harbor at dusk. Round two: a garden at morning.',
    'Click a difference, or hunt with the arrow keys and Enter.',
    'Find them all before the light runs out. Hints cost 50 points.',
  ];
  lines.forEach((ln, i) => text(ctx, ln, VIEW_W / 2, 300 + i * 30, HUD_FONT, '#e8ecf5', 'center'));
  const btns = computeButtons(state);
  const start = btns.find((b) => b.id === 'start');
  if (start) {
    start.label = 'Start Playing';
    drawButton(ctx, start, 'Start Playing', state.hover === 'start');
  }
  text(ctx, 'Mouse or keyboard  ·  H hint  ·  M sound  ·  R restart', VIEW_W / 2, 600, SMALL_FONT, 'rgba(232,236,245,0.6)', 'center');
  text(ctx, 'Two rounds  ·  7 differences each  ·  3:00 on the clock', VIEW_W / 2, 626, SMALL_FONT, 'rgba(232,236,245,0.6)', 'center');
}

export function drawGame(ctx, state) {
  const bg = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  bg.addColorStop(0, '#0d1526');
  bg.addColorStop(1, '#0a0f1e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  if (state.mode === 'title') {
    drawTitle(ctx, state);
    return;
  }
  drawHeader(ctx, state);
  drawPanels(ctx, state);
  drawFooter(ctx, state);
  const btns = computeButtons(state);
  if (state.mode === 'roundComplete') {
    const next = btns.find((b) => b.id === 'next');
    if (next) next.label = state.roundIndex === 0 ? 'Next Round  →' : 'See Results  →';
    drawCard(
      ctx,
      'Round Complete!',
      [
        'You found all ' + ROUNDS[state.roundIndex].diffs.length + ' differences.',
        'Time bonus  +' + state.lastBonus + '   ·   Round score  ' + state.roundScore,
        'Total score  ' + state.score,
      ],
      next,
      state.hover === 'next',
    );
  }
  if (state.mode === 'gameComplete') {
    const again = btns.find((b) => b.id === 'again');
    if (again) again.label = 'Play Again';
    drawCard(
      ctx,
      'You Found Them All!',
      [
        'Both rounds complete — ' + (ROUNDS[0].diffs.length + ROUNDS[1].diffs.length) + ' differences found.',
        'Accuracy  ' + state.accuracy + '%   ·   Final score  ' + state.score,
        'The harbor and the garden keep their secrets no longer.',
      ],
      again,
      state.hover === 'again',
    );
  }
  if (state.mode === 'timeout') {
    const retry = btns.find((b) => b.id === 'retry');
    if (retry) retry.label = 'Try Again';
    drawCard(
      ctx,
      "Time's Up!",
      [
        'You found ' + state.found.size + ' of ' + ROUNDS[state.roundIndex].diffs.length + ' differences.',
        'The light ran out before the hunt was done.',
        'Try the round again — the differences are waiting.',
      ],
      retry,
      state.hover === 'retry',
    );
  }
}
