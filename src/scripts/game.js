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
import { randomDamage, playSound } from './utils.js';

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

// --- Audio ---
const bgMusic = document.getElementById('bg-music');
const punchSound = document.getElementById('punch-sound');
const hitSound = document.getElementById('hit-sound');
const koSound = document.getElementById('ko-sound');
const victorySound = document.getElementById('victory-sound');

// --- Settings ---
const settingsBtn = document.getElementById('settings-btn');
const settingsScreen = document.getElementById('settings-screen');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const volumeSlider = document.getElementById('volume-slider');

// --- Game State ---
const player1 = new Player('PLAYER 1', '#ff4757');
const player2 = new Player('PLAYER 2', '#1e90ff');
let gameActive = false;
let isPaused = false;
const PUNCH_COOLDOWN = 700; // ms

// ===============================
// 🔧 Utility Functions
// ===============================

function updateHPBar() {
  hp1.style.width = player1.hp + '%';
  hp2.style.width = player2.hp + '%';
}

function showDamage(playerNum, dmg) {
  const float = playerNum === 1 ? damageFloat2 : damageFloat1;
  float.textContent = `-${dmg}`;
  float.style.opacity = 1;
  float.style.top = '60px';
  float.style.transition = 'none';

  requestAnimationFrame(() => {
    float.style.transition = 'opacity 0.5s, top 0.5s';
    float.style.opacity = 0;
    float.style.top = '10px';
  });
}

function animateFighterPunch(fighter, isLeft) {
  fighter.style.animation = isLeft ? 'punch 0.25s' : 'punch-left 0.25s';
  setTimeout(() => (fighter.style.animation = ''), 250);
}

function animateFighterHit(fighter) {
  fighter.style.animation = 'hitFlash 0.2s, shake 0.3s';
  setTimeout(() => (fighter.style.animation = ''), 300);
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

  [fighter1, fighter2].forEach(f => (f.style.animation = ''));
  [damageFloat1, damageFloat2].forEach(d => {
    d.textContent = '';
    d.style.opacity = 0;
  });

  koText.textContent = '';
  koText.style.opacity = 0;
}

// ===============================
// 🎬 Game Flow Control
// ===============================

function startGame() {
  fadeTransition(startScreen, arenaScreen);

  resetFighters();
  gameActive = false;
  isPaused = false;

  // Show "READY" text briefly before starting
  koText.textContent = 'READY...';
  koText.style.opacity = 1;
  koText.style.animation = 'fadeIn 0.4s ease';
  setTimeout(() => {
    koText.textContent = 'FIGHT!';
  }, 600);
  setTimeout(() => {
    koText.textContent = '';
    koText.style.opacity = 0;
    gameActive = true;
  }, 1200);

  bgMusic.volume = getVolume();
  bgMusic.play();
}

function endGame(winner) {
  gameActive = false;
  setTimeout(() => {
    endOverlay.style.display = 'flex';
    winnerText.textContent = `PLAYER ${winner} WINS!`;
    playSound(victorySound);
  }, 1800);
}

function restartGame() {
  fadeTransition(endOverlay, arenaScreen);
  resetFighters();
  gameActive = true;
  bgMusic.play();
}

function fadeTransition(fromEl, toEl) {
  fromEl.style.opacity = 1;
  fromEl.style.transition = 'opacity 0.5s';
  fromEl.style.opacity = 0;
  setTimeout(() => {
    fromEl.style.display = 'none';
    toEl.style.display = 'block';
    toEl.style.opacity = 0;
    toEl.style.transition = 'opacity 0.5s';
    requestAnimationFrame(() => (toEl.style.opacity = 1));
  }, 500);
}

// ===============================
// 🥊 Combat Logic
// ===============================

function handlePunch(playerNum) {
  if (!gameActive || isPaused) return;

  const attacker = playerNum === 1 ? player1 : player2;
  const defender = playerNum === 1 ? player2 : player1;
  const attackerFighter = playerNum === 1 ? fighter1 : fighter2;
  const defenderFighter = playerNum === 1 ? fighter2 : fighter1;

  if (!attacker.canPunch || !defender.isAlive()) return;

  attacker.canPunch = false;
  animateFighterPunch(attackerFighter, playerNum === 1);
  playSound(punchSound);

  setTimeout(() => {
    const dmg = randomDamage();
    defender.setHP(defender.hp - dmg);
    updateHPBar();
    showDamage(playerNum, dmg);
    animateFighterHit(defenderFighter);
    playSound(hitSound);

    if (!defender.isAlive()) {
      animateKO();
      playSound(koSound);
      setTimeout(() => {
        attackerFighter.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
      }, 900);
      endGame(playerNum);
    }
  }, 120);

  setTimeout(() => (attacker.canPunch = true), PUNCH_COOLDOWN);
}

// ===============================
// ⌨️ Input + Shortcuts
// ===============================

setupInput(handlePunch);

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'r' && !gameActive) restartGame();
  if (e.key.toLowerCase() === 'p') togglePause();
});

function togglePause() {
  if (!gameActive) return;
  isPaused = !isPaused;
  if (isPaused) {
    bgMusic.pause();
    koText.textContent = 'PAUSED';
    koText.style.opacity = 1;
  } else {
    bgMusic.play();
    koText.textContent = '';
    koText.style.opacity = 0;
  }
}

// ===============================
// 🌬️ Idle Animation
// ===============================
function idleBreathing() {
  if (!gameActive) return;
  fighter1.style.animation = 'breathing 2s infinite';
  fighter2.style.animation = 'breathing 2s infinite';
}
setInterval(idleBreathing, 2000);

// ===============================
// ⚙️ Settings Logic
// ===============================

function getVolume() {
  return parseFloat(localStorage.getItem('volume') || '0.3');
}

function setVolume(val) {
  localStorage.setItem('volume', val);
  bgMusic.volume = val;
}

if (volumeSlider) {
  volumeSlider.value = getVolume();
  volumeSlider.addEventListener('input', e => setVolume(e.target.value));
}

settingsBtn.addEventListener('click', () => {
  fadeTransition(startScreen, settingsScreen);
});

closeSettingsBtn.addEventListener('click', () => {
  fadeTransition(settingsScreen, startScreen);
});

// ===============================
// 🔄 Buttons
// ===============================
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// ===============================
// 🧩 Initialization
// ===============================
updateHPBar();
[koText, damageFloat1, damageFloat2].forEach(el => (el.style.opacity = 0));
