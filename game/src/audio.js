// All sound is synthesized with the Web Audio API — no audio files, no network.
// A soft chime for a find, a low buzz for a miss, an arpeggio for a win.

let audioCtx = null;
let muted = false;

function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, at, dur, kind, vol) {
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = kind;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, c.currentTime + at);
  gain.gain.linearRampToValueAtTime(vol, c.currentTime + at + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime + at);
  osc.stop(c.currentTime + at + dur + 0.05);
}

export const sfx = {
  get muted() {
    return muted;
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  click() {
    if (muted) return;
    tone(660, 0, 0.06, 'sine', 0.08);
  },
  find() {
    if (muted) return;
    tone(523.25, 0, 0.18, 'sine', 0.16);
    tone(783.99, 0.09, 0.24, 'sine', 0.14);
  },
  wrong() {
    if (muted) return;
    tone(140, 0, 0.22, 'sawtooth', 0.1);
  },
  hint() {
    if (muted) return;
    tone(880, 0, 0.12, 'triangle', 0.1);
  },
  win() {
    if (muted) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.11, 0.3, 'sine', 0.15));
  },
  lose() {
    if (muted) return;
    [392, 311, 233].forEach((f, i) => tone(f, i * 0.16, 0.3, 'triangle', 0.12));
  },
};
