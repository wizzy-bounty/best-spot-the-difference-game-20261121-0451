// The two rounds of Harbor Lights. Each difference owns the element that
// changes: it draws its own version on the left panel and on the right one,
// so the base scenes never draw a differing element themselves.
// draw(ctx, side) is called with side 'left' or 'right' inside a panel's clip.

import { ellipse, rr, glow } from './scenes.js';
import { sunflower } from './garden.js';

function drawGull(ctx, x, y, s) {
  ctx.strokeStyle = 'rgba(30,25,50,0.85)';
  ctx.lineWidth = 2.2 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y + 3 * s);
  ctx.quadraticCurveTo(x - 3 * s, y - 5 * s, x, y);
  ctx.quadraticCurveTo(x + 3 * s, y - 5 * s, x + 9 * s, y + 3 * s);
  ctx.stroke();
}

function drawCrate(ctx, x, y, s) {
  ctx.fillStyle = '#a97c46';
  ctx.fillRect(x - 14 * s, y - 14 * s, 28 * s, 28 * s);
  ctx.strokeStyle = '#7d5a30';
  ctx.lineWidth = 2 * s;
  ctx.strokeRect(x - 14 * s, y - 14 * s, 28 * s, 28 * s);
  ctx.beginPath();
  ctx.moveTo(x - 14 * s, y - 14 * s);
  ctx.lineTo(x + 14 * s, y + 14 * s);
  ctx.moveTo(x + 14 * s, y - 14 * s);
  ctx.lineTo(x - 14 * s, y + 14 * s);
  ctx.stroke();
}

function drawCat(ctx, x, y, s) {
  ctx.fillStyle = '#2e2a33';
  ellipse(ctx, x, y + 6 * s, 13 * s, 10 * s); // body
  ctx.beginPath();
  ctx.arc(x + 8 * s, y - 6 * s, 7 * s, 0, Math.PI * 2);
  ctx.fill(); // head
  ctx.beginPath();
  ctx.moveTo(x + 3 * s, y - 11 * s);
  ctx.lineTo(x + 5 * s, y - 17 * s);
  ctx.lineTo(x + 8 * s, y - 11 * s);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x + 9 * s, y - 11 * s);
  ctx.lineTo(x + 12 * s, y - 17 * s);
  ctx.lineTo(x + 14 * s, y - 11 * s);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#2e2a33';
  ctx.lineWidth = 3 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * s, y + 8 * s);
  ctx.quadraticCurveTo(x - 20 * s, y + 2 * s, x - 16 * s, y - 8 * s);
  ctx.stroke(); // tail
}

function drawBuoy(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x + 10, y + 4);
  ctx.lineTo(x - 10, y + 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillRect(x - 10, y - 4, 20, 4);
  ctx.fillStyle = '#3a2c22';
  ctx.fillRect(x - 1.5, y - 22, 3, 6);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = color;
  ellipse(ctx, x, y + 10, 12, 3);
  ctx.globalAlpha = 1;
}

function drawDuck(ctx, x, y) {
  ctx.fillStyle = '#ffffff';
  ellipse(ctx, x, y + 2, 13, 8);
  ctx.beginPath();
  ctx.arc(x + 9, y - 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(x + 14, y - 7);
  ctx.lineTo(x + 20, y - 4);
  ctx.lineTo(x + 14, y - 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#2c2340';
  ctx.beginPath();
  ctx.arc(x + 11, y - 8, 1.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawButterfly(ctx, x, y) {
  ctx.fillStyle = '#e85d75';
  ellipse(ctx, x - 7, y - 4, 8, 6);
  ellipse(ctx, x + 7, y - 4, 8, 6);
  ctx.fillStyle = '#b388eb';
  ellipse(ctx, x - 6, y + 5, 6, 4);
  ellipse(ctx, x + 6, y + 5, 6, 4);
  ctx.strokeStyle = '#2c2340';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.stroke();
}

function drawWateringCan(ctx, x, y, spoutLeft) {
  ctx.fillStyle = '#5b8c5a';
  rr(ctx, x - 14, y - 10, 28, 22, 4);
  ctx.fill();
  ctx.fillStyle = '#4a7a49';
  ctx.fillRect(x - 14, y + 4, 28, 4);
  ctx.strokeStyle = '#5b8c5a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (spoutLeft) {
    ctx.moveTo(x - 14, y - 2);
    ctx.lineTo(x - 26, y - 12);
  } else {
    ctx.moveTo(x + 14, y - 2);
    ctx.lineTo(x + 26, y - 12);
  }
  ctx.stroke();
  ctx.strokeStyle = '#7a5a3a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + (spoutLeft ? 16 : -16), y - 4, 8, -1.2, 1.2);
  ctx.stroke();
}

function drawLamp(ctx, side) {
  const warm = side === 'left';
  const glass = warm ? '#ffe9a8' : '#ff7a6b';
  const beam = warm ? 'rgba(255,233,168,0.35)' : 'rgba(255,122,107,0.32)';
  // beam sweeping out to sea (to the left)
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(496, 142);
  ctx.lineTo(496, 158);
  ctx.lineTo(370, 196);
  ctx.lineTo(370, 176);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = glass;
  ctx.fillRect(497, 141, 16, 18);
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillRect(497, 141, 3, 18);
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.arc(505, 150, 26, 0, Math.PI * 2);
  ctx.fill();
}

export const ROUNDS = [
  {
    name: 'Harbor at Dusk',
    scene: 'harbor',
    seed: 11,
    diffs: [
      {
        id: 'gull', x: 110, y: 80, r: 26, name: 'A gull in the sky',
        hint: 'Look high, near the clouds.',
        draw(ctx, side) { if (side === 'left') drawGull(ctx, 110, 80, 1); },
      },
      {
        id: 'lamp', x: 505, y: 148, r: 30, name: 'The lighthouse lamp',
        hint: 'The light itself changed colour.',
        draw(ctx, side) { drawLamp(ctx, side); },
      },
      {
        id: 'sail', x: 362, y: 352, r: 34, name: 'The sailboat sail',
        hint: 'One sail is not the colour it was.',
        draw(ctx, side) {
          ctx.fillStyle = side === 'left' ? '#f5e6c8' : '#2a9d8f';
          ctx.beginPath();
          ctx.moveTo(352, 339);
          ctx.lineTo(352, 368);
          ctx.lineTo(374, 368);
          ctx.closePath();
          ctx.fill();
        },
      },
      {
        id: 'crate', x: 84, y: 478, r: 30, name: 'Crates on the dock',
        hint: 'Count the crates by the dock post.',
        draw(ctx, side) {
          drawCrate(ctx, 84, 492, 1);
          if (side === 'right') drawCrate(ctx, 84, 462, 1);
        },
      },
      {
        id: 'cat', x: 452, y: 482, r: 28, name: 'The dock cat',
        hint: 'Something small and dark sits on the dock.',
        draw(ctx, side) { if (side === 'left') drawCat(ctx, 452, 482, 1); },
      },
      {
        id: 'buoy', x: 300, y: 440, r: 22, name: 'The buoy',
        hint: 'Out in the water, a marker changed colour.',
        draw(ctx, side) { drawBuoy(ctx, 300, 440, side === 'left' ? '#d93a2b' : '#2fae5f'); },
      },
      {
        id: 'window', x: 91, y: 279, r: 20, name: 'A cottage window',
        hint: 'One cottage window went dark.',
        draw(ctx, side) {
          if (side === 'left') glow(ctx, 91, 279, 20, '#ffe9a8', 0.5);
          ctx.fillStyle = side === 'left' ? '#ffe9a8' : '#2c2340';
          ctx.fillRect(85, 272, 12, 14);
          ctx.fillStyle = '#2c2340';
          ctx.fillRect(85, 272, 12, 2);
          ctx.fillRect(90, 272, 2, 14);
        },
      },
    ],
  },
  {
    name: 'Garden at Morning',
    scene: 'garden',
    seed: 23,
    diffs: [
      {
        id: 'apple', x: 215, y: 285, r: 18, name: 'An apple on the tree',
        hint: 'Check the apples in the canopy.',
        draw(ctx, side) {
          if (side !== 'left') return;
          ctx.fillStyle = '#d93a2b';
          ctx.beginPath();
          ctx.arc(215, 285, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath();
          ctx.arc(213, 283, 1.8, 0, Math.PI * 2);
          ctx.fill();
        },
      },
      {
        id: 'sunflower', x: 500, y: 399, r: 26, name: 'A sunflower centre',
        hint: 'One flower head is not the colour it was.',
        draw(ctx, side) { sunflower(ctx, 500, 452, 0.85, side === 'left' ? '#6b4226' : '#e8862e'); },
      },
      {
        id: 'duck', x: 452, y: 492, r: 24, name: 'The duck on the pond',
        hint: 'Something floats on the pond.',
        draw(ctx, side) { if (side === 'left') drawDuck(ctx, 452, 490); },
      },
      {
        id: 'birdhouse', x: 120, y: 285, r: 22, name: 'The birdhouse roof',
        hint: 'The little house on the pole changed colour.',
        draw(ctx, side) {
          ctx.fillStyle = side === 'left' ? '#b8433a' : '#3a6ea5';
          ctx.beginPath();
          ctx.moveTo(92, 296);
          ctx.lineTo(148, 296);
          ctx.lineTo(120, 276);
          ctx.closePath();
          ctx.fill();
        },
      },
      {
        id: 'butterfly', x: 200, y: 180, r: 20, name: 'A butterfly',
        hint: 'Look in the open sky above the lawn.',
        draw(ctx, side) { if (side === 'left') drawButterfly(ctx, 200, 180); },
      },
      {
        id: 'can', x: 330, y: 480, r: 24, name: 'The watering can',
        hint: 'The watering can turned around.',
        draw(ctx, side) { drawWateringCan(ctx, 330, 480, side === 'left'); },
      },
      {
        id: 'picket', x: 527, y: 262, r: 16, name: 'A fence picket',
        hint: 'Walk the fence line, one slat is gone.',
        draw(ctx, side) {
          if (side !== 'left') return;
          ctx.fillStyle = '#f2ead8';
          ctx.beginPath();
          ctx.moveTo(520, 246);
          ctx.lineTo(527, 238);
          ctx.lineTo(534, 246);
          ctx.lineTo(534, 282);
          ctx.lineTo(520, 282);
          ctx.closePath();
          ctx.fill();
        },
      },
    ],
  },
];
