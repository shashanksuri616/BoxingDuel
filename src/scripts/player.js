// Player class for both human and AI players

export class Player {
  constructor(name, color, maxHP = 100) {
    this.name = name;
    this.color = color;
    this.maxHP = maxHP;
    this.hp = maxHP;
    this.canPunch = true;
  }

  setHP(value) {
    this.hp = Math.max(0, Math.min(this.maxHP, value));
  }

  reset() {
    this.hp = this.maxHP;
    this.canPunch = true;
  }

  isAlive() {
    return this.hp > 0;
  }
}