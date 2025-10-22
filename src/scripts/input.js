// Setup input handlers. onPunch(playerNum)

export function setupInput(onPunch) {
  if (typeof onPunch !== 'function') throw new Error('setupInput requires onPunch callback');

  function keyHandler(e) {
    if (e.repeat) return;
    if (e.code === 'KeyA') onPunch(1);
    if (e.code === 'KeyL') onPunch(2);
  }
  document.addEventListener('keydown', keyHandler);

  // create simple on-screen controls for touch (only if small screens)
  const touchButtons = [];
  if ('ontouchstart' in window) {
    const b1 = document.createElement('button');
    b1.textContent = 'A';
    b1.className = 'touch-btn';
    b1.style.position = 'fixed';
    b1.style.left = '12px';
    b1.style.bottom = '12px';
    b1.style.zIndex = 120;
    b1.addEventListener('touchstart', (ev) => { ev.preventDefault(); onPunch(1); });
    document.body.appendChild(b1);
    touchButtons.push(b1);

    const b2 = document.createElement('button');
    b2.textContent = 'L';
    b2.className = 'touch-btn';
    b2.style.position = 'fixed';
    b2.style.right = '12px';
    b2.style.bottom = '12px';
    b2.style.zIndex = 120;
    b2.addEventListener('touchstart', (ev) => { ev.preventDefault(); onPunch(2); });
    document.body.appendChild(b2);
    touchButtons.push(b2);
  }

  return function cleanup() {
    document.removeEventListener('keydown', keyHandler);
    touchButtons.forEach(b => { if (b.parentNode) b.parentNode.removeChild(b); });
  };
}