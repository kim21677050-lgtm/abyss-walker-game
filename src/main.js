import Phaser from "phaser";

const WEAPON_TYPES = [
  {
    id: "machineGun",
    name: "\uAE30\uAD00\uCD1D",
    icon: "MG",
    color: 0xffff66,
    desc: ["\uBE60\uB978 \uC790\uB3D9 \uC5F0\uC0AC", "2\uBC1C \uBC1C\uC0AC", "\uC720\uB3C4\uD0C4 \uCD94\uAC00", "\uD3ED\uBC1C\uD0C4", "\uB4DC\uB860 \uC9C0\uC6D0"],
  },
  {
    id: "magicMissile",
    name: "\uB9E4\uC9C1\uBBF8\uC0AC\uC77C",
    icon: "MM",
    color: 0xbb88ff,
    desc: ["\uCD94\uC801 \uBBF8\uC0AC\uC77C", "2\uBC1C \uBC1C\uC0AC", "\uAD00\uD1B5 \uC7AC\uCD94\uC801", "\uD3ED\uBC1C", "\uBD84\uC5F4 \uBBF8\uC0AC\uC77C"],
  },
  {
    id: "lightning",
    name: "\uB099\uB8B0",
    icon: "LT",
    color: 0x66ccff,
    desc: ["\uC8FC\uBCC0 \uBC88\uAC1C", "2\uD0C0\uAC9F", "\uC5F0\uC1C4 \uBC88\uAC1C", "\uC2A4\uD134", "\uC8FC\uAE30 \uB099\uB8B0"],
  },
  {
    id: "sword",
    name: "\uAC80",
    icon: "SW",
    color: 0xffd1dc,
    desc: ["\uADFC\uC811 \uBCA0\uAE30", "\uBC94\uC704 \uC99D\uAC00", "2\uD68C \uBCA0\uAE30", "\uAC80\uAE30", "\uD68C\uC804 \uAC80"],
  },
  {
    id: "laser",
    name: "\uB808\uC774\uC800",
    icon: "LZ",
    color: 0xff5533,
    desc: ["\uC9C1\uC120 \uB808\uC774\uC800", "\uAE38\uC774 \uC99D\uAC00", "2\uAC08\uB798", "\uD654\uC0C1", "\uD68C\uC804 \uB808\uC774\uC800"],
  },
];

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#111111",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);

let player;
let cursors;
let enemies;
let bullets;
let expOrbs;
let exp = 0;
let level = 1;
let expToNextLevel = 5;
let levelText;
let weaponText;
let levelUpText = null;
let weaponManager;
let spawnTimer;
let isChoosingWeapon = false;

const playerVelocity = {
  x: 0,
  y: 0,
};

function preload() {}

function create() {
  this.physics.world.setBounds(-3000, -3000, 6000, 6000);

  this.add.rectangle(0, 0, 10000, 10000, 0x050814).setOrigin(0);

  player = this.add.rectangle(640, 360, 40, 40, 0x00ffd5);
  this.physics.add.existing(player);
  player.body.setDrag(800);
  player.body.setMaxVelocity(400);

  enemies = this.physics.add.group();
  bullets = this.physics.add.group();
  expOrbs = this.physics.add.group();
  weaponManager = new WeaponManager(this);

  for (let i = 0; i < 25; i++) {
    spawnEnemy.call(this);
  }

  spawnTimer = this.time.addEvent({
    delay: 800,
    callback: () => spawnEnemy.call(this),
    loop: true,
  });

  this.physics.add.overlap(bullets, enemies, handleBulletHit, null, this);

  this.physics.add.overlap(player, expOrbs, (player, orb) => {
    orb.destroy();
    exp++;

    if (exp >= expToNextLevel) {
      level++;
      exp = 0;
      expToNextLevel += 3;
      showLevelUpText.call(this);
      showWeaponSelection.call(this);
    }
  });

  this.cameras.main.startFollow(player, true, 0.08, 0.08);
  this.cameras.main.setZoom(1.05);

  levelText = this.add.text(20, 20, `Lv. ${level}`, {
    fontSize: "24px",
    color: "#ffffff",
  }).setScrollFactor(0).setDepth(1000);

  weaponText = this.add.text(20, 52, "", {
    fontSize: "16px",
    color: "#b7f7ff",
  }).setScrollFactor(0).setDepth(1000);

  cursors = this.input.keyboard.addKeys({
    up: "W",
    down: "S",
    left: "A",
    right: "D",
  });

  weaponManager.addOrUpgrade("machineGun");
  updateWeaponHud();
}

function update(time, delta) {
  if (isChoosingWeapon) {
    return;
  }

  movePlayer();

  enemies.getChildren().forEach((enemy) => {
    if (enemy.stunnedUntil && enemy.stunnedUntil > time) {
      enemy.body.setVelocity(0, 0);
      return;
    }

    this.physics.moveToObject(enemy, player, 180);
  });

  weaponManager.tick(time, delta);
  updateProjectiles.call(this, time, delta);
  pullExpOrbs.call(this);

  levelText.setText(`Lv. ${level}`);
}

function movePlayer() {
  const acceleration = 40;
  const maxSpeed = 350;

  if (cursors.left.isDown) playerVelocity.x -= acceleration;
  if (cursors.right.isDown) playerVelocity.x += acceleration;
  if (cursors.up.isDown) playerVelocity.y -= acceleration;
  if (cursors.down.isDown) playerVelocity.y += acceleration;

  playerVelocity.x *= 0.9;
  playerVelocity.y *= 0.9;

  playerVelocity.x = Phaser.Math.Clamp(playerVelocity.x, -maxSpeed, maxSpeed);
  playerVelocity.y = Phaser.Math.Clamp(playerVelocity.y, -maxSpeed, maxSpeed);
  player.body.setVelocity(playerVelocity.x, playerVelocity.y);
}

function pullExpOrbs() {
  expOrbs.getChildren().forEach((orb) => {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if (distance < 150) {
      this.physics.moveToObject(orb, player, 250);
    }
  });
}

function showLevelUpText() {
  if (levelUpText) {
    levelUpText.destroy();
  }

  levelUpText = this.add.text(player.x, player.y - 50, `LEVEL UP! Lv.${level}`, {
    fontSize: "20px",
    color: "#00ff00",
  }).setDepth(100);

  this.time.delayedCall(1000, () => {
    if (levelUpText) {
      levelUpText.destroy();
      levelUpText = null;
    }
  });
}

function pauseGameplay() {
  isChoosingWeapon = true;
  player.body.setVelocity(0, 0);
  this.physics.pause();
  spawnTimer.paused = true;
}

function resumeGameplay() {
  isChoosingWeapon = false;
  this.physics.resume();
  spawnTimer.paused = false;
}

function showWeaponSelection() {
  pauseGameplay.call(this);

  const options = getRandomWeaponOptions();
  const overlay = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
  const shade = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.65)
    .setOrigin(0);

  const title = this.add.text(this.scale.width / 2, this.scale.height / 2 - 170, "\uBB34\uAE30 \uC120\uD0DD", {
    fontSize: "32px",
    color: "#ffffff",
    fontStyle: "bold",
  }).setOrigin(0.5);

  overlay.add([shade, title]);

  const selectOption = (weaponType) => {
    weaponManager.addOrUpgrade(weaponType.id);
    updateWeaponHud();
    overlay.destroy(true);
    this.input.keyboard.off("keydown-ONE", keyHandlers[0]);
    this.input.keyboard.off("keydown-TWO", keyHandlers[1]);
    this.input.keyboard.off("keydown-THREE", keyHandlers[2]);
    resumeGameplay.call(this);
  };

  const keyHandlers = options.map((weaponType) => () => selectOption(weaponType));

  options.forEach((weaponType, index) => {
    const x = this.scale.width / 2 + (index - 1) * 250;
    const y = this.scale.height / 2;
    const owned = weaponManager.getWeapon(weaponType.id);
    const nextLevel = owned ? Math.min(owned.level + 1, 5) : 1;
    const card = createWeaponCard.call(this, x, y, index + 1, weaponType, nextLevel);

    card.setInteractive(new Phaser.Geom.Rectangle(-100, -130, 200, 260), Phaser.Geom.Rectangle.Contains);
    card.on("pointerdown", () => selectOption(weaponType));
    card.on("pointerover", () => card.getByName("bg").setStrokeStyle(4, 0xffffff));
    card.on("pointerout", () => card.getByName("bg").setStrokeStyle(2, weaponType.color));
    overlay.add(card);
  });

  this.input.keyboard.on("keydown-ONE", keyHandlers[0]);
  this.input.keyboard.on("keydown-TWO", keyHandlers[1]);
  this.input.keyboard.on("keydown-THREE", keyHandlers[2]);
}

function createWeaponCard(x, y, number, weaponType, nextLevel) {
  const card = this.add.container(x, y);
  const bg = this.add.rectangle(0, 0, 200, 260, 0x151a24, 0.96)
    .setStrokeStyle(2, weaponType.color)
    .setName("bg");
  const key = this.add.text(-82, -112, `${number}`, {
    fontSize: "18px",
    color: "#ffffff",
    backgroundColor: "#2e3544",
    padding: { x: 8, y: 4 },
  });
  const icon = this.add.text(0, -66, weaponType.icon, {
    fontSize: "34px",
    color: `#${weaponType.color.toString(16).padStart(6, "0")}`,
    fontStyle: "bold",
  }).setOrigin(0.5);
  const name = this.add.text(0, -18, weaponType.name, {
    fontSize: "22px",
    color: "#ffffff",
    fontStyle: "bold",
  }).setOrigin(0.5);
  const levelLabel = this.add.text(0, 20, `Lv.${nextLevel}`, {
    fontSize: "18px",
    color: "#b7f7ff",
  }).setOrigin(0.5);
  const desc = this.add.text(0, 66, weaponType.desc[nextLevel - 1], {
    fontSize: "15px",
    color: "#d8deea",
    align: "center",
    wordWrap: { width: 160 },
  }).setOrigin(0.5);

  card.add([bg, key, icon, name, levelLabel, desc]);
  return card;
}

function getRandomWeaponOptions() {
  const ownedWeapons = weaponManager.getOwnedWeaponTypes();
  const pool = ownedWeapons.length >= weaponManager.maxWeapons
    ? WEAPON_TYPES.filter((weapon) => ownedWeapons.includes(weapon.id))
    : WEAPON_TYPES;

  return Phaser.Utils.Array.Shuffle([...pool]).slice(0, 3);
}

function updateWeaponHud() {
  weaponText.setText(
    weaponManager.weapons
      .map((weapon) => `${weapon.definition.name} Lv.${weapon.level}`)
      .join(" / ")
  );
}

function spawnEnemy() {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = 1200;
  const x = player.x + Math.cos(angle) * distance;
  const y = player.y + Math.sin(angle) * distance;
  const enemy = this.add.circle(x, y, 20, 0xff3355);

  this.physics.add.existing(enemy);
  enemy.hp = 3;
  enemy.burnUntil = 0;
  enemy.stunnedUntil = 0;
  enemies.add(enemy);
}

function handleBulletHit(bullet, enemy) {
  damageEnemy.call(this, enemy, bullet.damage || 1);

  if (bullet.explodeRadius) {
    explode.call(this, bullet.x, bullet.y, bullet.explodeRadius, bullet.explodeDamage || 1);
  }

  if (bullet.splitOnHit) {
    splitMissile.call(this, bullet.x, bullet.y);
  }

  if (bullet.pierce && bullet.pierce > 0) {
    bullet.pierce--;
    bullet.target = findNearestEnemy(enemy);
    return;
  }

  bullet.destroy();
}

function damageEnemy(enemy, amount = 1) {
  if (!enemy || !enemy.active) return;

  enemy.hp -= amount;
  enemy.setFillStyle(enemy.stunnedUntil > this.time.now ? 0x99ddff : 0xff3355);

  if (enemy.hp <= 0) {
    spawnExpOrb.call(this, enemy.x, enemy.y);
    enemy.destroy();
  }
}

function spawnExpOrb(x, y) {
  const orb = this.add.circle(x, y, 7, 0x66ccff);
  this.physics.add.existing(orb);
  expOrbs.add(orb);
}

function explode(x, y, radius, damage = 1) {
  const blast = this.add.circle(x, y, radius, 0xffaa33, 0.22).setDepth(40);
  this.tweens.add({
    targets: blast,
    alpha: 0,
    scale: 1.4,
    duration: 180,
    onComplete: () => blast.destroy(),
  });

  enemies.getChildren().forEach((enemy) => {
    if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
      damageEnemy.call(this, enemy, damage);
    }
  });
}

function updateProjectiles(time) {
  bullets.getChildren().forEach((bullet) => {
    if (bullet.homing && bullet.target && bullet.target.active) {
      this.physics.moveToObject(bullet, bullet.target, bullet.speed || 520);
    }

    if (bullet.burn && bullet.target && bullet.target.active) {
      bullet.target.burnUntil = Math.max(bullet.target.burnUntil || 0, time + 1200);
    }

    if (bullet.x < player.x - 1600 || bullet.x > player.x + 1600 || bullet.y < player.y - 1600 || bullet.y > player.y + 1600) {
      bullet.destroy();
    }
  });

  enemies.getChildren().forEach((enemy) => {
    if (enemy.burnUntil > time && (!enemy.nextBurnTick || time > enemy.nextBurnTick)) {
      enemy.nextBurnTick = time + 350;
      damageEnemy.call(this, enemy, 0.5);
    }
  });
}

function createProjectile(scene, x, y, color, radius = 6) {
  const bullet = scene.add.circle(x, y, radius, color);
  scene.physics.add.existing(bullet);
  bullets.add(bullet);
  return bullet;
}

function findNearestEnemy(excludeEnemy = null) {
  let nearest = null;
  let shortestDistance = Infinity;

  enemies.getChildren().forEach((enemy) => {
    if (enemy === excludeEnemy || !enemy.active) return;

    const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = enemy;
    }
  });

  return nearest;
}

function findEnemiesInRange(x, y, range, limit = Infinity) {
  return enemies.getChildren()
    .filter((enemy) => enemy.active)
    .map((enemy) => ({
      enemy,
      distance: Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y),
    }))
    .filter((entry) => entry.distance <= range)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((entry) => entry.enemy);
}

function splitMissile(x, y) {
  const targets = findEnemiesInRange(x, y, 650, 3);

  targets.forEach((target) => {
    const bullet = createProjectile(this, x, y, 0xd6a6ff, 5);
    bullet.damage = 1;
    bullet.homing = true;
    bullet.target = target;
    bullet.speed = 520;
    this.physics.moveToObject(bullet, target, bullet.speed);
  });
}

class WeaponManager {
  constructor(scene) {
    this.scene = scene;
    this.weapons = [];
    this.maxWeapons = 3;
  }

  addOrUpgrade(type) {
    const owned = this.getWeapon(type);

    if (owned) {
      owned.upgrade();
      return true;
    }

    if (this.weapons.length >= this.maxWeapons) {
      return false;
    }

    this.weapons.push(createWeapon(this.scene, type));
    return true;
  }

  getWeapon(type) {
    return this.weapons.find((weapon) => weapon.type === type);
  }

  getOwnedWeaponTypes() {
    return this.weapons.map((weapon) => weapon.type);
  }

  tick(time, delta) {
    this.weapons.forEach((weapon) => weapon.tick(time, delta));
  }
}

class AutoWeapon {
  constructor(scene, type, cooldown) {
    this.scene = scene;
    this.type = type;
    this.level = 1;
    this.cooldown = cooldown;
    this.lastFire = 0;
    this.definition = WEAPON_TYPES.find((weapon) => weapon.id === type);
  }

  upgrade() {
    this.level = Math.min(this.level + 1, 5);
  }

  canFire(time, cooldown = this.cooldown) {
    return time > this.lastFire + cooldown;
  }
}

class MachineGunWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "machineGun", 180);
    this.shotCount = 0;
    this.lastDroneShot = 0;
  }

  tick(time) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const count = this.level >= 2 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const target = findNearestEnemy();
        if (!target) return;

        const bullet = createProjectile(this.scene, player.x + i * 10 - 5, player.y, 0xffff66);
        bullet.damage = 1;
        bullet.explodeRadius = this.level >= 4 ? 55 : 0;
        bullet.explodeDamage = 1;

        this.shotCount++;
        if (this.level >= 3 && this.shotCount % 8 === 0) {
          bullet.homing = true;
          bullet.target = target;
          bullet.speed = 650;
        }

        this.scene.physics.moveToObject(bullet, target, 650);
      }
    }

    if (this.level >= 5 && time > this.lastDroneShot + 650) {
      this.lastDroneShot = time;
      [-55, 55].forEach((offset) => {
        const target = findNearestEnemy();
        if (!target) return;

        const bullet = createProjectile(this.scene, player.x + offset, player.y - 30, 0x99ff66, 5);
        bullet.damage = 1;
        this.scene.physics.moveToObject(bullet, target, 580);
      });
    }
  }
}

class MagicMissileWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "magicMissile", 760);
  }

  tick(time) {
    if (!this.canFire(time)) return;

    this.lastFire = time;
    const count = this.level >= 2 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const target = findNearestEnemy();
      if (!target) return;

      const bullet = createProjectile(this.scene, player.x, player.y, 0xbb88ff, 7);
      bullet.damage = 1.5;
      bullet.homing = true;
      bullet.target = target;
      bullet.speed = 480;
      bullet.pierce = this.level >= 3 ? 1 : 0;
      bullet.explodeRadius = this.level >= 4 ? 70 : 0;
      bullet.explodeDamage = 1;
      bullet.splitOnHit = this.level >= 5;
      this.scene.physics.moveToObject(bullet, target, bullet.speed);
    }
  }
}

class LightningWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "lightning", 1100);
    this.lastStorm = 0;
  }

  tick(time) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const targets = findEnemiesInRange(player.x, player.y, 650, this.level >= 2 ? 2 : 1);
      targets.forEach((target) => this.strike(target, time));

      if (this.level >= 3 && targets[0]) {
        const chained = findEnemiesInRange(targets[0].x, targets[0].y, 280, 2)
          .filter((enemy) => !targets.includes(enemy));
        chained.forEach((target) => this.strike(target, time, 0.8));
      }
    }

    if (this.level >= 5 && time > this.lastStorm + 2500) {
      this.lastStorm = time;
      findEnemiesInRange(player.x, player.y, 900, 5).forEach((target) => this.strike(target, time, 1.2));
    }
  }

  strike(target, time, damage = 1.5) {
    const bolt = this.scene.add.line(0, 0, player.x, player.y, target.x, target.y, 0x66ccff, 0.9)
      .setOrigin(0)
      .setLineWidth(4)
      .setDepth(50);
    this.scene.tweens.add({
      targets: bolt,
      alpha: 0,
      duration: 130,
      onComplete: () => bolt.destroy(),
    });

    if (this.level >= 4) {
      target.stunnedUntil = time + 700;
      target.setFillStyle(0x99ddff);
    }

    damageEnemy.call(this.scene, target, damage);
  }
}

class SwordWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "sword", 850);
    this.rotationAngle = 0;
    this.lastSpinDamage = 0;
  }

  tick(time, delta) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const swings = this.level >= 3 ? 2 : 1;

      for (let i = 0; i < swings; i++) {
        this.scene.time.delayedCall(i * 130, () => this.swing());
      }

      if (this.level >= 4) {
        this.swordWave();
      }
    }

    if (this.level >= 5) {
      this.rotationAngle += delta * 0.006;
      const radius = 95;
      const x = player.x + Math.cos(this.rotationAngle) * radius;
      const y = player.y + Math.sin(this.rotationAngle) * radius;
      const blade = this.scene.add.rectangle(x, y, 42, 10, 0xffd1dc, 0.85)
        .setRotation(this.rotationAngle)
        .setDepth(30);
      this.scene.tweens.add({
        targets: blade,
        alpha: 0,
        duration: 90,
        onComplete: () => blade.destroy(),
      });

      if (time > this.lastSpinDamage + 250) {
        this.lastSpinDamage = time;
        findEnemiesInRange(player.x, player.y, radius + 35, 4).forEach((enemy) => {
          damageEnemy.call(this.scene, enemy, 1);
        });
      }
    }
  }

  swing() {
    const range = this.level >= 2 ? 150 : 105;
    const arc = this.scene.add.circle(player.x, player.y, range, 0xffd1dc, 0.12).setDepth(25);
    this.scene.tweens.add({
      targets: arc,
      alpha: 0,
      scale: 1.15,
      duration: 180,
      onComplete: () => arc.destroy(),
    });

    findEnemiesInRange(player.x, player.y, range, 8).forEach((enemy) => {
      damageEnemy.call(this.scene, enemy, 1.5);
    });
  }

  swordWave() {
    const target = findNearestEnemy();
    if (!target) return;

    const wave = createProjectile(this.scene, player.x, player.y, 0xffd1dc, 8);
    wave.damage = 1.25;
    this.scene.physics.moveToObject(wave, target, 520);
  }
}

class LaserWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "laser", 1250);
    this.spinAngle = 0;
    this.lastSpin = 0;
  }

  tick(time, delta) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const target = findNearestEnemy();
      if (!target) return;

      const baseAngle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
      const angles = this.level >= 3 ? [baseAngle - 0.16, baseAngle + 0.16] : [baseAngle];
      angles.forEach((angle) => this.fireLaser(angle, this.level >= 2 ? 780 : 560, this.level >= 4));
    }

    if (this.level >= 5 && time > this.lastSpin + 180) {
      this.lastSpin = time;
      this.spinAngle += delta * 0.006 + 0.22;
      this.fireLaser(this.spinAngle, 700, true, 0.65);
    }
  }

  fireLaser(angle, length, burn = false, damage = 1.2) {
    const endX = player.x + Math.cos(angle) * length;
    const endY = player.y + Math.sin(angle) * length;
    const laser = this.scene.add.line(0, 0, player.x, player.y, endX, endY, 0xff5533, 0.72)
      .setOrigin(0)
      .setLineWidth(6)
      .setDepth(45);

    this.scene.tweens.add({
      targets: laser,
      alpha: 0,
      duration: 160,
      onComplete: () => laser.destroy(),
    });

    enemies.getChildren().forEach((enemy) => {
      const distance = distanceToSegment(
        enemy.x,
        enemy.y,
        player.x,
        player.y,
        endX,
        endY
      );

      if (distance <= 28) {
        if (burn) {
          enemy.burnUntil = this.scene.time.now + 1200;
        }
        damageEnemy.call(this.scene, enemy, damage);
      }
    });
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Phaser.Math.Distance.Between(px, py, x1, y1);
  }

  const t = Phaser.Math.Clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  const closestX = x1 + t * dx;
  const closestY = y1 + t * dy;

  return Phaser.Math.Distance.Between(px, py, closestX, closestY);
}

function createWeapon(scene, type) {
  switch (type) {
    case "machineGun":
      return new MachineGunWeapon(scene);
    case "magicMissile":
      return new MagicMissileWeapon(scene);
    case "lightning":
      return new LightningWeapon(scene);
    case "sword":
      return new SwordWeapon(scene);
    case "laser":
      return new LaserWeapon(scene);
    default:
      throw new Error(`Unknown weapon type: ${type}`);
  }
}
