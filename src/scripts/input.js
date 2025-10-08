// Handles keyboard input for both players

export function setupInput(onPunch) {
  // onPunch(playerNum) is a callback: 1 for Player 1 (A), 2 for Player 2 (L)
  function handler(e) {
    if (e.repeat) return; // ignore held keys
    if (e.code === 'KeyA') onPunch(1);
    if (e.code === 'KeyL') onPunch(2);
  }
  document.addEventListener('keydown', handler);

  // Return a cleanup function in case you want to remove the listener later
  return () => document.removeEventListener('keydown', handler);
}