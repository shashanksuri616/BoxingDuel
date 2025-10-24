import { Player } from './player.js';
import { setupInput } from './input.js';
import { randomDamage, safePlayAudio, detectCollision, rectRelativeTo } from './utils.js';

// DOM helpers
const q = (id) => document.getElementById(id);

// DOM elements
const startScreen = q('start-screen');
const arenaScreen = q('arena-screen');
const endOverlay = q('end-overlay');
const startBtn = q('start-btn');
const restartBtn = q('restart-btn');
const winnerText = q('winner-text');
const koText = q('ko-text');
const hp1 = q('hp1');
const hp2 = q('hp2');
const fighter1 = q('fighter1');
const fighter2 = q('fighter2');
const damageFloat1 = q('damage-float-1');
const damageFloat2 = q('damage-float-2');
const arena = q('arena');

const bgMusic = q('bg-music');
const punchSound = q('punch-sound');
const hitSound = q('hit-sound');
const koSound = q('ko-sound');
const victorySound = q('victory-sound');

// players & state
const player1 = new Player('PLAYER 1', '#ff4757');
const player2 = new Player('PLAYER 2', '#1e90ff');
let gameActive = false;

// combat config
const PUNCH_COOLDOWN = 700; // ms
const PUNCH_STARTUP = 100;  // ms before active window
const HIT_RANGE = 80;       // px reach
const HITBOX_HEIGHT = 60;   // px

// util: update HP bars
function updateHPBar() {
  hp1.style.width = (player1.hp / player1.maxHP * 100) + '%';
  hp2.style.width = (player2.hp / player2.maxHP * 100) + '%';
}

// rect helpers (arena-local)
function worldRect(el) {
  return rectRelativeTo(el, arena.getBoundingClientRect());
}

function makeAttackHitbox(fighterEl, isLeft) {
  const f = worldRect(fighterEl);
  const y = f.y + (f.height - HITBOX_HEIGHT) / 2;
  if (isLeft) return { x: f.x + f.width, y, width: HIT_RANGE, height: HITBOX_HEIGHT };
  return { x: f.x - HIT_RANGE, y, width: HIT_RANGE, height: HITBOX_HEIGHT };
}

// damage float
function showDamage(playerNum, dmg) {
  const float = playerNum === 1 ? damageFloat2 : damageFloat1;
  const targetEl = playerNum === 1 ? fighter2 : fighter1;
  const rect = worldRect(targetEl);
  float.style.left = (rect.x + rect.width / 2) + 'px';
  float.style.top = (rect.y - 20) + 'px';
  float.textContent = `-${dmg}`;
  float.style.opacity = 1;
  float.style.transition = 'none';
  requestAnimationFrame(() => {
    float.style.transition = 'opacity 0.6s, top 0.6s';
    float.style.opacity = 0;
    float.style.top = (rect.y - 60) + 'px';
  });
}

// animations
function animateFighterPunch(el, isLeft) {
  el.style.animation = isLeft ? 'punch 0.25s' : 'punch-left 0.25s';
  setTimeout(() => { el.style.animation = ''; }, 260);
}
function animateFighterHit(el) {
  el.style.animation = 'hitFlash 0.2s, shake 0.3s';
  setTimeout(() => { el.style.animation = ''; }, 320);
}
function animateKO() {
  koText.textContent = 'KO!';
  koText.style.opacity = 1;
  koText.style.animation = 'fadeIn 0.5s ease-out';
  setTimeout(() => { koText.style.animation = 'fadeOut 0.7s 1.2s forwards'; }, 1200);
}

// reset
function resetFighters() {
  player1.reset();
  player2.reset();
  updateHPBar();
  koText.textContent = '';
  koText.style.opacity = 0;
  fighter1.style.animation = fighter2.style.animation = '';
  damageFloat1.style.opacity = damageFloat2.style.opacity = 0;
  fighter1.removeAttribute('data-cooldown');
  fighter2.removeAttribute('data-cooldown');
}

// Debug drawing
let debugMode = false;
const debugEls = [];
function drawDebugBox(box, cls = 'debug-hitbox', ttl = 800) {
  if (!debugMode) return;
  const d = document.createElement('div');
  d.className = cls;
  d.style.left = box.x + 'px';
  d.style.top = box.y + 'px';
  d.style.width = box.width + 'px';
  d.style.height = box.height + 'px';
  arena.appendChild(d);
  debugEls.push(d);
  setTimeout(() => { if (d.parentNode) d.parentNode.removeChild(d); const i = debugEls.indexOf(d); if (i >= 0) debugEls.splice(i, 1); }, ttl);
}
function toggleDebug() {
  debugMode = !debugMode;
  if (!debugMode) { debugEls.forEach(e => e.remove()); debugEls.length = 0; arena.classList.remove('debug'); }
  else arena.classList.add('debug');
  console.info('Debug hitboxes', debugMode);
}
document.addEventListener('keydown', (e) => { if (e.code === 'Backquote') toggleDebug(); });

// game flow
async function startGame() {
  startScreen.style.display = 'none';
  arenaScreen.style.display = 'block';
  endOverlay.style.display = 'none';
  resetFighters();
  gameActive = true;
  try { await safePlayAudio(bgMusic, 0.28); } catch (e) { /* ignore */ }
}
function endGame(winner) {
  gameActive = false;
  animateKO();
  safePlayAudio(koSound, 0.8);
  setTimeout(() => safePlayAudio(victorySound, 0.9), 600);
  setTimeout(() => {
    endOverlay.style.display = 'flex';
    winnerText.textContent = `PLAYER ${winner} WINS!`;
  }, 3000);
}
function restartGame() {
  endOverlay.style.display = 'none';
  resetFighters();
  gameActive = true;
  safePlayAudio(bgMusic, 0.28);
}

// combat logic with hitbox and startup
function handlePunch(playerNum) {
  if (!gameActive) return;
  const actor = playerNum === 1 ? player1 : player2;
  const target = playerNum === 1 ? player2 : player1;
  const actorEl = playerNum === 1 ? fighter1 : fighter2;
  const targetEl = playerNum === 1 ? fighter2 : fighter1;
  const isLeft = playerNum === 1;

  if (!actor.canPunch || !target.isAlive()) return;

  // set cooldown
  actor.canPunch = false;
  actorEl.setAttribute('data-cooldown', '1');
  setTimeout(() => { actor.canPunch = true; actorEl.removeAttribute('data-cooldown'); }, PUNCH_COOLDOWN);

  // wind-up
  animateFighterPunch(actorEl, isLeft);
  safePlayAudio(punchSound, 0.9);

  // active frame after startup
  setTimeout(() => {
    const attackBox = makeAttackHitbox(actorEl, isLeft);
    const targetBox = worldRect(targetEl);

    drawDebugBox(attackBox, 'debug-hitbox');
    drawDebugBox(targetBox, 'debug-target');

    const hit = detectCollision(attackBox, targetBox);
    if (hit) {
      const dmg = randomDamage();
      target.setHP(target.hp - dmg);
      updateHPBar();
      showDamage(playerNum, dmg);
      animateFighterHit(targetEl);
      safePlayAudio(hitSound, 0.85);

      if (!target.isAlive()) {
        setTimeout(() => {
          const winnerEl = playerNum === 1 ? fighter1 : fighter2;
          winnerEl.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
        }, 600);
        endGame(playerNum);
      }
    } else {
      // miss feedback
      actorEl.style.transform = 'translateY(-6px)';
      setTimeout(() => { actorEl.style.transform = ''; }, 120);
    }
  }, PUNCH_STARTUP);
}

// input wiring + cleanup
const cleanupInput = setupInput(handlePunch);

// buttons
startBtn?.addEventListener('click', startGame);
restartBtn?.addEventListener('click', () => { restartGame(); endOverlay.style.display = 'none'; });

// settings overlay (if present)
const settingsBtn = q('settings-btn');
const settingsScreen = q('settings-screen');
const closeSettingsBtn = q('close-settings-btn');
if (settingsBtn && settingsScreen && closeSettingsBtn) {
  settingsBtn.addEventListener('click', () => { startScreen.style.display = 'none'; settingsScreen.style.display = 'flex'; });
  closeSettingsBtn.addEventListener('click', () => { settingsScreen.style.display = 'none'; startScreen.style.display = 'flex'; });
}

// idle breathing
setInterval(() => {
  if (!gameActive) return;
  fighter1.style.animation = fighter2.style.animation = 'breathing 2s infinite';
}, 2000);

// cleanup on unload
window.addEventListener('beforeunload', () => { cleanupInput?.(); });

// init
updateHPBar();
koText.textContent = '';
koText.style.opacity = 0;
damageFloat1.style.opacity = damageFloat2.style.opacity = 0;
