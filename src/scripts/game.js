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

// --- Game State ---
let player1 = { hp: 100, canPunch: true };
let player2 = { hp: 100, canPunch: true };
let gameActive = false;
const PUNCH_COOLDOWN = 700; // ms

// --- Utility Functions ---
function setHP(player, value) {
  player.hp = Math.max(0, value);
  updateHPBar();
}

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
  setTimeout(() => {
    float.style.transition = 'opacity 0.5s, top 0.5s';
    float.style.opacity = 0;
    float.style.top = '10px';
  }, 50);
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play();
}

function animateFighterPunch(fighter, isLeft) {
  fighter.style.animation = isLeft ? 'punch 0.25s' : 'punch-left 0.25s';
  setTimeout(() => {
    fighter.style.animation = '';
  }, 250);
}

function animateFighterHit(fighter) {
  fighter.style.animation = 'hitFlash 0.2s, shake 0.3s';
  setTimeout(() => {
    fighter.style.animation = '';
  }, 300);
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
  player1.hp = 100;
  player2.hp = 100;
  player1.canPunch = true;
  player2.canPunch = true;
  updateHPBar();
  koText.textContent = '';
  koText.style.opacity = 0;
  fighter1.style.animation = '';
  fighter2.style.animation = '';
  damageFloat1.textContent = '';
  damageFloat2.textContent = '';
  damageFloat1.style.opacity = 0;
  damageFloat2.style.opacity = 0;
}

// --- Game Flow ---
function startGame() {
  startScreen.style.display = 'none';
  arenaScreen.style.display = 'block';
  endOverlay.style.display = 'none';
  resetFighters();
  gameActive = true;
  bgMusic.volume = 0.3;
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
  endOverlay.style.display = 'none';
  koText.textContent = '';
  koText.style.opacity = 0;
  resetFighters();
  gameActive = true;
  bgMusic.play();
}

// --- Combat Logic ---
function handlePunch(playerNum) {
  if (!gameActive) return;
  if (playerNum === 1 && player1.canPunch && player2.hp > 0) {
    player1.canPunch = false;
    animateFighterPunch(fighter1, true);
    playSound(punchSound);
    setTimeout(() => {
      // Always in range, apply random damage
      const dmg = Math.floor(Math.random() * 11) + 5; // 5-15
      setHP(player2, player2.hp - dmg);
      showDamage(1, dmg);
      animateFighterHit(fighter2);
      playSound(hitSound);
      if (player2.hp <= 0) {
        animateKO();
        playSound(koSound);
        setTimeout(() => {
          fighter1.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
        }, 900);
        endGame(1);
      }
    }, 120);
    setTimeout(() => { player1.canPunch = true; }, PUNCH_COOLDOWN);
  }
  if (playerNum === 2 && player2.canPunch && player1.hp > 0) {
    player2.canPunch = false;
    animateFighterPunch(fighter2, false);
    playSound(punchSound);
    setTimeout(() => {
      const dmg = Math.floor(Math.random() * 11) + 5;
      setHP(player1, player1.hp - dmg);
      showDamage(2, dmg);
      animateFighterHit(fighter1);
      playSound(hitSound);
      if (player1.hp <= 0) {
        animateKO();
        playSound(koSound);
        setTimeout(() => {
          fighter2.style.animation = 'breathing 0.8s 2, fadeIn 0.5s';
        }, 900);
        endGame(2);
      }
    }, 120);
    setTimeout(() => { player2.canPunch = true; }, PUNCH_COOLDOWN);
  }
}

// --- Input Handling ---
document.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  if (e.code === 'KeyA') handlePunch(1);
  if (e.code === 'KeyL') handlePunch(2);
});

// --- Button Events ---
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
  restartGame();
  endOverlay.style.display = 'none';
});

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