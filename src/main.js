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
  {
    id: "skull",
    name: "해골",
    icon: "SK",
    color: 0xcc99ff,
    desc: ["광역 스턴+독", "독 지속 증가", "반경 확대", "스턴 시간 증가", "중독 중첩"],
  },
  {
    id: "lung",
    name: "유지호의 폐",
    icon: "LG",
    color: 0xff8844,
    desc: ["3회 연속 폭발", "폭발 범위 증가", "5회 연속 폭발", "폭발 피해 증가", "화염 지속 피해"],
  },
  {
    id: "scythe",
    name: "대낫",
    icon: "SC",
    color: 0x88ffcc,
    desc: ["전방 휩쓸기", "범위 확대", "2회 연속 베기", "관통 낫날", "회오리 소환"],
  },
];

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#111111",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
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
let expInfoText;
let weaponText;
let levelUpText = null;
let weaponManager;
let spawnTimer;
let enemyHealthTimer;
let enemySpawnGrowthTimer;
let isChoosingWeapon = false;
let enemyMaxHp = 3;
let enemySpawnBonus = 0;
let enemySpawnRemainder = 0;
let joystick = null;
let playerHp = 100;
let playerMaxHp = 100;
let healthBarBg;
let healthBarGreen;
let healthBarRed;
let isDead = false;
let lastDamageTime = 0;
const CONTACT_DAMAGE_PER_SEC = 34; // 약 3초 버티면 죽음
let gameStartTime = 0;
let devMode = false;
let devPanelEl = null;
let gameSceneRef = null;
let devBtnEl = null;

const playerVelocity = {
  x: 0,
  y: 0,
};

function preload() {
  for (let i = 1; i <= 6; i++) {
    this.load.image(`player_${i}`, `assets/hero-run-${i}.png`);
  }
}

function create() {
  gameSceneRef = this;

  // 모바일 멀티터치 등록
  this.input.addPointer(2);

  this.physics.world.setBounds(-3000, -3000, 6000, 6000);

  this.add.rectangle(0, 0, 10000, 10000, 0x050814).setOrigin(0);

player = this.physics.add.sprite(640, 360, "player_1");
player.setDisplaySize(120, 120);
player.body.setDrag(800);
player.body.setMaxVelocity(400);
player.body.setSize(75, 75);

this.anims.create({
  key: "walk",
  frames: [
    { key: "player_1" },
    { key: "player_2" },
    { key: "player_3" },
    { key: "player_4" },
    { key: "player_5" },
    { key: "player_6" },
  ],
  frameRate: 10,
  repeat: -1,
});

this.anims.create({
  key: "idle",
  frames: [{ key: "player_1" }],
  frameRate: 1,
  repeat: -1,
});

player.play("idle");
playerHp = playerMaxHp;
gameStartTime = this.time.now;

  enemies = this.physics.add.group();
  bullets = this.physics.add.group();
  expOrbs = this.physics.add.group();
  weaponManager = new WeaponManager(this);

  for (let i = 0; i < 50; i++) {
    spawnEnemy.call(this);
  }

  spawnTimer = this.time.addEvent({
    delay: 400,
    callback: () => spawnEnemyWave.call(this),
    loop: true,
  });

  enemyHealthTimer = this.time.addEvent({
    delay: 45000,
    callback: () => increaseEnemyMaxHp.call(this),
    loop: true,
  });

  enemySpawnGrowthTimer = this.time.addEvent({
    delay: 60000,
    callback: () => increaseEnemySpawnAmount.call(this),
    loop: true,
  });

  this.physics.add.overlap(bullets, enemies, handleBulletHit, null, this);

  this.physics.add.overlap(player, expOrbs, (player, orb) => {
    orb.destroy();
    exp++;

    if (exp >= expToNextLevel) {
       if (devMode) return;
      level++;
      exp = 0;
      expToNextLevel += Math.floor(expToNextLevel * 0.4 + 4);
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

  expInfoText = this.add.text(this.scale.width - 20, 20, "", {
    fontSize: "15px",
    color: "#ffffff",
    align: "right",
  }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);
healthBarBg = this.add.rectangle(
  this.scale.width - 210,
  72,
  180,
  10,
  0x441111
)
.setOrigin(0, 0)
.setScrollFactor(0)
.setDepth(1000);

healthBarRed = this.add.rectangle(
  this.scale.width - 210,
  72,
  180,
  10,
  0xaa2222
)
.setOrigin(0, 0)
.setScrollFactor(0)
.setDepth(1001);

healthBarGreen = this.add.rectangle(
  this.scale.width - 210,
  72,
  180,
  10,
  0x00ff66
)
.setOrigin(0, 0)
.setScrollFactor(0)
.setDepth(1002);

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
  updateExpHud();

  // 조이스틱 생성
  createJoystick.call(this);

  layoutHud(this);

  this.scale.on("resize", (gameSize) => {
    layoutHud(this, gameSize.width, gameSize.height);
    layoutJoystick(this, gameSize.width, gameSize.height);
    updateCameraZoom.call(this, gameSize.width);
  });

  updateCameraZoom.call(this, this.scale.width);
  showStartScreen.call(this);
  createDevConsole();
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

    this.physics.moveToObject(enemy, player, 150);
  });

  weaponManager.tick(time, delta);
  applyContactDamage.call(this, delta);
updateHealthBar();
  updateProjectiles.call(this, time, delta);
  pullExpOrbs.call(this);

  levelText.setText(`Lv. ${level}`);
  updateExpHud();

  if (!isDead) {
  const touchingNow = enemies.getChildren().some((e) =>
    e.active && Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < 38
  );
  if (!touchingNow) player.clearTint();
}

}

// ─── 조이스틱 ────────────────────────────────────────────

function createJoystick() {
  const base = this.add.circle(0, 0, 58, 0xffffff, 0.1)
    .setStrokeStyle(3, 0x8df7ff, 0.45)
    .setScrollFactor(0)
    .setDepth(1500)
    .setVisible(false);

  const knob = this.add.circle(0, 0, 24, 0x8df7ff, 0.35)
    .setStrokeStyle(2, 0xffffff, 0.55)
    .setScrollFactor(0)
    .setDepth(1501)
    .setVisible(false);

  joystick = {
    base,
    knob,
    pointerId: null,
    active: false,
    radius: 54,
    vector: new Phaser.Math.Vector2(0, 0),
  };

  this.input.on("pointerdown", (pointer) => {
    if (isChoosingWeapon) return;
    if (joystick.active) return; // 이미 활성화된 터치 있으면 무시

    joystick.pointerId = pointer.id;
    joystick.active = true;
    joystick.base.setPosition(pointer.x, pointer.y).setVisible(true);
    joystick.knob.setPosition(pointer.x, pointer.y).setVisible(true);
    updateJoystick(pointer.x, pointer.y);
  });

  this.input.on("pointermove", (pointer) => {
    if (!joystick.active || joystick.pointerId !== pointer.id) return;
    updateJoystick(pointer.x, pointer.y);
  });

  this.input.on("pointerup", (pointer) => {
    if (joystick.pointerId !== pointer.id) return;
    resetJoystick();
  });

  this.input.on("pointerupoutside", (pointer) => {
    if (joystick.pointerId !== pointer.id) return;
    resetJoystick();
  });
}

function layoutJoystick() {
  // 동적 생성 방식이라 고정 위치 없음
}

function updateJoystick(pointerX, pointerY) {
  const dx = pointerX - joystick.base.x;
  const dy = pointerY - joystick.base.y;
  const distance = Math.min(joystick.radius, Math.sqrt(dx * dx + dy * dy));
  const angle = Math.atan2(dy, dx);

  joystick.knob.setPosition(
    joystick.base.x + Math.cos(angle) * distance,
    joystick.base.y + Math.sin(angle) * distance
  );

  joystick.vector.set(
    (Math.cos(angle) * distance) / joystick.radius,
    (Math.sin(angle) * distance) / joystick.radius
  );
}

function resetJoystick() {
  joystick.active = false;
  joystick.pointerId = null;
  joystick.vector.set(0, 0);
  joystick.base.setVisible(false);
  joystick.knob.setVisible(false);
}

// ─── 플레이어 이동 ────────────────────────────────────────

function movePlayer() {
  const acceleration = 40;
  const maxSpeed = 350;

  if (cursors.left.isDown) playerVelocity.x -= acceleration;
  if (cursors.right.isDown) playerVelocity.x += acceleration;
  if (cursors.up.isDown) playerVelocity.y -= acceleration;
  if (cursors.down.isDown) playerVelocity.y += acceleration;

  playerVelocity.x *= 0.9;
  playerVelocity.y *= 0.9;

  // 조이스틱 입력 반영
  if (joystick?.active) {
    playerVelocity.x += joystick.vector.x * acceleration * 1.55;
    playerVelocity.y += joystick.vector.y * acceleration * 1.55;
  }

  playerVelocity.x = Phaser.Math.Clamp(playerVelocity.x, -maxSpeed, maxSpeed);
  playerVelocity.y = Phaser.Math.Clamp(playerVelocity.y, -maxSpeed, maxSpeed);
  player.body.setVelocity(playerVelocity.x, playerVelocity.y);

   const isMoving = Math.abs(playerVelocity.x) > 10 || Math.abs(playerVelocity.y) > 10;
  if (isMoving && player.anims.currentAnim?.key !== "walk") {
    player.play("walk");
  } else if (!isMoving && player.anims.currentAnim?.key !== "idle") {
    player.play("idle");
  }
}

function pullExpOrbs() {
  expOrbs.getChildren().forEach((orb) => {
    const distance = Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y);

    if (distance < 150) {
      this.physics.moveToObject(orb, player, 520);
    }
  });
}

// ─── 레벨업 / 무기 선택 ───────────────────────────────────

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
  if (joystick) resetJoystick();
  player.body.setVelocity(0, 0);
  this.physics.pause();
  spawnTimer.paused = true;
  enemyHealthTimer.paused = true;
  enemySpawnGrowthTimer.paused = true;
}

function resumeGameplay() {
  isChoosingWeapon = false;
  this.physics.resume();
  spawnTimer.paused = false;
  enemyHealthTimer.paused = false;
  enemySpawnGrowthTimer.paused = false;
}

function showWeaponSelection() {
  const options = getRandomWeaponOptions();
  if (options.length === 0) return; 
  pauseGameplay.call(this);
  const overlay = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
  const shade = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.65)
    .setOrigin(0);

  const isCompact = this.scale.width < 760;
  const compactCardScale = Phaser.Math.Clamp((this.scale.height - 92) / (260 * 3 + 24), 0.54, 0.78);
  const cardScale = isCompact ? compactCardScale : 1;
  const compactCardHeight = 260 * cardScale;
  const titleY = isCompact ? 28 : this.scale.height / 2 - 170;
  const title = this.add.text(this.scale.width / 2, titleY, "\uBB34\uAE30 \uC120\uD0DD", {
    fontSize: "32px",
    color: "#ffffff",
    fontStyle: "bold",
  }).setOrigin(0.5);

  overlay.add([shade, title]);

  let didSelect = false;
  const selectOption = (weaponType) => {
    if (didSelect) return;
    didSelect = true;
    weaponManager.addOrUpgrade(weaponType.id);
    updateWeaponHud();
    overlay.destroy(true);
   
    resumeGameplay.call(this);
  };


  options.forEach((weaponType, index) => {
    const x = isCompact
      ? this.scale.width / 2
      : this.scale.width / 2 + (index - 1) * 250;
    const y = isCompact
      ? 62 + compactCardHeight / 2 + index * (compactCardHeight + 8)
      : this.scale.height / 2;
    const owned = weaponManager.getWeapon(weaponType.id);
    const nextLevel = owned ? Math.min(owned.level + 1, 5) : 1;
    const card = createWeaponCard.call(this, x, y, index + 1, weaponType, nextLevel);
    card.setScale(cardScale);

    const hitZone = this.add.zone(x, y, 230 * cardScale, 286 * cardScale)
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2001 + index)
      .setInteractive({ useHandCursor: true });

    hitZone.on("pointerdown", () => selectOption(weaponType));
    hitZone.on("pointerup", () => selectOption(weaponType));
    hitZone.on("pointerover", () => card.getByName("bg").setStrokeStyle(4, 0xffffff));
    hitZone.on("pointerout", () => card.getByName("bg").setStrokeStyle(2, weaponType.color));
    overlay.add([card, hitZone]);
  });
}

function createWeaponCard(x, y, number, weaponType, nextLevel) {
  const card = this.add.container(x, y);
  const nextDamage = getWeaponDamage(weaponType.id, nextLevel);
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
  const damageLabel = this.add.text(0, 52, `DMG ${formatDamage(nextDamage)} / hit`, {
    fontSize: "15px",
    color: "#fff0a6",
    fontStyle: "bold",
  }).setOrigin(0.5);
  const desc = this.add.text(0, 88, weaponType.desc[nextLevel - 1], {
    fontSize: "15px",
    color: "#d8deea",
    align: "center",
    wordWrap: { width: 160 },
  }).setOrigin(0.5);

  card.add([bg, key, icon, name, levelLabel, damageLabel, desc]);
  return card;
}

function getRandomWeaponOptions() {
  const ownedWeapons = weaponManager.getOwnedWeaponTypes();
  const maxedWeapons = weaponManager.weapons
    .filter((w) => w.level >= 5)
    .map((w) => w.type);

  const pool = ownedWeapons.length >= weaponManager.maxWeapons
    ? WEAPON_TYPES.filter((w) => ownedWeapons.includes(w.id) && !maxedWeapons.includes(w.id))
    : WEAPON_TYPES.filter((w) => !maxedWeapons.includes(w.id));

  if (pool.length === 0) return [];
  return Phaser.Utils.Array.Shuffle([...pool]).slice(0, 3);
}

function updateWeaponHud() {
  weaponText.setText(
    weaponManager.weapons
      .map((weapon) => `${weapon.definition.name} Lv.${weapon.level}`)
      .join(" / ")
  );
  layoutHud(weaponText.scene);
}

function updateExpHud() {
  expInfoText.setText(`Lv. ${level}\nEXP ${exp}/${expToNextLevel}`);
}

function layoutHud(scene, width = scene.scale.width, height = scene.scale.height) {
  const padding = Math.max(14, Math.min(24, width * 0.035));
  const compact = width < 640;
  const safeWidth = Math.max(150, width - padding * 2);

  levelText.setPosition(padding, padding);
  levelText.setFontSize(compact ? "18px" : "24px");

  weaponText.setPosition(padding, compact ? padding + 34 : padding + 38);
  weaponText.setFontSize(compact ? "12px" : "16px");
  weaponText.setWordWrapWidth(compact ? Math.floor(safeWidth * 0.62) : Math.floor(safeWidth * 0.55));

  expInfoText.setPosition(width - padding, padding);
  expInfoText.setFontSize(compact ? "12px" : "15px");
  expInfoText.setWordWrapWidth(Math.floor(safeWidth * 0.35));

  scene.cameras.main.setViewport(0, 0, width, height);

  healthBarBg.setPosition(width - 210, 72);
healthBarGreen.setPosition(width - 210, 72);
healthBarRed.setPosition(width - 210, 72);
}

function updateCameraZoom(width) {
  this.cameras.main.setZoom(width < 640 ? 0.86 : 1.05);
}

function formatDamage(value) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function getWeaponDamage(type, level) {
  const damageTable = {
    machineGun: [0.7, 0.9, 1.1, 1.3, 1.6],
    magicMissile: [2.2, 2.7, 3.2, 3.8, 4.5],
    lightning: [2.5, 3.1, 3.7, 4.4, 5.2],
    sword: [1.6, 2.1, 2.6, 3.1, 3.8],
    laser: [2.4, 3.0, 3.6, 4.3, 5.0],
    skull:  [3.0, 3.8, 4.6, 5.5, 6.5],
    lung:   [2.8, 3.5, 4.2, 5.2, 6.2],
    scythe: [4.0, 5.0, 6.0, 7.2, 8.5],
  };

  return damageTable[type][Math.min(level, 5) - 1];
}

// ─── 적 스폰 ──────────────────────────────────────────────

function spawnEnemy() {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = 1200;
  const x = player.x + Math.cos(angle) * distance;
  const y = player.y + Math.sin(angle) * distance;
  const enemy = this.add.circle(x, y, 20, 0xff3355);

  this.physics.add.existing(enemy);
  enemy.maxHp = enemyMaxHp;
  enemy.hp = enemy.maxHp;
  enemy.burnUntil = 0;
  enemy.stunnedUntil = 0;
  enemies.add(enemy);
}

function spawnEnemyWave() {
  enemySpawnRemainder += 1 + enemySpawnBonus;
  const spawnCount = Math.floor(enemySpawnRemainder);
  enemySpawnRemainder -= spawnCount;

  for (let i = 0; i < spawnCount; i++) {
    spawnEnemy.call(this);
  }
}

function increaseEnemyMaxHp() {
  enemyMaxHp += 5;

  enemies.getChildren().forEach((enemy) => {
    if (!enemy.active) return;

    enemy.maxHp = (enemy.maxHp || enemyMaxHp - 5) + 5;
    enemy.hp += 5;
    showEnemyGrowthPulse.call(this, enemy.x, enemy.y);
  });
}

function increaseEnemySpawnAmount() {
  enemySpawnBonus += 0.15;
}

// ─── 전투 ────────────────────────────────────────────────

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
  showHitFlash.call(this, enemy.x, enemy.y);

  if (enemy.hp <= 0) {
    showDeathBurst.call(this, enemy.x, enemy.y);
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
  const blast = this.add.circle(x, y, radius, 0xffaa33, 0.24).setDepth(40);
  const ring = this.add.circle(x, y, radius * 0.45, 0xffdd88, 0).setStrokeStyle(4, 0xffdd88, 0.9).setDepth(41);

  this.tweens.add({
    targets: blast,
    alpha: 0,
    scale: 1.4,
    duration: 220,
    onComplete: () => blast.destroy(),
  });

  this.tweens.add({
    targets: ring,
    alpha: 0,
    scale: 2.2,
    duration: 260,
    ease: "Cubic.easeOut",
    onComplete: () => ring.destroy(),
  });

  for (let i = 0; i < 10; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const spark = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0xfff0aa, 0.9).setDepth(42);

    this.tweens.add({
      targets: spark,
      x: x + Math.cos(angle) * Phaser.Math.Between(radius * 0.45, radius),
      y: y + Math.sin(angle) * Phaser.Math.Between(radius * 0.45, radius),
      alpha: 0,
      scale: 0.2,
      duration: Phaser.Math.Between(160, 280),
      onComplete: () => spark.destroy(),
    });
  }

  enemies.getChildren().forEach((enemy) => {
    if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
      damageEnemy.call(this, enemy, damage);
    }
  });
}

function updateProjectiles(time) {
  bullets.getChildren().forEach((bullet) => {
    if (bullet.trailColor && (!bullet.nextTrail || time > bullet.nextTrail)) {
      bullet.nextTrail = time + 45;
      showTrailDot.call(this, bullet.x, bullet.y, bullet.trailColor, bullet.trailSize || bullet.radius || 5);
    }

    if (bullet.homing && bullet.target && bullet.target.active) {
      this.physics.moveToObject(bullet, bullet.target, bullet.speed || 520);
    }

    if (bullet.isTracer && bullet.body) {
      bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
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
  if (enemy.poisonUntil > time && (!enemy.nextPoisonTick || time > enemy.nextPoisonTick)) {
      enemy.nextPoisonTick = time + 400;
      damageEnemy.call(this, enemy, enemy.poisonDamage || 0.4);
      enemy.setFillStyle(0x99ff66);
    }
  });
}

// ─── 투사체 생성 ──────────────────────────────────────────

function createProjectile(scene, x, y, color, radius = 6) {
  const bullet = scene.add.circle(x, y, radius, color);
  scene.physics.add.existing(bullet);
  bullet.trailColor = color;
  bullet.trailSize = radius;
  bullets.add(bullet);
  return bullet;
}

function createTracerProjectile(scene, x, y, angle, color = 0xffff66) {
  const bullet = scene.add.rectangle(x, y, 22, 3, color, 0.95)
    .setRotation(angle)
    .setDepth(24);

  scene.physics.add.existing(bullet);
  bullet.body.setSize(22, 3);
  bullet.isTracer = true;
  bullet.trailColor = color;
  bullet.trailSize = 3;
  bullets.add(bullet);
  return bullet;
}

// ─── 이펙트 ───────────────────────────────────────────────

function showMuzzleFlash(scene, x, y, angle, color = 0xffffaa) {
  const flash = scene.add.triangle(
    x + Math.cos(angle) * 18,
    y + Math.sin(angle) * 18,
    0, -7, 28, 0, 0, 7,
    color, 0.85
  ).setRotation(angle).setDepth(38);

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    scale: 1.8,
    duration: 90,
    onComplete: () => flash.destroy(),
  });
}

function showTrailDot(x, y, color, size = 5) {
  const trail = this.add.circle(x, y, size, color, 0.28).setDepth(10);

  this.tweens.add({
    targets: trail,
    alpha: 0,
    scale: 0.25,
    duration: 180,
    onComplete: () => trail.destroy(),
  });
}

function showHitFlash(x, y) {
  const flash = this.add.circle(x, y, 18, 0xffffff, 0.28).setDepth(55);

  this.tweens.add({
    targets: flash,
    alpha: 0,
    scale: 0.15,
    duration: 90,
    onComplete: () => flash.destroy(),
  });
}

function showDeathBurst(x, y) {
  const ring = this.add.circle(x, y, 20, 0xff6688, 0).setStrokeStyle(3, 0xff6688, 0.9).setDepth(44);

  this.tweens.add({
    targets: ring,
    alpha: 0,
    scale: 2.2,
    duration: 220,
    onComplete: () => ring.destroy(),
  });

  for (let i = 0; i < 7; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const shard = this.add.rectangle(x, y, 10, 3, 0xff6688, 0.9)
      .setRotation(angle)
      .setDepth(43);

    this.tweens.add({
      targets: shard,
      x: x + Math.cos(angle) * Phaser.Math.Between(25, 55),
      y: y + Math.sin(angle) * Phaser.Math.Between(25, 55),
      alpha: 0,
      duration: 210,
      onComplete: () => shard.destroy(),
    });
  }
}

function showEnemyGrowthPulse(x, y) {
  const pulse = this.add.circle(x, y, 24, 0xff3355, 0)
    .setStrokeStyle(2, 0xff99aa, 0.75)
    .setDepth(35);

  this.tweens.add({
    targets: pulse,
    alpha: 0,
    scale: 1.8,
    duration: 260,
    onComplete: () => pulse.destroy(),
  });
}

function showLightningStrike(scene, x, y, isStorm = false) {
  const height = isStorm ? 620 : 470;
  const topY = y - height;
  const bolt = scene.add.graphics().setDepth(70);
  const glow = scene.add.graphics().setDepth(69);
  const points = [];
  const segments = 9;

  for (let i = 0; i <= segments; i++) {
    const progress = i / segments;
    const spread = i === 0 || i === segments ? 0 : Phaser.Math.Between(-26, 26);
    points.push({ x: x + spread, y: topY + height * progress });
  }

  glow.lineStyle(isStorm ? 24 : 18, 0x9eeeff, 0.22);
  bolt.lineStyle(isStorm ? 7 : 5, 0xeaffff, 0.96);
  drawPolyline(glow, points);
  drawPolyline(bolt, points);

  for (let i = 2; i < points.length - 1; i += 2) {
    const start = points[i];
    const branchDirection = Math.random() < 0.5 ? -1 : 1;
    const branch = scene.add.graphics().setDepth(70);
    const endX = start.x + branchDirection * Phaser.Math.Between(36, 72);
    const endY = start.y + Phaser.Math.Between(18, 52);

    branch.lineStyle(2, 0xcff7ff, 0.86);
    branch.beginPath();
    branch.moveTo(start.x, start.y);
    branch.lineTo((start.x + endX) / 2 + branchDirection * 14, (start.y + endY) / 2);
    branch.lineTo(endX, endY);
    branch.strokePath();

    scene.tweens.add({
      targets: branch,
      alpha: 0,
      duration: 140,
      onComplete: () => branch.destroy(),
    });
  }

  const impactGlow = scene.add.circle(x, y, isStorm ? 52 : 40, 0x99eeff, 0.32).setDepth(68);
  const impactRing = scene.add.circle(x, y, isStorm ? 34 : 26, 0xffffff, 0)
    .setStrokeStyle(4, 0xcff7ff, 0.9).setDepth(71);
  const scorch = scene.add.circle(x, y + 4, isStorm ? 30 : 22, 0x23465a, 0.34).setDepth(8);

  scene.tweens.add({
    targets: [bolt, glow],
    alpha: 0,
    duration: 150,
    onComplete: () => { bolt.destroy(); glow.destroy(); },
  });
  scene.tweens.add({
    targets: impactGlow,
    alpha: 0,
    scale: 1.7,
    duration: 230,
    onComplete: () => impactGlow.destroy(),
  });
  scene.tweens.add({
    targets: impactRing,
    alpha: 0,
    scale: 2.1,
    duration: 260,
    onComplete: () => impactRing.destroy(),
  });
  scene.tweens.add({
    targets: scorch,
    alpha: 0,
    duration: 900,
    onComplete: () => scorch.destroy(),
  });
}

function drawPolyline(graphics, points) {
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();
}

function showLaserBeam(scene, startX, startY, endX, endY, burn = false) {
  const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
  const length = Phaser.Math.Distance.Between(startX, startY, endX, endY);
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const glowColor = burn ? 0xff8844 : 0xff5533;

  const core = scene.add.rectangle(midX, midY, length, 4, 0xffffff, 0.95).setRotation(angle).setDepth(61);
  const beam = scene.add.rectangle(midX, midY, length, 10, 0xff5533, 0.82).setRotation(angle).setDepth(60);
  const glow = scene.add.rectangle(midX, midY, length, 26, glowColor, 0.22).setRotation(angle).setDepth(59);
  const muzzle = scene.add.circle(startX, startY, 22, 0xff5533, 0.35).setDepth(62);
  const endpoint = scene.add.circle(endX, endY, 18, 0xffaa66, 0.25).setDepth(62);

  scene.tweens.add({
    targets: [core, beam, glow],
    alpha: 0,
    scaleY: 0.25,
    duration: 180,
    ease: "Cubic.easeOut",
    onComplete: () => { core.destroy(); beam.destroy(); glow.destroy(); },
  });
  scene.tweens.add({
    targets: [muzzle, endpoint],
    alpha: 0,
    scale: 1.8,
    duration: 180,
    onComplete: () => { muzzle.destroy(); endpoint.destroy(); },
  });
}

// ─── 유틸 ─────────────────────────────────────────────────

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
    bullet.damage = getWeaponDamage("magicMissile", 5) * 0.45;
    bullet.homing = true;
    bullet.target = target;
    bullet.speed = 520;
    this.physics.moveToObject(bullet, target, bullet.speed);
  });
}

// ─── 무기 클래스 ──────────────────────────────────────────

class WeaponManager {
  constructor(scene) {
    this.scene = scene;
    this.weapons = [];
    this.maxWeapons = 3;
  }

  addOrUpgrade(type) {
    const owned = this.getWeapon(type);
    if (owned) { owned.upgrade(); return true; }
    if (this.weapons.length >= this.maxWeapons) return false;
    this.weapons.push(createWeapon(this.scene, type));
    return true;
  }

  getWeapon(type) { return this.weapons.find((w) => w.type === type); }
  getOwnedWeaponTypes() { return this.weapons.map((w) => w.type); }
  tick(time, delta) { this.weapons.forEach((w) => w.tick(time, delta)); }
}

class AutoWeapon {
  constructor(scene, type, cooldown) {
    this.scene = scene;
    this.type = type;
    this.level = 1;
    this.cooldown = cooldown;
    this.lastFire = 0;
    this.definition = WEAPON_TYPES.find((w) => w.id === type);
  }

  upgrade() { this.level = Math.min(this.level + 1, 5); }
  canFire(time, cooldown = this.cooldown) { return time > this.lastFire + cooldown; }
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

        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        const shotColor = this.level >= 3 && this.shotCount % 8 === 0 ? 0x99ff66 : 0xffff66;
        const bullet = createTracerProjectile(this.scene, player.x + i * 10 - 5, player.y, angle, shotColor);
        bullet.damage = getWeaponDamage(this.type, this.level);
        bullet.explodeRadius = this.level >= 4 ? 55 : 0;
        bullet.explodeDamage = getWeaponDamage(this.type, this.level) * 0.6;
        bullet.trailColor = shotColor;
        bullet.trailSize = 4;

        this.shotCount++;
        if (this.level >= 3 && this.shotCount % 8 === 0) {
          bullet.homing = true;
          bullet.target = target;
          bullet.speed = 650;
        }

        showMuzzleFlash(this.scene, player.x, player.y, angle, 0xffffaa);
        this.scene.physics.moveToObject(bullet, target, 650);
      }
    }

    if (this.level >= 5 && time > this.lastDroneShot + 650) {
      this.lastDroneShot = time;
      [-55, 55].forEach((offset) => {
        const target = findNearestEnemy();
        if (!target) return;

        const angle = Phaser.Math.Angle.Between(player.x + offset, player.y - 30, target.x, target.y);
        const bullet = createTracerProjectile(this.scene, player.x + offset, player.y - 30, angle, 0x99ff66);
        bullet.damage = getWeaponDamage(this.type, this.level) * 0.75;
        bullet.trailColor = 0x99ff66;
        showMuzzleFlash(this.scene, player.x + offset, player.y - 30, angle, 0x99ff66);
        this.scene.physics.moveToObject(bullet, target, 580);
      });
    }
  }
}

class MagicMissileWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "magicMissile", 760); }

  tick(time) {
    if (!this.canFire(time)) return;

    this.lastFire = time;
    const count = this.level >= 2 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const target = findNearestEnemy();
      if (!target) return;

      const bullet = createProjectile(this.scene, player.x, player.y, 0xbb88ff, 7);
      const aura = this.scene.add.circle(player.x, player.y, 18, 0xbb88ff, 0.22).setDepth(32);
      bullet.damage = getWeaponDamage(this.type, this.level);
      bullet.homing = true;
      bullet.target = target;
      bullet.speed = 480;
      bullet.pierce = this.level >= 3 ? 1 : 0;
      bullet.explodeRadius = this.level >= 4 ? 70 : 0;
      bullet.explodeDamage = getWeaponDamage(this.type, this.level) * 0.5;
      bullet.splitOnHit = this.level >= 5;
      bullet.trailColor = 0xd6a6ff;
      bullet.trailSize = 8;
      this.scene.tweens.add({
        targets: aura,
        alpha: 0,
        scale: 2.1,
        duration: 220,
        onComplete: () => aura.destroy(),
      });
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
        chained.forEach((target) => this.strike(target, time, getWeaponDamage(this.type, this.level) * 0.55));
      }
    }

    if (this.level >= 5 && time > this.lastStorm + 2500) {
      this.lastStorm = time;
      findEnemiesInRange(player.x, player.y, 900, 5).forEach((target) =>
        this.strike(target, time, getWeaponDamage(this.type, this.level) * 0.75)
      );
    }
  }

  strike(target, time, damage = getWeaponDamage("lightning", this.level)) {
    showLightningStrike(this.scene, target.x, target.y, this.level >= 5);
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
      if (this.level >= 4) this.swordWave();
    }

    if (this.level >= 5) {
      this.rotationAngle += delta * 0.006;
      const radius = 95;
      const x = player.x + Math.cos(this.rotationAngle) * radius;
      const y = player.y + Math.sin(this.rotationAngle) * radius;
      const blade = this.scene.add.rectangle(x, y, 42, 10, 0xffd1dc, 0.85)
        .setRotation(this.rotationAngle).setDepth(30);
      this.scene.tweens.add({
        targets: blade,
        alpha: 0,
        duration: 90,
        onComplete: () => blade.destroy(),
      });
      if (time > this.lastSpinDamage + 250) {
        this.lastSpinDamage = time;
        findEnemiesInRange(player.x, player.y, radius + 35, 4).forEach((enemy) => {
          damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level) * 0.45);
        });
      }
    }
  }

  swing() {
    const range = this.level >= 2 ? 150 : 105;
    const target = findNearestEnemy();
    const angle = target
      ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y)
      : this.rotationAngle;
    const arc = this.scene.add.arc(player.x, player.y, range, -65, 65, false, 0xffd1dc, 0.2)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(8, 0xffffff, 0.55).setDepth(25);
    const edge = this.scene.add.arc(player.x, player.y, range + 10, -55, 55, false, 0xffffff, 0)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(3, 0xffd1dc, 0.9).setDepth(26);

    this.scene.tweens.add({
      targets: [arc, edge],
      alpha: 0,
      scale: 1.15,
      duration: 180,
      onComplete: () => { arc.destroy(); edge.destroy(); },
    });
    findEnemiesInRange(player.x, player.y, range, 8).forEach((enemy) => {
      damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level));
    });
  }

 swordWave() {
  const target = findNearestEnemy();
  if (!target) return;

  const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
  const wave = this.scene.add.arc(player.x, player.y, 90, -75, 75, false, 0xffd1dc, 0.25)
    .setStrokeStyle(18, 0xffffff, 0.85).setRotation(angle).setScale(1.6, 1.1).setDepth(31);

  this.scene.physics.add.existing(wave);
  wave.body.setSize(160, 100);
  bullets.add(wave);
  wave.damage = getWeaponDamage(this.type, this.level) * 0.8;
  wave.trailColor = 0xffd1dc;
  wave.trailSize = 28;
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
      this.fireLaser(this.spinAngle, 700, true, getWeaponDamage(this.type, this.level) * 0.35);
    }
  }

  fireLaser(angle, length, burn = false, damage = getWeaponDamage("laser", this.level)) {
    const endX = player.x + Math.cos(angle) * length;
    const endY = player.y + Math.sin(angle) * length;
    showLaserBeam(this.scene, player.x, player.y, endX, endY, burn);

    enemies.getChildren().forEach((enemy) => {
      const distance = distanceToSegment(enemy.x, enemy.y, player.x, player.y, endX, endY);
      if (distance <= 28) {
        if (burn) enemy.burnUntil = this.scene.time.now + 1200;
        damageEnemy.call(this.scene, enemy, damage);
      }
    });
  }
}

class SkullWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "skull", 5000);
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    const radius = this.level >= 3 ? 280 : 200;
    const poisonDuration = this.level >= 2 ? 2500 : 1500;
    const stunDuration = this.level >= 4 ? 1000 : 500;

    // 해골 문양 이펙트
    this.showSkullEffect(radius);

    const targets = findEnemiesInRange(player.x, player.y, radius);
    targets.forEach((enemy) => {
      // 스턴
      enemy.stunnedUntil = time + stunDuration;
      enemy.setFillStyle(0xcc99ff);

      // 독
      const stacks = this.level >= 5 ? 2 : 1;
      enemy.poisonUntil = Math.max(enemy.poisonUntil || 0, time + poisonDuration * stacks);
      enemy.poisonDamage = getWeaponDamage(this.type, this.level) * 0.3;
      enemy.nextPoisonTick = 0;

      // 즉발 피해
      damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level));
    });
  }

  showSkullEffect(radius) {
    // 외곽 링
    const ring = this.scene.add.circle(player.x, player.y, radius, 0xcc99ff, 0)
      .setStrokeStyle(3, 0xcc99ff, 0.7).setDepth(50);

    // 내부 안개
    const fog = this.scene.add.circle(player.x, player.y, radius * 0.85, 0x220033, 0.18).setDepth(49);

    // 해골 심볼 (눈 두 개 + 코)
    const skullX = player.x;
    const skullY = player.y - 36;

    const eye1 = this.scene.add.circle(skullX - 10, skullY, 6, 0xcc99ff, 0.9).setDepth(52);
    const eye2 = this.scene.add.circle(skullX + 10, skullY, 6, 0xcc99ff, 0.9).setDepth(52);
    const nose = this.scene.add.triangle(
      skullX, skullY + 10,
      -4, -4, 4, -4, 0, 6,
      0xcc99ff, 0.7
    ).setDepth(52);

    const outer = this.scene.add.circle(skullX, skullY, 22, 0xcc99ff, 0)
      .setStrokeStyle(2, 0xcc99ff, 0.5).setDepth(51);

    // 파티클 독 방울
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const drop = this.scene.add.circle(
        player.x + Math.cos(angle) * radius * 0.5,
        player.y + Math.sin(angle) * radius * 0.5,
        4, 0x99ff66, 0.8
      ).setDepth(51);

      this.scene.tweens.add({
        targets: drop,
        x: player.x + Math.cos(angle) * radius,
        y: player.y + Math.sin(angle) * radius,
        alpha: 0,
        scale: 0.2,
        duration: 600,
        onComplete: () => drop.destroy(),
      });
    }

    this.scene.tweens.add({
      targets: [ring, fog],
      alpha: 0,
      scale: 1.15,
      duration: 700,
      ease: "Cubic.easeOut",
      onComplete: () => { ring.destroy(); fog.destroy(); },
    });

    this.scene.tweens.add({
      targets: [eye1, eye2, nose, outer],
      alpha: 0,
      y: `-=18`,
      duration: 800,
      ease: "Cubic.easeOut",
      onComplete: () => { eye1.destroy(); eye2.destroy(); nose.destroy(); outer.destroy(); },
    });
  }
}

class LungWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "lung", 4000);
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    const count = this.level >= 3 ? 5 : 3;
    const radius = this.level >= 2 ? 130 : 95;
    const damage = getWeaponDamage(this.type, this.level);
    const burnOnHit = this.level >= 5;

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 220, () => {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist = Phaser.Math.FloatBetween(40, 160);
        const ex = player.x + Math.cos(angle) * dist;
        const ey = player.y + Math.sin(angle) * dist;

        explode.call(this.scene, ex, ey, radius, damage * (this.level >= 4 ? 1.4 : 1.0));

        if (burnOnHit) {
          findEnemiesInRange(ex, ey, radius).forEach((enemy) => {
            enemy.burnUntil = Math.max(enemy.burnUntil || 0, this.scene.time.now + 1500);
          });
        }

        // 연기 이펙트
        const smoke = this.scene.add.circle(ex, ey, radius * 0.6, 0xff6622, 0.15).setDepth(38);
        this.scene.tweens.add({
          targets: smoke,
          alpha: 0,
          scale: 1.6,
          y: smoke.y - 30,
          duration: 500,
          onComplete: () => smoke.destroy(),
        });
      });
    }
  }
}

class ScytheWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "scythe", 2000);
    this.swingAngle = 0;
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    const swings = this.level >= 3 ? 2 : 1;
    for (let i = 0; i < swings; i++) {
      this.scene.time.delayedCall(i * 280, () => this.swing(time));
    }

    if (this.level >= 5) {
      this.scene.time.delayedCall(600, () => this.spawnWhirlwind(time));
    }
  }

  swing(time) {
    const target = findNearestEnemy();
    const range = this.level >= 2 ? 210 : 160;
    const baseAngle = target
      ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y)
      : this.swingAngle;

    this.swingAngle = baseAngle;

    // 낫 호 — 크고 날카롭게
    const arc = this.scene.add.arc(player.x, player.y, range, -75, 75, false, 0x88ffcc, 0.15)
      .setAngle(Phaser.Math.RadToDeg(baseAngle))
      .setStrokeStyle(10, 0x88ffcc, 0.85)
      .setDepth(28);

    const edge = this.scene.add.arc(player.x, player.y, range + 14, -68, 68, false, 0xffffff, 0)
      .setAngle(Phaser.Math.RadToDeg(baseAngle))
      .setStrokeStyle(3, 0xccffee, 0.95)
      .setDepth(29);

    // 손잡이
    const handleEndX = player.x + Math.cos(baseAngle + Math.PI) * 55;
    const handleEndY = player.y + Math.sin(baseAngle + Math.PI) * 55;
    const handle = this.scene.add.line(
      0, 0,
      player.x, player.y,
      handleEndX, handleEndY,
      0x88ffcc, 0.6
    ).setLineWidth(3).setDepth(27);

    // 슬래시 잔상
    for (let i = 0; i < 6; i++) {
      const trailAngle = baseAngle - 0.55 + (i / 6) * 1.1;
      const tx = player.x + Math.cos(trailAngle) * range;
      const ty = player.y + Math.sin(trailAngle) * range;
      const trail = this.scene.add.circle(tx, ty, 5, 0x88ffcc, 0.5).setDepth(27);
      this.scene.tweens.add({
        targets: trail,
        alpha: 0,
        scale: 0.1,
        duration: 200 + i * 30,
        onComplete: () => trail.destroy(),
      });
    }

    this.scene.tweens.add({
      targets: [arc, edge, handle],
      alpha: 0,
      scale: 1.08,
      duration: 250,
      ease: "Cubic.easeOut",
      onComplete: () => { arc.destroy(); edge.destroy(); handle.destroy(); },
    });

    const pierce = this.level >= 4;
    const hitEnemies = new Set();

    findEnemiesInRange(player.x, player.y, range, pierce ? Infinity : 8).forEach((enemy) => {
      const eAngle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
      const diff = Phaser.Math.Angle.Wrap(eAngle - baseAngle);
      if (Math.abs(diff) <= 1.35 && !hitEnemies.has(enemy)) {
        hitEnemies.add(enemy);
        damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level));
      }
    });
  }

  spawnWhirlwind(time) {
    const duration = 1800;
    const radius = 120;
    let elapsed = 0;
    let angle = 0;

    const timer = this.scene.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        elapsed += 80;
        angle += 0.45;

        const wx = player.x + Math.cos(angle) * 60;
        const wy = player.y + Math.sin(angle) * 60;

        const blade = this.scene.add.arc(wx, wy, 38, -90, 90, false, 0x88ffcc, 0.18)
          .setAngle(Phaser.Math.RadToDeg(angle))
          .setStrokeStyle(4, 0xccffee, 0.7)
          .setDepth(30);

        this.scene.tweens.add({
          targets: blade,
          alpha: 0,
          scale: 1.2,
          duration: 160,
          onComplete: () => blade.destroy(),
        });

        findEnemiesInRange(wx, wy, radius * 0.55, 4).forEach((enemy) => {
          damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level) * 0.35);
        });

        if (elapsed >= duration) timer.destroy();
      },
    });
  }
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) return Phaser.Math.Distance.Between(px, py, x1, y1);

  const t = Phaser.Math.Clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  return Phaser.Math.Distance.Between(px, py, x1 + t * dx, y1 + t * dy);
}

function createWeapon(scene, type) {
  switch (type) {
    case "machineGun": return new MachineGunWeapon(scene);
    case "magicMissile": return new MagicMissileWeapon(scene);
    case "lightning": return new LightningWeapon(scene);
    case "sword": return new SwordWeapon(scene);
    case "laser": return new LaserWeapon(scene);
    case "skull":  return new SkullWeapon(scene);
    case "lung":   return new LungWeapon(scene);
    case "scythe": return new ScytheWeapon(scene);
    default: throw new Error(`Unknown weapon type: ${type}`);
  }
}

function applyContactDamage(delta) {
  if (isDead) return;
  if (devMode) return; // ← 추가
  let touchingEnemy = false;

  enemies.getChildren().forEach((enemy) => {
    if (!enemy.active) return;

    const dist = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      enemy.x,
      enemy.y
    );

    if (dist < 38) {
      touchingEnemy = true;
    }
  });

  if (!touchingEnemy) return;

  const damage =
    CONTACT_DAMAGE_PER_SEC * (delta / 1000);

  playerHp -= damage;

 player.setTint(0xff8888);

  if (this.time.now > lastDamageTime + 80) {
    lastDamageTime = this.time.now;

    this.tweens.add({
      targets: player,
      alpha: 0.55,
      duration: 60,
      yoyo: true,
    });
     showBloodEffect.call(this, player.x, player.y);
  }

  if (playerHp <= 0) {
    playerHp = 0;
    killPlayer.call(this);
  }
}

function updateHealthBar() {
  const ratio = Phaser.Math.Clamp(
    playerHp / playerMaxHp,
    0,
    1
  );

  const width = 180 * ratio;

  healthBarGreen.width = width;
  healthBarRed.width = 180 - width;
  healthBarRed.x =
    healthBarBg.x + width;
}

function killPlayer() {
  if (isDead) return;
  isDead = true;

  this.physics.pause();

  const deathTexts = [
    "YOU DIED",
    "MISSION FAILED",
    "ERASED",
    "THE NIGHT CONSUMED YOU",
  ];

  const chosen =
    Phaser.Utils.Array.GetRandom(
      deathTexts
    );

  const surviveTime = Math.floor(
    (this.time.now - gameStartTime) /
      1000
  );

  const overlay = this.add
    .rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.75
    )
    .setOrigin(0)
    .setScrollFactor(0)
    .setDepth(5000);

  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 - 50,
      chosen,
      {
        fontSize: "52px",
        color: "#ff4444",
        fontStyle: "bold",
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(5001);

  this.add
    .text(
      this.scale.width / 2,
      this.scale.height / 2 + 10,
      `생존 시간 ${surviveTime}초`,
      {
        fontSize: "24px",
        color: "#ffffff",
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(5001);

const restartBtnBg = this.add
  .rectangle(this.scale.width / 2, this.scale.height / 2 + 70, 180, 44, 0xff4444, 0.15)
  .setStrokeStyle(1.5, 0xff4444, 0.75)
  .setScrollFactor(0)
  .setDepth(5001)
  .setInteractive({ useHandCursor: true });

const restartBtnText = this.add
  .text(this.scale.width / 2, this.scale.height / 2 + 70, "RESTART", {
    fontSize: "18px",
    color: "#ff4444",
    fontStyle: "bold",
    letterSpacing: 4,
  })
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(5002)
  .setInteractive({ useHandCursor: true });

const doRestart = () => {
  isDead = false;
  exp = 0;
  level = 1;
  expToNextLevel = 5;
  playerHp = playerMaxHp;
  enemyMaxHp = 3;
  enemySpawnBonus = 0;
  enemySpawnRemainder = 0;
  playerVelocity.x = 0;
  playerVelocity.y = 0;
  this.scene.restart();
};

restartBtnBg.on("pointerdown", doRestart);
restartBtnText.on("pointerdown", doRestart);
}

function showStartScreen() {
  this.physics.pause();
  spawnTimer.paused = true;
  enemyHealthTimer.paused = true;
  enemySpawnGrowthTimer.paused = true;
  isChoosingWeapon = true;
 
  const W = this.scale.width;
  const H = this.scale.height;
  const cx = W / 2;
  const cy = H / 2;

  const objs = [];

  const bg = this.add.rectangle(0, 0, W, H, 0x000000, 0.88).setOrigin(0).setScrollFactor(0).setDepth(9000);
  const lineTop = this.add.rectangle(cx, cy - 112, 260, 1, 0x00ffd5, 0.35).setScrollFactor(0).setDepth(9001);
  const title1 = this.add.text(cx, cy - 88, "ABYSS", {
    fontSize: "64px", color: "#00ffd5", fontStyle: "bold", letterSpacing: 18,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const title2 = this.add.text(cx, cy - 20, "WALKER", {
    fontSize: "38px", color: "#ffffff", fontStyle: "bold", letterSpacing: 22,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const lineBot = this.add.rectangle(cx, cy + 18, 260, 1, 0x00ffd5, 0.35).setScrollFactor(0).setDepth(9001);
  const sub = this.add.text(cx, cy + 44, "어둠 속을 걸어라", {
    fontSize: "16px", color: "#7ecfc0", letterSpacing: 4,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const btnBg = this.add.rectangle(cx, cy + 108, 200, 48, 0x00ffd5, 0.12)
    .setStrokeStyle(1.5, 0x00ffd5, 0.75).setScrollFactor(0).setDepth(9002)
    .setInteractive({ useHandCursor: true });
  const btnText = this.add.text(cx, cy + 108, "ENTER THE ABYSS", {
    fontSize: "15px", color: "#00ffd5", fontStyle: "bold", letterSpacing: 3,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(9003)
    .setInteractive({ useHandCursor: true });
  const hint = this.add.text(cx, cy + 164, "WASD / 조이스틱으로 이동", {
    fontSize: "13px", color: "#446060",
  }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);

  objs.push(bg, lineTop, title1, title2, lineBot, sub, btnBg, btnText, hint);

  this.tweens.add({
    targets: [btnBg, btnText],
    alpha: { from: 0.6, to: 1 },
    duration: 900,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  objs.forEach((obj, i) => {
    obj.setAlpha(0);
    this.tweens.add({
      targets: obj,
      alpha: i === 1 || i === 4 ? 0.35 : 1,
      duration: 500,
      delay: i * 80,
    });
  });

const startGame = () => {
  objs.forEach((obj) => obj.destroy());
  this.physics.resume();
  spawnTimer.paused = false;
  enemyHealthTimer.paused = false;
  enemySpawnGrowthTimer.paused = false;
  isChoosingWeapon = false;
  gameStartTime = this.time.now;
};

  btnBg.on("pointerdown", startGame);
  btnText.on("pointerdown", startGame);
}

function showBloodEffect(x, y) {
  const centerX = x;
  const centerY = y + 20; // 머리에서 몸통으로 내림

  const count = Phaser.Math.Between(14, 20); // 양 증가

  for (let i = 0; i < count; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const size = Phaser.Math.FloatBetween(4, 9);
    const dist = Phaser.Math.FloatBetween(25, 75);

    // 핏방울 — 진한 빨강/검붉은 색 랜덤
    const colors = [0xff0000, 0xdd0000, 0xbb0011, 0x990000, 0xff1122];
    const color = colors[Phaser.Math.Between(0, colors.length - 1)];
    const drop = this.add.circle(centerX, centerY, size, color, 1.0).setDepth(60);

    this.tweens.add({
      targets: drop,
      x: centerX + Math.cos(angle) * dist,
      y: centerY + Math.sin(angle) * dist,
      alpha: 0,
      scale: 0.15,
      duration: Phaser.Math.Between(200, 420),
      ease: "Cubic.easeOut",
      onComplete: () => drop.destroy(),
    });
  }

  // 큰 번짐
  const splat1 = this.add.circle(centerX, centerY, 20, 0xcc0000, 0.7).setDepth(59);
  this.tweens.add({
    targets: splat1,
    alpha: 0,
    scale: 2.2,
    duration: 350,
    ease: "Cubic.easeOut",
    onComplete: () => splat1.destroy(),
  });

  // 작은 번짐 추가
  const splat2 = this.add.circle(centerX, centerY, 10, 0xff0011, 0.85).setDepth(59);
  this.tweens.add({
    targets: splat2,
    alpha: 0,
    scale: 1.5,
    duration: 200,
    ease: "Cubic.easeOut",
    onComplete: () => splat2.destroy(),
  });
}

function createDevConsole() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "...";
  input.style.cssText = `
    position: fixed;
    bottom: 12px;
    right: 12px;
    width: 140px;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.08);
    font-size: 12px;
    outline: none;
    z-index: 99999;
    caret-color: rgba(255,255,255,0.3);
  `;
  document.body.appendChild(input);

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const val = input.value.trim();
    input.value = "";
    input.blur();

if (val === "소드마스터") {
  devMode = !devMode;
  showDevNotice(devMode ? "⚔ DEV MODE ON" : "DEV MODE OFF", devMode ? "#00ffd5" : "#ff4444");
  if (devMode) createDevButton();
  else {
    removeDevPanel();
    removeDevButton();
  }
}
  });
}

function showDevNotice(msg, color) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${color};
    font-size: 28px;
    font-weight: bold;
    font-family: monospace;
    letter-spacing: 4px;
    z-index: 99999;
    pointer-events: none;
    text-shadow: 0 0 20px ${color};
    transition: opacity 0.5s;
  `;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; }, 800);
  setTimeout(() => el.remove(), 1300);
}

function showDevPanel() {
  removeDevPanel();

  const panel = document.createElement("div");
  panel.id = "dev-panel";
  panel.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(10, 14, 26, 0.97);
    border: 1px solid #00ffd5;
    border-radius: 10px;
    padding: 20px 24px;
    z-index: 99999;
    color: #ffffff;
    font-family: monospace;
    min-width: 320px;
    box-shadow: 0 0 30px rgba(0,255,213,0.15);
  `;

  const title = document.createElement("div");
  title.textContent = "⚔ DEV MODE";
  title.style.cssText = "color: #00ffd5; font-size: 16px; font-weight: bold; letter-spacing: 3px; margin-bottom: 16px;";
  panel.appendChild(title);

  WEAPON_TYPES.forEach((weapon) => {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 10px;";

    const label = document.createElement("span");
    label.textContent = weapon.name;
    label.style.cssText = "width: 100px; font-size: 13px; color: #b7f7ff;";

    const select = document.createElement("select");
    select.style.cssText = `
      background: #1a2030;
      border: 1px solid #334;
      color: #fff;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
    `;

    const noneOpt = document.createElement("option");
    noneOpt.value = "0";
    noneOpt.textContent = "없음";
    select.appendChild(noneOpt);

    for (let i = 1; i <= 5; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = `Lv.${i}`;
      select.appendChild(opt);
    }

    // 현재 보유 레벨 반영
    const owned = weaponManager.getWeapon(weapon.id);
    select.value = owned ? String(owned.level) : "0";

    select.addEventListener("change", () => {
      const lv = parseInt(select.value);
      if (lv === 0) {
        // 무기 제거
        weaponManager.weapons = weaponManager.weapons.filter((w) => w.type !== weapon.id);
      } else {
        const existing = weaponManager.getWeapon(weapon.id);
        if (existing) {
          existing.level = lv;
        } else {
          if (weaponManager.weapons.length < weaponManager.maxWeapons) {
            weaponManager.addOrUpgrade(weapon.id);
            const added = weaponManager.getWeapon(weapon.id);
            if (added) added.level = lv;
          } else {
            showDevNotice("슬롯 가득참! (최대 3개)", "#ff4444");
            select.value = "0";
            return;
          }
        }
      }
      updateWeaponHud();
    });

    row.appendChild(label);
    row.appendChild(select);
    panel.appendChild(row);
  });

  // 최대 무기 슬롯 조절
  const slotRow = document.createElement("div");
  slotRow.style.cssText = "display: flex; align-items: center; gap: 10px; margin-top: 14px; border-top: 1px solid #223; padding-top: 12px;";
  const slotLabel = document.createElement("span");
  slotLabel.textContent = "무기 슬롯";
  slotLabel.style.cssText = "width: 100px; font-size: 13px; color: #b7f7ff;";
  const slotSelect = document.createElement("select");
  slotSelect.style.cssText = `
    background: #1a2030;
    border: 1px solid #334;
    color: #fff;
    padding: 3px 6px;
    border-radius: 4px;
    font-size: 12px;
  `;
  for (let i = 1; i <= 8; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${i}개`;
    if (i === weaponManager.maxWeapons) opt.selected = true;
    slotSelect.appendChild(opt);
  }
  slotSelect.addEventListener("change", () => {
    weaponManager.maxWeapons = parseInt(slotSelect.value);
  });
  slotRow.appendChild(slotLabel);
  slotRow.appendChild(slotSelect);
  panel.appendChild(slotRow);

  // 닫기 버튼
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "닫기";
  closeBtn.style.cssText = `
    margin-top: 16px;
    width: 100%;
    background: transparent;
    border: 1px solid #00ffd5;
    color: #00ffd5;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 13px;
    letter-spacing: 2px;
  `;
  closeBtn.addEventListener("click", () => removeDevPanel());
  panel.appendChild(closeBtn);

  document.body.appendChild(panel);
  devPanelEl = panel;
}

function removeDevPanel() {
  if (devPanelEl) {
    devPanelEl.remove();
    devPanelEl = null;
  }
}

function createDevButton() {
  removeDevButton();

  const btn = document.createElement("button");
  btn.textContent = "⚔ DEV";
  btn.style.cssText = `
    position: fixed;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 14, 26, 0.85);
    border: 1px solid #00ffd5;
    color: #00ffd5;
    padding: 6px 18px;
    border-radius: 6px;
    cursor: pointer;
    font-family: monospace;
    font-size: 13px;
    letter-spacing: 3px;
    z-index: 99999;
  `;

  btn.addEventListener("click", () => {
    if (devPanelEl) removeDevPanel();
    else showDevPanel();
  });

  document.body.appendChild(btn);
  devBtnEl = btn;
}

function removeDevButton() {
  if (devBtnEl) {
    devBtnEl.remove();
    devBtnEl = null;
  }
}