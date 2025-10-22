// Small utility library for the game

// random integer inclusive
export function randomDamage(min = 5, max = 15) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// safe audio play that handles promises/autoplay issues
export async function safePlayAudio(audioEl, volume = 1) {
  if (!audioEl) return;
  try {
    audioEl.volume = Math.max(0, Math.min(1, volume));
    audioEl.currentTime = 0;
    await audioEl.play();
  } catch (err) {
    // autoplay blocked or other play error — ignore silently
    // console.debug('Audio play blocked', err);
  }
}

// Axis-aligned bounding box collision (simple)
export function detectCollision(a, b) {
  return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
}

// get element rect relative to containerRect
export function rectRelativeTo(el, containerRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - containerRect.left,
    y: r.top - containerRect.top,
    width: r.width,
    height: r.height
  };
}

// clamp helper
export function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }