// // Main game logic, now using modules

// import { Player } from './player.js';
// import { setupInput } from './input.js';
// import { randomDamage, playSound } from './utils.js';

// // --- DOM Elements ---
// const startScreen = document.getElementById('start-screen');
// const arenaScreen = document.getElementById('arena-screen');
// const endOverlay = document.getElementById('end-overlay');
// const startBtn = document.getElementById('start-btn');
// const restartBtn = document.getElementById('restart-btn');
// const winnerText = document.getElementById('winner-text');
// const koText = document.getElementById('ko-text');
// const hp1 = document.getElementById('hp1');
// const hp2 = document.getElementById('hp2');
// const fighter1 = document.getElementById('fighter1');
// const fighter2 = document.getElementById('fighter2');
// const damageFloat1 = document.getElementById('damage-float-1');
// const damageFloat2 = document.getElementById('damage-float-2');

// // --- Audio ---
// const bgMusic = document.getElementById('bg-music');
// const punchSound = document.getElementById('punch-sound');
// const hitSound = document.getElementById('hit-sound');
// const koSound = document.getElementById('ko-sound');
// const victorySound = document.getElementById('victory-sound');

// // --- Game State ---
// const player1 = new Player('PLAYER 1', '#ff4757');
// const player2 = new Player('PLAYER 2', '#1e90ff');
// let gameActive = false;
// const PUNCH_COOLDOWN = 700; // ms

// // --- Utility Functions ---
// function updateHPBar() {
//   hp1.style.width = player1.hp + '%';
//   hp2.style.width = player2.hp + '%';
// }

// function showDamage(playerNum, dmg) {
//   const float = playerNum === 1 ? damageFloat2 : damageFloat1;
//   float.textContent = `-${dmg}`;
//   float.style.opacity = 1;
//   float.style.top = '60px';
//   float.style.transition = 'none';
//   setTimeout(() => {
//     float.style.transition = 'opacity 0.5s, top 0.5s';
//     float.style.opacity = 0;
//     float.style.top = '10px';
//   }, 50);
// }

// function animateFighterPunch(fighter, isLeft) {
//   fighter.style.animation = isLeft ? 'punch 0.25s' : 'punch-left 0.25s';
//   setTimeout(() => {
//     fighter.style.animation = '';
//   }, 250);
// }

// function animateFighterHit(fighter) {
//   fighter.style.animation = 'hitFlash 0.2s, shake 0.3s';
//   setTimeout(() => {
//     fighter.style.animation = '';
//   }, 300);
// }

// function animateKO() {
//   koText.textContent = 'KO!';
//   koText.style.opacity = 1;
//   koText.style.animation = 'fadeIn 0.5s ease-out';
//   setTimeout(() => {
//     koText.style.animation = 'fadeOut 0.7s 1.2s forwards';
//   }, 1200);
// }

// function resetFighters() {
//   player1.reset();
//   player2.reset();
//   updateHPBar();
//   koText.textContent = '';
//   koText.style.opacity = 0;
//   fighter1.style.animation = '';
//   fighter2.style.animation = '';
//   damageFloat1.textContent = '';
//   damageFloat2.textContent = '';
//   damageFloat1.style.opacity = 0;
//   damageFloat2.style.opacity = 0;
// }

// // --- Game Flow ---
// function startGame() {
//   startScreen.style.display = 'none';
//   arenaScreen.style.display = 'block';
//   endOverlay.style.display = 'none';
//   resetFighters();
//   gameActive = true;
//   bgMusic.volume = 0.3;
//   bgMusic.play();
// }

// function endGame(winner) {
//   gameActive = false;
//   setTimeout(() => {
//     endOverlay.style.display = 'flex';
//     winnerText.textContent = `PLAYER ${winner} WINS!`;
//     playSound(victorySound);
//   }, 1800);
// }

// function restartGame() {
//   endOverlay.style.display = 'none';
//   koText.textContent = '';
//   koText.style.opacity = 0;
//   resetFighters();
//   gameActive = true;
//   bgMusic.play();
// }

// // --- Combat Logic ---
// function handlePunch(playerNum) {
//   if (!gameActive) return;
//   if (playerNum === 1 && player1.canPunch && player2.isAlive()) {
//     player1.canPunch = false;
//     animateFighterPunch(fighter1, true);
//     playSound(punchSound);
//     setTimeout(() => {
//       const dmg = randomDamage();
//       player2.setHP(player2.hp - dmg);
//       updateHPBar();
//       showDamage(1, dmg);
//       animateFighterHit(fighter2);
//       playSound(hitSound);
//       if (!player2.isAlive()) {
//         animateKO();
//         playSound(koSound);
//         setTimeout(() => {
//           fighter1.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
//         }, 900);
//         endGame(1);
//       }
//     }, 120);
//     setTimeout(() => { player1.canPunch = true; }, PUNCH_COOLDOWN);
//   }
//   if (playerNum === 2 && player2.canPunch && player1.isAlive()) {
//     player2.canPunch = false;
//     animateFighterPunch(fighter2, false);
//     playSound(punchSound);
//     setTimeout(() => {
//       const dmg = randomDamage();
//       player1.setHP(player1.hp - dmg);
//       updateHPBar();
//       showDamage(2, dmg);
//       animateFighterHit(fighter1);
//       playSound(hitSound);
//       if (!player1.isAlive()) {
//         animateKO();
//         playSound(koSound);
//         setTimeout(() => {
//           fighter2.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
//         }, 900);
//         endGame(2);
//       }
//     }, 120);
//     setTimeout(() => { player2.canPunch = true; }, PUNCH_COOLDOWN);
//   }
// }

// // --- Input Handling ---
// setupInput(handlePunch);

// // --- Button Events ---
// startBtn.addEventListener('click', startGame);
// restartBtn.addEventListener('click', () => {
//   restartGame();
//   endOverlay.style.display = 'none';
// });

// // --- Idle Animation ---
// function idleBreathing() {
//   if (!gameActive) return;
//   fighter1.style.animation = 'breathing 2s infinite';
//   fighter2.style.animation = 'breathing 2s infinite';
// }
// setInterval(idleBreathing, 2000);

// // --- Initial State ---
// updateHPBar();
// koText.textContent = '';
// koText.style.opacity = 0;
// damageFloat1.style.opacity = 0;
// damageFloat2.style.opacity = 0;

// // --- Settings/Credits Screen Logic ---
// const settingsBtn = document.getElementById('settings-btn');
// const settingsScreen = document.getElementById('settings-screen');
// const closeSettingsBtn = document.getElementById('close-settings-btn');

// settingsBtn.addEventListener('click', () => {
//   startScreen.style.display = 'none';
//   settingsScreen.style.display = 'flex';
// });

// closeSettingsBtn.addEventListener('click', () => {
//   settingsScreen.style.display = 'none';
//   startScreen.style.display = 'flex';
// });
// ===============================
// 🎮 Boxing Duel: Main Game Logic
// ===============================

import { Player } from './player.js';
import { setupInput } from './input.js';
import { randomDamage, playSound, detectCollision } from './utils.js';

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const arenaScreen = document.getElementById('arena-screen');
const endOverlay = document.getElementById('end-overlay');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const winnerText = document.getElementById('winner-text');
const koText = document.getElementById('ko-text');
const hp1 = document.getElementById('hp1');
const hp2 = document.getElementById('hp2');
const fighter1 = document.getElementById('fighter1');
const fighter2 = document.getElementById('fighter2');
const damageFloat1 = document.getElementById('damage-float-1');
const damageFloat2 = document.getElementById('damage-float-2');
const arena = document.getElementById('arena');

// --- Audio ---
const bgMusic = document.getElementById('bg-music');
const punchSound = document.getElementById('punch-sound');
const hitSound = document.getElementById('hit-sound');
const koSound = document.getElementById('ko-sound');
const victorySound = document.getElementById('victory-sound');

// --- Game State ---
const player1 = new Player('PLAYER 1', '#ff4757');
const player2 = new Player('PLAYER 2', '#1e90ff');
let gameActive = false;

// --- Combat / Timing Config (tweak to change feel) ---
const PUNCH_COOLDOWN = 700;   // ms total cooldown
const PUNCH_STARTUP = 100;    // ms before attack becomes active (wind-up)
const PUNCH_ACTIVE = 140;     // ms window where the hitbox can connect
const HIT_RANGE = 80;         // px reach from fighter edge
const HITBOX_HEIGHT = 60;     // px vertical size of the attack hitbox

// --- Utility Functions ---
function updateHPBar() {
  hp1.style.width = (player1.hp / player1.maxHP * 100) + '%';
  hp2.style.width = (player2.hp / player2.maxHP * 100) + '%';
}

function worldRect(el) {
  const r = el.getBoundingClientRect();
  const a = arena.getBoundingClientRect();
  // convert to arena-local coordinates
  return {
    x: r.left - a.left,
    y: r.top - a.top,
    width: r.width,
    height: r.height
  };
}

function makeAttackHitbox(fighterEl, isLeft) {
  const f = worldRect(fighterEl);
  if (isLeft) {
    return {
      x: f.x + f.width, // start at fighter right edge
      y: f.y + (f.height - HITBOX_HEIGHT) / 2,
      width: HIT_RANGE,
      height: HITBOX_HEIGHT
    };
  } else {
    // attack to the left
    return {
      x: f.x - HIT_RANGE,
      y: f.y + (f.height - HITBOX_HEIGHT) / 2,
      width: HIT_RANGE,
      height: HITBOX_HEIGHT
    };
  }
}

function showDamage(playerNum, dmg) {
  const float = playerNum === 1 ? damageFloat2 : damageFloat1;
  const targetFighter = playerNum === 1 ? fighter2 : fighter1;
  const fRect = worldRect(targetFighter);
  // position near opponent
  float.style.left = (fRect.x + fRect.width / 2) + 'px';
  float.style.top = (fRect.y - 20) + 'px';
  float.textContent = `-${dmg}`;
  float.style.opacity = 1;
  float.style.transition = 'none';
  setTimeout(() => {
    float.style.transition = 'opacity 0.6s, top 0.6s';
    float.style.opacity = 0;
    float.style.top = (fRect.y - 60) + 'px';
  }, 30);
}

function animateFighterPunch(fighter, isLeft) {
  fighter.style.animation = isLeft ? 'punch 0.25s' : 'punch-left 0.25s';
  setTimeout(() => { fighter.style.animation = ''; }, 260);
}

function animateFighterHit(fighter) {
  fighter.style.animation = 'hitFlash 0.2s, shake 0.3s';
  setTimeout(() => { fighter.style.animation = ''; }, 320);
}

function animateKO() {
  koText.textContent = 'KO!';
  koText.style.opacity = 1;
  koText.style.animation = 'fadeIn 0.5s ease-out';
  setTimeout(() => {
    koText.style.animation = 'fadeOut 0.7s 1.2s forwards';
  }, 1200);
}

function resetFighters() {
  player1.reset();
  player2.reset();
  updateHPBar();
  koText.textContent = '';
  koText.style.opacity = 0;
  fighter1.style.animation = '';
  fighter2.style.animation = '';
  damageFloat1.textContent = '';
  damageFloat2.textContent = '';
  damageFloat1.style.opacity = 0;
  damageFloat2.style.opacity = 0;
  fighter1.removeAttribute('data-cooldown');
  fighter2.removeAttribute('data-cooldown');
}

// --- Game Flow ---
function startGame() {
  startScreen.style.display = 'none';
  arenaScreen.style.display = 'block';
  endOverlay.style.display = 'none';
  resetFighters();
  gameActive = true;
  bgMusic.volume = 0.3;
  // play after user interaction (startBtn click ensures user gesture)
  try { bgMusic.play(); } catch(e) { /* autoplay blocked fallback */ }
}

function endGame(winner) {
  gameActive = false;
  animateKO();
  playSound(koSound);
  // Victory sound and overlay after KO
  setTimeout(() => { playSound(victorySound); }, 600);
  // Show overlay + restart after 3s (per GDD)
  setTimeout(() => {
    endOverlay.style.display = 'flex';
    winnerText.textContent = `PLAYER ${winner} WINS!`;
  }, 3000);
}

function restartGame() {
  endOverlay.style.display = 'none';
  koText.textContent = '';
  koText.style.opacity = 0;
  resetFighters();
  gameActive = true;
  try { bgMusic.play(); } catch(e) {}
}

// --- Combat Logic (with hitbox & active frames) ---
function handlePunch(playerNum) {
  if (!gameActive) return;
  const actor = playerNum === 1 ? player1 : player2;
  const target = playerNum === 1 ? player2 : player1;
  const actorEl = playerNum === 1 ? fighter1 : fighter2;
  const targetEl = playerNum === 1 ? fighter2 : fighter1;
  const isLeft = playerNum === 1;

  if (!actor.canPunch || !target.isAlive()) return;

  // set cooldown flag + visual attribute (CSS can style [data-cooldown])
  actor.canPunch = false;
  actorEl.setAttribute('data-cooldown', '1');
  setTimeout(() => { actor.canPunch = true; actorEl.removeAttribute('data-cooldown'); }, PUNCH_COOLDOWN);

  // play windup sound/animation
  animateFighterPunch(actorEl, isLeft);
  playSound(punchSound);

  // after startup, active frames open
  setTimeout(() => {
    // compute attack hitbox relative to arena
    const attackBox = makeAttackHitbox(actorEl, isLeft);
    const targetBox = worldRect(targetEl);

    // debug visualizations
    drawDebugBox(attackBox, 'debug-hitbox');
    drawDebugBox(targetBox, 'debug-target');

    // check collision using simple AABB
    const hit = detectCollision(attackBox, targetBox);

    if (hit) {
      const dmg = randomDamage();
      target.setHP(target.hp - dmg);
      updateHPBar();
      showDamage(playerNum, dmg);
      animateFighterHit(targetEl);
      playSound(hitSound);

      if (!target.isAlive()) {
        // winner pose
        setTimeout(() => {
          const winnerEl = playerNum === 1 ? fighter1 : fighter2;
          winnerEl.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
        }, 600);
        endGame(playerNum);
      }
    } else {
      // miss feedback (small recoil)
      actorEl.style.transform = 'translateY(-6px)';
      setTimeout(() => { actorEl.style.transform = ''; }, 120);
    }
  }, PUNCH_STARTUP);

  // active window ends automatically; no further action needed
}

// --- Debug Hitbox Helpers ---
let debugMode = false;
const _debugEls = [];

function clearDebug() {
  while (_debugEls.length) {
    const el = _debugEls.pop();
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }
  arena.classList.remove('debug');
}

function drawDebugBox(box, className = 'debug-hitbox', lifetime = 800) {
  if (!debugMode) return;
  const el = document.createElement('div');
  el.className = className;
  el.style.left = box.x + 'px';
  el.style.top = box.y + 'px';
  el.style.width = box.width + 'px';
  el.style.height = box.height + 'px';
  arena.appendChild(el);
  _debugEls.push(el);
  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
    const idx = _debugEls.indexOf(el);
    if (idx >= 0) _debugEls.splice(idx, 1);
  }, lifetime);
}

function toggleDebug() {
  debugMode = !debugMode;
  if (!debugMode) clearDebug();
  else arena.classList.add('debug');
  console.log('Debug hitboxes:', debugMode ? 'ON' : 'OFF');
}

// add key toggle (` key / Backquote)
document.addEventListener('keydown', (e) => {
  if (e.code === 'Backquote') toggleDebug();
});

// --- Input Handling ---
const cleanupInput = setupInput(handlePunch);

// --- Button Events ---
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => { restartGame(); endOverlay.style.display = 'none'; });

// Settings screen handlers (if present)
const settingsBtn = document.getElementById('settings-btn');
const settingsScreen = document.getElementById('settings-screen');
const closeSettingsBtn = document.getElementById('close-settings-btn');
if (settingsBtn && settingsScreen && closeSettingsBtn) {
  settingsBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    settingsScreen.style.display = 'flex';
  });
  closeSettingsBtn.addEventListener('click', () => {
    settingsScreen.style.display = 'none';
    startScreen.style.display = 'flex';
  });
}

// --- Idle Animation ---
function idleBreathing() {
  if (!gameActive) return;
  fighter1.style.animation = 'breathing 2s infinite';
  fighter2.style.animation = 'breathing 2s infinite';
}
setInterval(idleBreathing, 2000);

// --- Initial State ---
updateHPBar();
koText.textContent = '';
koText.style.opacity = 0;
damageFloat1.style.opacity = 0;
damageFloat2.style.opacity = 0;
