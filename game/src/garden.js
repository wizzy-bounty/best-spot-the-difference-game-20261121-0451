// The Garden at Morning scene — round two. Same helpers as the harbor:
// layered light, soft shapes, a little grain, and nothing flat-looking.

import { makeRng, range } from './random.js';
import { ellipse, rr, glow, cloud, grain } from './scenes.js';

function tulip(ctx, x, y, s, petal) {
  ctx.strokeStyle = '#2f7a2e';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 16 * s);
  ctx.stroke();
  ctx.fillStyle = petal;
  ctx.beginPath();
  ctx.moveTo(x - 6 * s, y - 16 * s);
  ctx.quadraticCurveTo(x - 8 * s, y - 28 * s, x, y - 24 * s);
  ctx.quadraticCurveTo(x + 8 * s, y - 28 * s, x + 6 * s, y - 16 * s);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(x - 2 * s, y - 22 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function sunflower(ctx, x, y, s, centerColor) {
  ctx.strokeStyle = '#3d7a2e';
  ctx.lineWidth = 3.4 * s;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 62 * s);
  ctx.stroke();
  ctx.fillStyle = '#3d7a2e';
  ellipse(ctx, x - 10 * s, y - 30 * s, 10 * s, 5 * s);
  ellipse(ctx, x + 10 * s, y - 44 * s, 10 * s, 5 * s);
  // petals
  ctx.fillStyle = '#f7c948';
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ellipse(ctx, x + Math.cos(a) * 15 * s, y - 62 * s + Math.sin(a) * 15 * s, 8 * s, 4.5 * s);
  }
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(x, y - 62 * s, 10 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(x - 5 * s + (i % 3) * 5 * s, y - 66 * s + Math.floor(i / 3) * 6 * s, 1.2 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawGardenBase(ctx, seed) {
  const rng = makeRng(seed);
  // --- morning sky ---
  const sky = ctx.createLinearGradient(0, 0, 0, 235);
  sky.addColorStop(0, '#8ed0ee');
  sky.addColorStop(0.6, '#c4e9f7');
  sky.addColorStop(1, '#f2f9d8');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 600, 238);
  // sun with soft rays
  glow(ctx, 505, 72, 110, '#fff3b0', 0.6);
  ctx.fillStyle = '#ffdf6b';
  ctx.beginPath();
  ctx.arc(505, 72, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff0a8';
  ctx.beginPath();
  ctx.arc(498, 66, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,223,107,0.7)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    ctx.beginPath();
    ctx.moveTo(505 + Math.cos(a) * 38, 72 + Math.sin(a) * 38);
    ctx.lineTo(505 + Math.cos(a) * 50, 72 + Math.sin(a) * 50);
    ctx.stroke();
  }
  cloud(ctx, 130, 60, 1, 'rgba(255,255,255,0.9)');
  cloud(ctx, 300, 96, 0.75, 'rgba(255,255,255,0.8)');
  cloud(ctx, 470, 150, 0.6, 'rgba(255,255,255,0.7)');
  // --- distant treeline ---
  ctx.fillStyle = '#5da24a';
  for (let x = -10; x < 610; x += 46) {
    ellipse(ctx, x, 232, 34, 22);
  }
  ctx.fillStyle = '#4c8f3e';
  for (let x = 10; x < 610; x += 52) {
    ellipse(ctx, x, 240, 30, 16);
  }
  // --- lawn ---
  const lawn = ctx.createLinearGradient(0, 235, 0, 540);
  lawn.addColorStop(0, '#8fce62');
  lawn.addColorStop(0.5, '#6db84e');
  lawn.addColorStop(1, '#4c9a3d');
  ctx.fillStyle = lawn;
  ctx.fillRect(0, 235, 600, 305);
  // grass blade strokes
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 130; i++) {
    const gx = rng() * 600;
    const gy = 245 + rng() * 285;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + 2, gy - 6);
    ctx.stroke();
  }
  // clover dots
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    ctx.arc(rng() * 600, 250 + rng() * 280, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  // --- stone path ---
  ctx.fillStyle = '#e6dcc3';
  ctx.beginPath();
  ctx.moveTo(272, 540);
  ctx.quadraticCurveTo(300, 420, 318, 300);
  ctx.quadraticCurveTo(324, 262, 332, 238);
  ctx.lineTo(372, 238);
  ctx.quadraticCurveTo(362, 300, 352, 420);
  ctx.quadraticCurveTo(346, 500, 344, 540);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,100,70,0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const py = 270 + i * 34;
    ctx.beginPath();
    ctx.moveTo(296 + (i % 2) * 14, py);
    ctx.lineTo(352 - (i % 2) * 8, py + 6);
    ctx.stroke();
  }
  // --- picket fence (one picket is a difference) ---
  ctx.fillStyle = '#f2ead8';
  ctx.fillRect(0, 252, 600, 5);
  ctx.fillRect(0, 272, 600, 5);
  for (let x = 8; x < 600; x += 26) {
    if (x > 505 && x < 535) continue; // the missing picket's slot
    ctx.beginPath();
    ctx.moveTo(x, 246);
    ctx.lineTo(x + 7, 238);
    ctx.lineTo(x + 14, 246);
    ctx.lineTo(x + 14, 282);
    ctx.lineTo(x, 282);
    ctx.closePath();
    ctx.fill();
  }
  // --- big apple tree, left ---
  ctx.fillStyle = '#6b4a2f';
  ctx.beginPath();
  ctx.moveTo(196, 420);
  ctx.quadraticCurveTo(200, 350, 214, 318);
  ctx.lineTo(228, 318);
  ctx.quadraticCurveTo(236, 360, 240, 420);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a3a22';
  ctx.beginPath();
  ctx.moveTo(206, 352);
  ctx.quadraticCurveTo(180, 330, 168, 306);
  ctx.lineTo(178, 300);
  ctx.quadraticCurveTo(196, 322, 212, 340);
  ctx.closePath();
  ctx.fill();
  const canopy = (cx, cy, r, col) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  canopy(190, 268, 52, '#4c8f3e');
  canopy(238, 252, 56, '#57a047');
  canopy(214, 222, 48, '#63b154');
  canopy(162, 240, 34, '#57a047');
  canopy(262, 268, 34, '#4c8f3e');
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  canopy(206, 210, 22, 'rgba(255,255,255,0.16)');
  // apples on the canopy (one is a difference)
  ctx.fillStyle = '#d93a2b';
  [[168, 262], [232, 240], [252, 282], [186, 292]].forEach(([ax, ay]) => {
    ctx.beginPath();
    ctx.arc(ax, ay, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(ax - 2, ay - 2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d93a2b';
  });
  // --- sunflowers, right (the second head's centre is a difference) ---
  sunflower(ctx, 440, 452, 1, '#6b4226');
  // --- flower beds ---
  const bedColors = ['#e85d75', '#f7c948', '#b388eb', '#ff8fab', '#ffffff'];
  for (let i = 0; i < 9; i++) {
    tulip(ctx, 36 + i * 22, 500 - (i % 3) * 8, 1, bedColors[i % bedColors.length]);
  }
  for (let i = 0; i < 7; i++) {
    tulip(ctx, 520 + (i % 4) * 20, 330 + Math.floor(i / 4) * 16, 0.9, bedColors[(i + 2) % bedColors.length]);
  }
  // daisies near the path
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 6; i++) {
    const dx = 380 + i * 16;
    const dy = 470 + (i % 2) * 22;
    for (let p = 0; p < 6; p++) {
      const a = (p / 6) * Math.PI * 2;
      ellipse(ctx, dx + Math.cos(a) * 5, dy + Math.sin(a) * 5, 3.4, 2);
    }
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
  }
  // --- pond, bottom right ---
  ctx.fillStyle = '#7cc4de';
  ellipse(ctx, 452, 492, 78, 30);
  ctx.fillStyle = '#a5d9ec';
  ellipse(ctx, 446, 488, 62, 22);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(452, 492, 58, 20, 0, 0.3, 1.2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(452, 494, 38, 12, 0, 2.2, 3.6);
  ctx.stroke();
  // --- birdhouse on its pole (roof is a difference) ---
  ctx.fillStyle = '#8a6b46';
  ctx.fillRect(116, 320, 8, 150);
  ctx.fillStyle = '#c9a86a';
  ctx.fillRect(96, 296, 48, 28);
  ctx.fillStyle = '#2c2340';
  ctx.beginPath();
  ctx.arc(120, 310, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a5a3b';
  ctx.fillRect(112, 322, 16, 4);
  // bees
  ctx.fillStyle = '#3a2c22';
  ellipse(ctx, 300, 200, 4, 3);
  ellipse(ctx, 340, 230, 4, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ellipse(ctx, 298, 196, 3, 2);
  ellipse(ctx, 338, 226, 3, 2);
  // vignette + grain
  const vg = ctx.createRadialGradient(300, 270, 200, 300, 270, 440);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(20,40,10,0.22)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, 600, 540);
  grain(ctx, makeRng(seed + 11), 600, 540, 380, 0.04);
}
