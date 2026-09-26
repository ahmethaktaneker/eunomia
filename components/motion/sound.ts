/** Synthesised interface sounds (no audio files). Off unless the visitor turns them on. */

const KEY = "eu-sound";
export const SOUND_EVENT = "eu-sound-change";
let ctx: AudioContext | null = null;
let lastTick = 0;

export function soundOn() {
  try { return localStorage.getItem(KEY) === "on"; } catch { return false; }
}

export function setSound(on: boolean) {
  try { localStorage.setItem(KEY, on ? "on" : "off"); } catch {}
  window.dispatchEvent(new Event(SOUND_EVENT));
  if (on) chime();
}

function audio() {
  if (!soundOn()) return null;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** A faint high blip for hovering links. Throttled so sweeping the pointer stays quiet. */
export function tick() {
  const a = audio();
  if (!a || performance.now() - lastTick < 70) return;
  lastTick = performance.now();
  const osc = a.createOscillator(), gain = a.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2400, a.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1500, a.currentTime + 0.05);
  gain.gain.setValueAtTime(0.018, a.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + 0.06);
  osc.connect(gain).connect(a.destination);
  osc.start(); osc.stop(a.currentTime + 0.07);
}

/** A soft paper sweep for page transitions: filtered noise with a moving band. */
export function turn() {
  const a = audio();
  if (!a) return;
  const len = 0.55, buffer = a.createBuffer(1, a.sampleRate * len, a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = a.createBufferSource(), filter = a.createBiquadFilter(), gain = a.createGain();
  src.buffer = buffer;
  filter.type = "bandpass"; filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(700, a.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3200, a.currentTime + len);
  gain.gain.setValueAtTime(0.0001, a.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, a.currentTime + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + len);
  src.connect(filter).connect(gain).connect(a.destination);
  src.start();
}

/** Two-note gold chime, used to confirm sound was switched on. */
export function chime() {
  const a = audio();
  if (!a) return;
  [659.25, 987.77].forEach((f, i) => {
    const osc = a.createOscillator(), gain = a.createGain(), t = a.currentTime + i * 0.09;
    osc.type = "triangle"; osc.frequency.value = f;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.05, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    osc.connect(gain).connect(a.destination);
    osc.start(t); osc.stop(t + 0.75);
  });
}
