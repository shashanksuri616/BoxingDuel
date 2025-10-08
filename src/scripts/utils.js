// Utility functions for the game

// Returns a random integer between min and max (inclusive)
export function randomDamage(min = 5, max = 15) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Plays an audio element from the start
export function playSound(audioElement) {
  if (!audioElement) return;
  audioElement.currentTime = 0;
  audioElement.play();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export { getRandomInt, detectCollision, lerp, clamp };