// Small utility library for the game

/**
 * Return a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomDamage(min = 5, max = 15) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Safely attempt to play an <audio> element, handling autoplay promise rejections.
 * @param {HTMLMediaElement} audioEl
 * @param {number} volume 0..1
 */
export async function safePlayAudio(audioEl, volume = 1) {
  if (!audioEl) return;
  try {
    audioEl.volume = Math.max(0, Math.min(1, volume));
    audioEl.currentTime = 0;
    const p = audioEl.play();
    if (p && typeof p.then === 'function') await p;
  } catch (err) {
    // Autoplay blocked or other error; fail silently
  }
}

/**
 * Axis-aligned bounding-box collision test.
 * Boxes are { x, y, width, height } in the same coordinate space.
 * @param {{x:number,y:number,width:number,height:number}} a
 * @param {{x:number,y:number,width:number,height:number}} b
 * @returns {boolean}
 */
export function detectCollision(a, b) {
  if (!a || !b) return false;
  return !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
}

/**
 * Get element rect relative to a container rect (both DOMRects).
 * @param {Element} el
 * @param {DOMRect} containerRect
 * @returns {{x:number,y:number,width:number,height:number}}
 */
export function rectRelativeTo(el, containerRect) {
  const r = el.getBoundingClientRect();
  return {
    x: Math.round(r.left - containerRect.left),
    y: Math.round(r.top - containerRect.top),
    width: Math.round(r.width),
    height: Math.round(r.height)
  };
}

/**
 * Clamp value between a and b.
 * @param {number} v
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}