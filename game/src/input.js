// Harbor Lights — mouse and keyboard input. Clicks land on panels or on the
// buttons render.js draws; the keyboard moves a crosshair that is mirrored
// on both panels, so the whole game is playable without a mouse.

import { LEFT_X, RIGHT_X, PANEL_W, PANEL_H, PANEL_Y } from './config.js';
import { computeButtons } from './render.js';

function toCanvas(canvas, ev) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - r.left) / r.width) * canvas.width,
    y: ((ev.clientY - r.top) / r.height) * canvas.height,
  };
}

function isInside(px, py, b) {
  return px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h;
}

function panelAt(state, px, py) {
  if (py < PANEL_Y || py > PANEL_Y + PANEL_H) return null;
  if (px >= LEFT_X && px <= LEFT_X + PANEL_W) return { side: 'left', x: px - LEFT_X, y: py - PANEL_Y };
  if (px >= RIGHT_X && px <= RIGHT_X + PANEL_W) return { side: 'right', x: px - RIGHT_X, y: py - PANEL_Y };
  return null;
}

export function attachInput(canvas, state, actions) {
  canvas.addEventListener('mousemove', (ev) => {
    const p = toCanvas(canvas, ev);
    state.hover = null;
    for (const b of computeButtons(state)) {
      if (isInside(p.x, p.y, b)) state.hover = b.id;
    }
    canvas.style.cursor = state.hover ? 'pointer' : 'default';
  });

  canvas.addEventListener('click', (ev) => {
    const p = toCanvas(canvas, ev);
    for (const b of computeButtons(state)) {
      if (isInside(p.x, p.y, b)) {
        actions.press(b.id);
        return;
      }
    }
    if (state.mode !== 'playing') return;
    const hit = panelAt(state, p.x, p.y);
    if (hit) actions.select(hit.x, hit.y);
  });

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight' || ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (state.mode !== 'playing') return;
      if (!state.cursor) state.cursor = { x: PANEL_W / 2, y: PANEL_H / 2 };
      const step = ev.shiftKey ? 3 : 12;
      if (ev.key === 'ArrowLeft') state.cursor.x = Math.max(0, state.cursor.x - step);
      if (ev.key === 'ArrowRight') state.cursor.x = Math.min(PANEL_W, state.cursor.x + step);
      if (ev.key === 'ArrowUp') state.cursor.y = Math.max(0, state.cursor.y - step);
      if (ev.key === 'ArrowDown') state.cursor.y = Math.min(PANEL_H, state.cursor.y + step);
      return;
    }
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      if (state.mode === 'title') actions.press('start');
      else if (state.mode === 'roundComplete') actions.press('next');
      else if (state.mode === 'gameComplete') actions.press('again');
      else if (state.mode === 'timeout') actions.press('retry');
      else if (state.mode === 'playing' && state.cursor) actions.select(state.cursor.x, state.cursor.y);
      return;
    }
    const k = ev.key.toLowerCase();
    if (k === 'h' && state.mode === 'playing') actions.hint();
    if (k === 'm') actions.toggleMute();
    if (k === 'r' && (state.mode === 'playing' || state.mode === 'timeout')) actions.restart();
    if (k === 'n' && state.mode === 'roundComplete') actions.press('next');
    if (k === 'escape' && state.mode !== 'title') actions.toTitle();
  });
}
