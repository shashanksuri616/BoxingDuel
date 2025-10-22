import { Player } from './player.js';
import { setupInput } from './input.js';
import { randomDamage, safePlayAudio, detectCollision, rectRelativeTo } from './utils.js';

// DOM queries (fail early if page markup changed)
const query = (sel) => document.getElementById(sel);
const startScreen = query('start-screen');
const arenaScreen = query('arena-screen');
const endOverlay = query('end-overlay');
const startBtn = query('start-btn');
const restartBtn = query('restart-btn');
const winnerText = query('winner-text');
const koText = query('ko-text');
const hp1 = query('hp1');
const hp2 = query('hp2');
const fighter1 = query('fighter1');
const fighter2 = query('fighter2');
const damageFloat1 = query('damage-float-1');
const damageFloat2 = query('damage-float-2');
const arena = query('arena');

const bgMusic = query('bg-music');
const punchSound = query('punch-sound');
const hitSound = query('hit-sound');
const koSound = query('ko-sound');
const victorySound = query('victory-sound');

const player1 = new Player('PLAYER 1', '#ff4757');
const player2 = new Player('PLAYER 2', '#1e90ff');
let gameActive = false;

// combat config
const PUNCH_COOLDOWN = 700;
const PUNCH_STARTUP = 100;
const HIT_RANGE = 80;
const HITBOX_HEIGHT = 60;

// preloader (simple)
async function preloadAudioList(list) {
  const loaded = [];
  for (const id of list) {
    const el = query(id);
    if (el) {
      try { await el.load?.(); } catch (e) {}
      loaded.push(el);
    }
  }
  return loaded;
}

function updateHPBar() {
  hp1.style.width = (player1.hp / player1.maxHP * 100) + '%';
  hp2.style.width = (player2.hp / player2.maxHP * 100) + '%';
}

function worldRect(el) {
  return rectRelativeTo(el, arena.getBoundingClientRect());
}
function makeAttackHitbox(fighterEl, isLeft) {
  const f = worldRect(fighterEl);
  if (isLeft) return { x: f.x + f.width, y: f.y + (f.height - HITBOX_HEIGHT) / 2, width: HIT_RANGE, height: HITBOX_HEIGHT };
  return { x: f.x - HIT_RANGE, y: f.y + (f.height - HITBOX_HEIGHT) / 2, width: HIT_RANGE, height: HITBOX_HEIGHT };
}

function showDamage(playerNum, dmg) {
  const float = playerNum === 1 ? damageFloat2 : damageFloat1;
  const targetEl = playerNum === 1 ? fighter2 : fighter1;
  const fRect = worldRect(targetEl);
  float.style.left = (fRect.x + fRect.width / 2) + 'px';
  float.style.top = (fRect.y - 20) + 'px';
  float.textContent = `-${dmg}`;
  float.style.opacity = 1;
  float.style.transition = 'none';
  setTimeout(() => {
    float.style.transition = 'opacity .6s, top .6s';
    float.style.opacity = 0;
    float.style.top = (fRect.y - 60) + 'px';
  }, 30);
}

function animateFighterPunch(fighter, isLeft) {
  fighter.style.animation = isLeft ? 'punch .25s' : 'punch-left .25s';
  setTimeout(() => { fighter.style.animation = ''; }, 260);
}

function animateFighterHit(fighter) {
  fighter.style.animation = 'hitFlash .2s, shake .3s';
  setTimeout(() => { fighter.style.animation = ''; }, 320);
}

function animateKO() {
  koText.textContent = 'KO!';
  koText.style.opacity = 1;
  koText.style.animation = 'fadeIn .5s ease-out';
  setTimeout(() => { koText.style.animation = 'fadeOut .7s 1.2s forwards'; }, 1200);
}

function resetFighters() {
  player1.reset(); player2.reset();
  updateHPBar();
  koText.textContent = ''; koText.style.opacity = 0;
  fighter1.style.animation = fighter2.style.animation = '';
  damageFloat1.textContent = damageFloat2.textContent = '';
  damageFloat1.style.opacity = damageFloat2.style.opacity = 0;
  fighter1.removeAttribute('data-cooldown'); fighter2.removeAttribute('data-cooldown');
}

// Debug helpers
let debugMode = false;
const debugEls = [];
function drawDebugBox(box, cls='debug-hitbox', ttl=800){
  if(!debugMode) return;
  const el = document.createElement('div'); el.className = cls;
  el.style.left = box.x + 'px'; el.style.top = box.y + 'px';
  el.style.width = box.width + 'px'; el.style.height = box.height + 'px';
  arena.appendChild(el); debugEls.push(el);
  setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); const i = debugEls.indexOf(el); if(i>=0) debugEls.splice(i,1); }, ttl);
}
function toggleDebug(){ debugMode = !debugMode; if(!debugMode){ debugEls.forEach(e=>e.remove()); debugEls.length=0; arena.classList.remove('debug'); } else arena.classList.add('debug'); console.info('Debug:', debugMode); }
document.addEventListener('keydown', (e)=>{ if(e.code === 'Backquote') toggleDebug(); });

// game flow
async function startGame(){
  startScreen.style.display = 'none'; arenaScreen.style.display = 'block'; endOverlay.style.display = 'none';
  resetFighters(); gameActive = true;
  await preloadAudioList(['bg-music','punch-sound','hit-sound','ko-sound','victory-sound']);
  safePlayAudio(bgMusic, 0.28);
}
function endGame(winner){
  gameActive = false; animateKO(); safePlayAudio(koSound, 0.7);
  setTimeout(()=>safePlayAudio(victorySound, 0.85), 600);
  setTimeout(()=>{ endOverlay.style.display = 'flex'; winnerText.textContent = `PLAYER ${winner} WINS!`; }, 3000);
}
function restartGame(){
  endOverlay.style.display = 'none'; resetFighters(); gameActive = true; safePlayAudio(bgMusic,0.28);
}

// combat
function handlePunch(playerNum){
  if(!gameActive) return;
  const actor = playerNum === 1 ? player1 : player2;
  const target = playerNum === 1 ? player2 : player1;
  const actorEl = playerNum === 1 ? fighter1 : fighter2;
  const targetEl = playerNum === 1 ? fighter2 : fighter1;
  const isLeft = playerNum === 1;
  if(!actor.canPunch || !target.isAlive()) return;

  // cooldown
  actor.canPunch = false; actorEl.setAttribute('data-cooldown','1');
  setTimeout(()=>{ actor.canPunch = true; actorEl.removeAttribute('data-cooldown'); }, PUNCH_COOLDOWN);

  animateFighterPunch(actorEl, isLeft);
  safePlayAudio(punchSound, 0.9);

  // active frame after startup
  setTimeout(()=>{
    const attackBox = makeAttackHitbox(actorEl, isLeft);
    const targetBox = worldRect(targetEl);
    drawDebugBox(attackBox, 'debug-hitbox'); drawDebugBox(targetBox, 'debug-target');

    if(detectCollision(attackBox, targetBox)){
      const dmg = randomDamage();
      target.setHP(target.hp - dmg); updateHPBar(); showDamage(playerNum, dmg);
      animateFighterHit(targetEl); safePlayAudio(hitSound,0.85);
      if(!target.isAlive()){
        setTimeout(()=>{ const winnerEl = playerNum===1 ? fighter1 : fighter2; winnerEl.style.animation = 'breathing .8s 2, fadeIn .5s'; }, 600);
        endGame(playerNum);
      }
    } else {
      // miss recoil
      actorEl.style.transform = 'translateY(-6px)'; setTimeout(()=>{ actorEl.style.transform = ''; }, 120);
    }
  }, PUNCH_STARTUP);
}

// input
const cleanupInput = setupInput(handlePunch);

// button wiring
startBtn?.addEventListener('click', startGame);
restartBtn?.addEventListener('click', ()=>{ restartGame(); endOverlay.style.display='none'; });

// settings overlay handlers (safe optional)
const settingsBtn = document.getElementById('settings-btn');
const settingsScreen = document.getElementById('settings-screen');
const closeSettingsBtn = document.getElementById('close-settings-btn');
if(settingsBtn && settingsScreen && closeSettingsBtn){
  settingsBtn.addEventListener('click', ()=>{ startScreen.style.display='none'; settingsScreen.style.display='flex'; });
  closeSettingsBtn.addEventListener('click', ()=>{ settingsScreen.style.display='none'; startScreen.style.display='flex'; });
}

// idle animation
setInterval(()=>{
  if(!gameActive) return;
  fighter1.style.animation = fighter2.style.animation = 'breathing 2s infinite';
}, 2000);

// cleanup on unload
window.addEventListener('beforeunload', ()=>{ cleanupInput(); });

// initial state
updateHPBar();
koText.textContent=''; koText.style.opacity=0;
damageFloat1.style.opacity=0; damageFloat2.style.opacity=0;
