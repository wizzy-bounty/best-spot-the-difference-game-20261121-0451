// Shared drawing helpers and the Harbor at Dusk scene.
// Every picture is drawn in code — layered gradients, glow, grain and detail —
// so the two panels are pixel-perfect twins except for the differences.

import { makeRng, range } from './random.js';

export function ellipse(ctx, cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function glow(ctx, x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.globalAlpha = 1;
}

export function cloud(ctx, x, y, s, tint) {
  ctx.fillStyle = tint;
  ellipse(ctx, x, y, 34 * s, 13 * s);
  ellipse(ctx, x - 24 * s, y + 4 * s, 22 * s, 10 * s);
  ellipse(ctx, x + 26 * s, y + 5 * s, 24 * s, 11 * s);
  ellipse(ctx, x + 4 * s, y - 9 * s, 20 * s, 10 * s);
}

// A soft film grain so flat fills read as painted, not plastic.
export function grain(ctx, rng, w, h, n, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < n; i++) ctx.fillRect(rng() * w, rng() * h, 1.4, 1.4);
  ctx.fillStyle = '#000000';
  for (let i = 0; i < n; i++) ctx.fillRect(rng() * w, rng() * h, 1.2, 1.2);
  ctx.restore();
}

function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y + 3 * s);
  ctx.quadraticCurveTo(x - 3 * s, y - 5 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 5 * s, x + 9 * s, y + 3 * s);
  ctx.stroke();
}

function sailboat(ctx, x, y, s, hull, sail) {
  // hull
  ctx.fillStyle = hull;
  ctx.beginPath();
  ctx.moveTo(x - 26 * s, y);
  ctx.lineTo(x + 26 * s, y);
  ctx.lineTo(x + 16 * s, y + 10 * s);
  ctx.lineTo(x - 16 * s, y + 10 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(x - 26 * s, y, 52 * s, 2.5 * s);
  // mast + sail
  ctx.strokeStyle = '#5a3a22';
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 46 * s);
  ctx.stroke();
  // sail is null when a difference owns it and draws it per side
  if (sail) {
    ctx.fillStyle = sail;
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, y - 44 * s);
    ctx.lineTo(x + 2 * s, y - 4 * s);
    ctx.lineTo(x + 24 * s, y - 4 * s);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(x + 2 * s, y - 44 * s);
    ctx.lineTo(x + 2 * s, y - 4 * s);
    ctx.lineTo(x + 12 * s, y - 4 * s);
    ctx.closePath();
    ctx.fill();
  }
}

function cottage(ctx, x, y, w, h, wall, roof) {
  ctx.fillStyle = wall;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = roof;
  ctx.beginPath();
  ctx.moveTo(x - 6, y);
  ctx.lineTo(x + w / 2, y - 22);
  ctx.lineTo(x + w + 6, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x, y + h - 4, w, 4);
  // door
  ctx.fillStyle = '#4a2f1d';
  rr(ctx, x + w / 2 - 8, y + h - 24, 16, 24, 3);
  ctx.fill();
  ctx.fillStyle = '#d9a441';
  ctx.beginPath();
  ctx.arc(x + w / 2 + 5, y + h - 12, 1.8, 0, Math.PI * 2);
  ctx.fill();
  // chimney
  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(x + w - 18, y - 30, 10, 18);
}

export function drawHarborBase(ctx, seed) {
  const rng = makeRng(seed);
  // --- sky: dusk gradient, deep indigo to ember ---
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#232c52');
  sky.addColorStop(0.45, '#5d4370');
  sky.addColorStop(0.8, '#c96a4e');
  sky.addColorStop(1, '#e8854f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 302);
  // stars fading in overhead
  for (let i = 0; i < 46; i++) {
    const sx = rng() * 600;
    const sy = rng() * 130;
    ctx.globalAlpha = 0.25 + rng() * 0.6;
    ctx.fillStyle = '#ffe9b8';
    ctx.fillRect(sx, sy, 1.6, 1.6);
  }
  ctx.globalAlpha = 1;
  // low sun with halo
  glow(ctx, 430, 246, 90, '#ffcf7d', 0.55);
  ctx.fillStyle = '#ffd98a';
  ctx.beginPath();
  ctx.arc(430, 246, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffedb0';
  ctx.beginPath();
  ctx.arc(424, 240, 16, 0, Math.PI * 2);
  ctx.fill();
  // clouds, warm underneath
  cloud(ctx, 120, 66, 1.1, 'rgba(255,214,170,0.5)');
  cloud(ctx, 300, 44, 0.8, 'rgba(255,214,170,0.4)');
  cloud(ctx, 500, 84, 0.9, 'rgba(255,190,150,0.45)');
  cloud(ctx, 210, 110, 0.6, 'rgba(255,200,160,0.35)');
  // --- headland silhouettes ---
  ctx.fillStyle = '#2c2340';
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.quadraticCurveTo(90, 252, 210, 282);
  ctx.quadraticCurveTo(280, 296, 330, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#241c38';
  ctx.beginPath();
  ctx.moveTo(430, 300);
  ctx.quadraticCurveTo(500, 268, 600, 288);
  ctx.lineTo(600, 300);
  ctx.closePath();
  ctx.fill();
  // tiny pines on the headland
  ctx.fillStyle = '#1b1530';
  [[60, 268], [96, 262], [140, 272], [560, 282]].forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.moveTo(tx, ty - 16);
    ctx.lineTo(tx - 7, ty);
    ctx.lineTo(tx + 7, ty);
    ctx.closePath();
    ctx.fill();
  });
  // --- sea ---
  const sea = ctx.createLinearGradient(0, 300, 0, 540);
  sea.addColorStop(0, '#4a7d96');
  sea.addColorStop(0.4, '#2c5a74');
  sea.addColorStop(1, '#16324a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 300, 600, 240);
  // sun reflection: a shimmering column
  for (let i = 0; i < 26; i++) {
    const wy = 306 + i * 9;
    const ww = 8 + rng() * 46;
    ctx.globalAlpha = 0.16 + rng() * 0.2;
    ctx.fillStyle = '#ffd98a';
    ctx.fillRect(430 - ww / 2 + (rng() - 0.5) * 20, wy, ww, 2.4);
  }
  ctx.globalAlpha = 1;
  // wave strokes
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 22; i++) {
    const wx = rng() * 600;
    const wy = 312 + rng() * 210;
    const wl = 14 + rng() * 30;
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + wl / 2, wy - 3, wx + wl, wy);
    ctx.stroke();
  }
  // --- cottages on the left shore ---
  cottage(ctx, 36, 252, 92, 52, '#e8d9b8', '#a34d3d');
  cottage(ctx, 142, 266, 70, 42, '#d9c49a', '#7a4a3a');
  // their windows (the lit one is a difference, drawn by it)
  glow(ctx, 58, 273, 22, '#ffe9a8', 0.5);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(52, 266, 12, 14);
  ctx.fillStyle = '#2c2340';
  ctx.fillRect(52, 266, 12, 2);
  ctx.fillRect(57, 266, 2, 14);
  glow(ctx, 163, 284, 20, '#ffe9a8', 0.5);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillRect(158, 278, 11, 12);
  // --- lighthouse on the right headland ---
  ctx.fillStyle = '#3a2c22';
  ctx.beginPath();
  ctx.moveTo(486, 300);
  ctx.lineTo(524, 300);
  ctx.lineTo(518, 262);
  ctx.lineTo(492, 262);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#f2ead8';
  ctx.beginPath();
  ctx.moveTo(492, 262);
  ctx.lineTo(518, 262);
  ctx.lineTo(514, 168);
  ctx.lineTo(496, 168);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b8433a';
  ctx.beginPath();
  ctx.moveTo(494, 232);
  ctx.lineTo(516, 232);
  ctx.lineTo(514, 206);
  ctx.lineTo(496, 206);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b8433a';
  ctx.beginPath();
  ctx.moveTo(495, 190);
  ctx.lineTo(515, 190);
  ctx.lineTo(514, 168);
  ctx.lineTo(496, 168);
  ctx.closePath();
  ctx.fill();
  // gallery + lamp room (glass and beam are the difference)
  ctx.fillStyle = '#2c2340';
  ctx.fillRect(490, 160, 30, 8);
  ctx.fillStyle = '#2c2340';
  ctx.fillRect(494, 138, 22, 22);
  ctx.fillStyle = '#2c2340';
  ctx.beginPath();
  ctx.moveTo(492, 138);
  ctx.lineTo(518, 138);
  ctx.lineTo(505, 126);
  ctx.closePath();
  ctx.fill();
  // --- boats (sail of boat 1 is a difference; hull and mast stay shared) ---
  sailboat(ctx, 350, 372, 0.72, '#6b3a2a', null);
  // rowboat
  ctx.fillStyle = '#7a4a30';
  ctx.beginPath();
  ctx.moveTo(132, 424);
  ctx.lineTo(196, 424);
  ctx.lineTo(186, 436);
  ctx.lineTo(142, 436);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(150, 420, 4, 6);
  ctx.fillRect(174, 420, 4, 6);
  // reflections under the boats
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#f5e6c8';
  ctx.fillRect(326, 386, 48, 3);
  ctx.fillRect(140, 440, 48, 3);
  ctx.globalAlpha = 1;
  // --- dock across the foreground ---
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(0, 462, 600, 78);
  ctx.fillStyle = '#7d5a38';
  for (let x = 0; x < 600; x += 46) ctx.fillRect(x, 462, 40, 78);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  for (let x = 44; x < 600; x += 46) ctx.fillRect(x, 462, 2, 78);
  ctx.fillStyle = '#5a3a22';
  ctx.fillRect(0, 462, 600, 5);
  // dock posts with caps
  [[58, 452], [300, 452], [548, 452]].forEach(([px, py]) => {
    ctx.fillStyle = '#4a2f1d';
    ctx.fillRect(px, py, 14, 88);
    ctx.fillStyle = '#7d5a38';
    ctx.fillRect(px - 3, py - 4, 20, 8);
  });
  // barrel + rope coil (always present)
  ctx.fillStyle = '#8a5a3b';
  ellipse(ctx, 560, 512, 16, 20);
  ctx.fillStyle = '#6b4226';
  ctx.fillRect(544, 498, 32, 3);
  ctx.fillRect(544, 522, 32, 3);
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(200, 512, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(200, 512, 7, 0, Math.PI * 2);
  ctx.stroke();
  // two resting gulls (a third is a difference)
  gull(ctx, 180, 60, 1, 'rgba(30,25,50,0.85)');
  gull(ctx, 262, 96, 0.8, 'rgba(30,25,50,0.8)');
  // vignette + grain
  const vg = ctx.createRadialGradient(300, 270, 180, 300, 270, 430);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(10,8,24,0.28)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, 600, 540);
  grain(ctx, makeRng(seed + 7), 600, 540, 420, 0.05);
}
