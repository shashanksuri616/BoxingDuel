// Simple AI enemy logic for future single-player mode

export class EnemyAI {
  constructor(punchCallback, cooldown = 1200) {
    this.punchCallback = punchCallback; // function to call when AI punches
    this.cooldown = cooldown; // ms between punches
    this.active = false;
    this._interval = null;
  }

  start() {
    if (this.active) return;
    this.active = true;
    this._interval = setInterval(() => {
      if (this.active && typeof this.punchCallback === 'function') {
        this.punchCallback();
      }
    }, this.cooldown + Math.random() * 800); // randomize a bit
  }

  stop() {
    this.active = false;
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
  }
}