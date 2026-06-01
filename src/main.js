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
  {
  id: "blackHole",
  name: "블랙홀",
  icon: "BH",
  color: 0xaa44ff,
  desc: ["적 흡입 후 폭발", "반경+피해 증가", "2개 동시 소환", "흡입 슬로우+폭발 스턴", "미니 블랙홀 3개 생성"],
},
{
  id: "boomerang",
  name: "부메랑",
  icon: "BR",
  color: 0x88ffdd,
  desc: ["관통 왕복 투사체", "2개 동시 발사", "왕복 2회", "크기+피해 증가", "선회 부메랑 추가"],
},
{
  id: "chain",
  name: "체인",
  icon: "CH",
  color: 0x88bbff,
  desc: ["적 2마리 사슬 연결", "연결 3마리", "피해 공유", "적 끌어당김", "연결 5마리+사슬 폭발"],
},
];

const FUSION_RECIPES = [
  {
    id: "stormNet",
    name: "뇌전망",
    icon: "SN",
    color: 0x00eeff,
    requires: ["lightning", "chain"],
    desc: "전장 전체 전기 그물 — 모든 적 지속 감전",
  },
  {
    id: "gravityScythe",
    name: "중력낫",
    icon: "GS",
    color: 0xcc44ff,
    requires: ["blackHole", "boomerang"],
    desc: "블랙홀을 던져 경로 흡입 후 왕복 폭발",
  },
  {
    id: "poisonGun",
    name: "독탄기관총",
    icon: "PG",
    color: 0x88ff44,
    requires: ["machineGun", "skull"],
    desc: "총알마다 독 스택 — 처치 시 독 구름 생성",
  },
  {
    id: "magicSword",
    name: "마법검사",
    icon: "MS",
    color: 0xff88ff,
    requires: ["magicMissile", "sword"],
    desc: "검 궤적마다 추적 마법진 연쇄 폭발",
  },
  {
    id: "plasmaCannon",
    name: "열분해포",
    icon: "PC",
    color: 0xff6622,
    requires: ["laser", "lung"],
    desc: "레이저 경로가 연속 폭발 화염 지대로 변함",
  },
  {
    id: "stormSword",
    name: "폭풍검",
    icon: "SS",
    color: 0x44ffcc,
    requires: ["sword", "boomerang"],
    desc: "검을 던져 관통 왕복 베기 — 복귀 시 회오리",
  },
  {
    id: "plagueEye",
    name: "역병의 눈",
    icon: "PE",
    color: 0xaaff44,
    requires: ["skull", "blackHole"],
    desc: "흡입하며 독 전파 — 폭발 시 독 구름 확산",
  },
  {
    id: "plasmaBeam",
    name: "플라즈마 빔",
    icon: "PB",
    color: 0x66ffff,
    requires: ["lightning", "laser"],
    desc: "레이저 피격 적에게 즉시 낙뢰 연쇄 감전",
  },
  {
    id: "explosiveBoom",
    name: "폭발 부메랑",
    icon: "EB",
    color: 0xffaa33,
    requires: ["lung", "boomerang"],
    desc: "부메랑 경로마다 폭발 연쇄 — 왕복 카펫폭격",
  },
  {
    id: "multiMissile",
    name: "다연장 추적포",
    icon: "MM2",
    color: 0xff66aa,
    requires: ["machineGun", "magicMissile"],
    desc: "기관총 속도로 추적 미사일 난사",
  },
  {
    id: "deathScythe",
    name: "사신의 낫",
    icon: "DS",
    color: 0xccffaa,
    requires: ["chain", "scythe"],
    desc: "낫에 사슬이 걸려 적을 끌어당기며 연속 베기",
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
let elapsedSeconds = 0; // 경과 시간 추적
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
let bgChunks = new Map(); // 청크 캐시
const CHUNK_SIZE = 512;   // 청크 하나의 픽셀 크기
const CHUNK_RENDER_RADIUS = 3; // 플레이어 주변 몇 청크까지 그릴지

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

  // ─── 던전 배경 타일 ───────────────────────────────────────

player = this.physics.add.sprite(640, 360, "player_1");
player.setDisplaySize(120, 120);
player.body.setDrag(800);
player.body.setMaxVelocity(400);
player.body.setSize(75, 75);

initInfiniteBackground.call(this);

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
  delay: 250, // 더 자주 웨이브 호출
  callback: () => spawnEnemyWave.call(this),
  loop: true,
});

  enemyHealthTimer = this.time.addEvent({
    delay: 45000,
    callback: () => increaseEnemyMaxHp.call(this),
    loop: true,
  });

enemySpawnGrowthTimer = this.time.addEvent({
  delay: 10000,
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
      expToNextLevel += Math.floor(expToNextLevel * 0.2 + 0.2);
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
  updateInfiniteBackground.call(this)
  if (isChoosingWeapon) {
    return;
  }

  movePlayer();

  enemies.getChildren().forEach((enemy) => {
    if (enemy.stunnedUntil && enemy.stunnedUntil > time) {
      enemy.body.setVelocity(0, 0);
      return;
    }

    this.physics.moveToObject(enemy, player, 95);
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

// 수정
function movePlayer() {
  const maxSpeed = 350;

  let dx = 0;
  let dy = 0;

  if (cursors.left.isDown) dx -= 1;
  if (cursors.right.isDown) dx += 1;
  if (cursors.up.isDown) dy -= 1;
  if (cursors.down.isDown) dy += 1;

  if (joystick?.active) {
    dx += joystick.vector.x;
    dy += joystick.vector.y;
  }

  // 대각선 이동 속도 정규화
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 1) { dx /= len; dy /= len; }

  if (dx !== 0 || dy !== 0) {
    playerVelocity.x = dx * maxSpeed;
    playerVelocity.y = dy * maxSpeed;
  } else {
    // 입력 없을 때만 빠르게 감속
    playerVelocity.x *= 0.7;
    playerVelocity.y *= 0.7;
    if (Math.abs(playerVelocity.x) < 5) playerVelocity.x = 0;
    if (Math.abs(playerVelocity.y) < 5) playerVelocity.y = 0;
  }

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

    if (distance < 225) {
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
  // 조합 가능한 것 먼저 체크
  const availableFusions = weaponManager.getAvailableFusions();

  if (availableFusions.length > 0) {
    showFusionSelection.call(this, availableFusions);
    return;
  }

  // 일반 무기 선택
  const options = getRandomWeaponOptions();
  if (options.length === 0) return;
  pauseGameplay.call(this);

  const overlay = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
  const shade = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.65).setOrigin(0);

  const isCompact = this.scale.width < 760;
  const compactCardScale = Phaser.Math.Clamp((this.scale.height - 92) / (260 * 3 + 24), 0.54, 0.78);
  const cardScale = isCompact ? compactCardScale : 1;
  const compactCardHeight = 260 * cardScale;
  const titleY = isCompact ? 28 : this.scale.height / 2 - 170;

  const title = this.add.text(this.scale.width / 2, titleY, "무기 선택", {
    fontSize: "32px", color: "#ffffff", fontStyle: "bold",
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
      .setOrigin(0.5).setScrollFactor(0).setDepth(2001 + index)
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
      .map((weapon) => {
        const isFusion = weapon.level === 99;
        return isFusion
          ? `✦ ${weapon.definition.name}`
          : `${weapon.definition.name} Lv.${weapon.level}`;
      })
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
    blackHole: [3.5, 4.5, 5.5, 6.8, 8.2],
boomerang: [2.0, 2.6, 3.2, 4.0, 4.8],
chain:     [1.8, 2.3, 2.8, 3.4, 4.2],
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
  elapsedSeconds += 10;

  // 경과 시간에 따라 증가폭이 점점 커짐
  const growthRate = 0.12 + elapsedSeconds * 0.004;
  enemySpawnBonus += growthRate;

  // 스폰 딜레이도 시간이 지날수록 단축 (최소 120ms)
  const newDelay = Math.max(120, 250 - elapsedSeconds * 1.2);
  spawnTimer.delay = newDelay;

  // 1분마다 대규모 웨이브 추가
  if (elapsedSeconds % 60 === 0) {
    showWarningText.call(gameSceneRef);
    gameSceneRef.time.delayedCall(2000, () => {
      const waveCount = 20 + Math.floor(elapsedSeconds / 60) * 10;
      for (let i = 0; i < waveCount; i++) {
        spawnEnemy.call(gameSceneRef);
      }
    });
  }
}

// ─── 전투 ────────────────────────────────────────────────

function handleBulletHit(bullet, enemy) {
  damageEnemy.call(this, enemy, bullet.damage || 1);

  if (bullet.explodeRadius) {
    explode.call(this, bullet.x, bullet.y, bullet.explodeRadius, bullet.explodeDamage || 1,
      bullet.poisonOnExplode ? { poison: true } : {}
    );
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

function explode(x, y, radius, damage = 1, options = {}) {
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
      // 독탄기관총 폭발 독 처리
      if (options?.poison) {
        if (enemy.active) {
          enemy.poisonUntil = Math.max(enemy.poisonUntil || 0, this.time.now + 3000);
          enemy.poisonDamage = 0.7; 
          enemy.nextPoisonTick = 0;
        }
      }
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
  if (!enemy.active || !enemy.body) return;  // ← 추가
  if (enemy.burnUntil > time && (!enemy.nextBurnTick || time > enemy.nextBurnTick)) {
    enemy.nextBurnTick = time + 350;
    damageEnemy.call(this, enemy, 0.5);
  }
  if (enemy.poisonUntil > time && (!enemy.nextPoisonTick || time > enemy.nextPoisonTick)) {
    enemy.nextPoisonTick = time + 400;
    damageEnemy.call(this, enemy, enemy.poisonDamage || 0.4);
    if (enemy.active) enemy.setFillStyle(0x99ff66);  // ← damageEnemy 후 재확인
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
    this.maxWeapons = 5;
  }

  addOrUpgrade(type) {
    const owned = this.getWeapon(type);
    if (owned) { owned.upgrade(); return true; }
    if (this.weapons.length >= this.maxWeapons) return false;
    this.weapons.push(createWeapon(this.scene, type));
    return true;
  }

    // 추가 — 전설 무기 직접 삽입
  addFusion(fusionId) {
    if (this.weapons.length >= this.maxWeapons) return false;
    this.weapons.push(createFusionWeapon(this.scene, fusionId));
    return true;
  }

  // 추가 — 재료 무기 제거
  removeWeapon(type) {
    this.weapons = this.weapons.filter((w) => w.type !== type);
  }

  // 추가 — 현재 보유 무기로 가능한 조합 반환
  getAvailableFusions() {
    const ownedMaxed = this.weapons
      .filter((w) => w.level >= 5)
      .map((w) => w.type);

    return FUSION_RECIPES.filter((recipe) =>
      recipe.requires.every((req) => ownedMaxed.includes(req))
    );
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

// 변경
tick(time, delta) {
  if (this.canFire(time)) {
    this.lastFire = time;

    if (this.level >= 3) {
      // Lv3+ : 가장 가까운 적 2마리를 각각 조준
      const targets = findEnemiesInRange(player.x, player.y, 900, 2);
      if (targets.length === 0) return;

      targets.forEach((t) => {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y);
        this.fireLaser(angle, 780, this.level >= 4);
      });

      // 타겟이 1마리뿐이면 살짝 벌어진 2번째 레이저 추가
      if (targets.length === 1) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y);
        this.fireLaser(angle + 0.12, 780, this.level >= 4);
      }

    } else if (this.level >= 2) {
      // Lv2 : 가장 가까운 적 2마리 각각 조준
      const targets = findEnemiesInRange(player.x, player.y, 900, 2);
      if (targets.length === 0) return;

      targets.forEach((t) => {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y);
        this.fireLaser(angle, 780, false);
      });

      if (targets.length === 1) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y);
        this.fireLaser(angle + 0.12, 780, false);
      }

    } else {
      // Lv1 : 단일 조준
      const target = findNearestEnemy();
      if (!target) return;
      const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
      this.fireLaser(angle, 560, false);
    }
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
    case "blackHole": return new BlackHoleWeapon(scene);
case "boomerang": return new BoomerangWeapon(scene);
case "chain":     return new ChainWeapon(scene);
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

   // 퓨전 무기 섹션
  const fusionTitle = document.createElement("div");
  fusionTitle.textContent = "⚗ 퓨전 무기";
  fusionTitle.style.cssText = "color: #ffdd44; font-size: 13px; font-weight: bold; letter-spacing: 2px; margin-top: 16px; border-top: 1px solid #223; padding-top: 12px; margin-bottom: 10px;";
  panel.appendChild(fusionTitle);

  FUSION_RECIPES.forEach((recipe) => {
    const row = document.createElement("div");
    row.style.cssText = "display: flex; align-items: center; gap: 10px; margin-bottom: 8px;";

    const label = document.createElement("span");
    label.textContent = recipe.name;
    label.style.cssText = "width: 100px; font-size: 13px; color: #ffeeaa;";

    const btn = document.createElement("button");
    btn.textContent = "장착";
    btn.style.cssText = `
      background: transparent;
      border: 1px solid #${recipe.color.toString(16).padStart(6, "0")};
      color: #${recipe.color.toString(16).padStart(6, "0")};
      padding: 3px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-family: monospace;
      font-size: 12px;
    `;

    const desc = document.createElement("span");
    desc.textContent = `(${recipe.requires.map(r => WEAPON_TYPES.find(w => w.id === r)?.name ?? r).join(" + ")})`;
    desc.style.cssText = "font-size: 11px; color: #556; flex: 1;";

    btn.addEventListener("click", () => {
      if (weaponManager.weapons.length >= weaponManager.maxWeapons) {
        showDevNotice("슬롯 가득참!", "#ff4444");
        return;
      }
      weaponManager.weapons = weaponManager.weapons.filter(w => w.type !== recipe.id);
      weaponManager.addFusion(recipe.id);
      updateWeaponHud();
      removeBtn.disabled = false;
      removeBtn.style.opacity = "1";
      showDevNotice(`⚗ ${recipe.name} 장착!`, `#${recipe.color.toString(16).padStart(6, "0")}`);
    });

    const removeBtn = document.createElement("button");
    const isEquipped = !!weaponManager.getWeapon(recipe.id);
    removeBtn.textContent = "해제";
    removeBtn.disabled = !isEquipped;
    removeBtn.style.cssText = `
      background: transparent;
      border: 1px solid #ff4444;
      color: #ff4444;
      padding: 3px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-family: monospace;
      font-size: 12px;
      opacity: ${isEquipped ? "1" : "0.3"};
    `;
    removeBtn.addEventListener("click", () => {
      weaponManager.weapons = weaponManager.weapons.filter(w => w.type !== recipe.id);
      updateWeaponHud();
      removeBtn.disabled = true;
      removeBtn.style.opacity = "0.3";
      showDevNotice(`${recipe.name} 해제`, "#ff4444");
    });

    row.appendChild(label);
    row.appendChild(btn);
    row.appendChild(removeBtn);
    row.appendChild(desc);
    panel.appendChild(row);
  });

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

// ─── 블랙홀 ───────────────────────────────────────────────

class BlackHoleWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "blackHole", 5000);
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    const count = this.level >= 3 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 400, () => {
        this.spawnBlackHole(time);
      });
    }
  }

  spawnBlackHole(time) {
    const target = findNearestEnemy();
    const x = target
      ? target.x + Phaser.Math.FloatBetween(-60, 60)
      : player.x + Phaser.Math.FloatBetween(-200, 200);
    const y = target
      ? target.y + Phaser.Math.FloatBetween(-60, 60)
      : player.y + Phaser.Math.FloatBetween(-200, 200);

    const pullRadius = this.level >= 2 ? 280 : 200;
    const duration = 2000;
    const damage = getWeaponDamage(this.type, this.level);

    // 시각 — 외곽 링
    const outerRing = this.scene.add.circle(x, y, pullRadius, 0x220033, 0)
      .setStrokeStyle(2, 0xaa44ff, 0.35).setDepth(45);
    const core = this.scene.add.circle(x, y, 18, 0x000000, 1)
      .setStrokeStyle(4, 0xcc66ff, 0.9).setDepth(47);
    const glow = this.scene.add.circle(x, y, 38, 0x6600cc, 0.22).setDepth(46);

    // 회전 링 애니
    this.scene.tweens.add({
      targets: outerRing,
      scale: { from: 0.4, to: 1 },
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });

    this.scene.tweens.add({
      targets: core,
      scale: { from: 0.2, to: 1 },
      duration: 300,
      ease: "Back.easeOut",
    });

    // 흡입 틱
    const pullInterval = this.scene.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        enemies.getChildren().forEach((enemy) => {
          if (!enemy.active) return;
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist > pullRadius) return;

          // 끌어당기기
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
          const pullStrength = this.level >= 4 ? 180 : 120;
          enemy.body.setVelocity(
            Math.cos(angle) * pullStrength,
            Math.sin(angle) * pullStrength
          );

          // 슬로우 (Lv4+)
          if (this.level >= 4) {
            enemy.stunnedUntil = Math.max(
              enemy.stunnedUntil || 0,
              this.scene.time.now + 120
            );
          }

          // 파티클 흡입 이펙트
          if (Math.random() < 0.3) {
            const px = enemy.x;
            const py = enemy.y;
            const particle = this.scene.add.circle(px, py, 3, 0xcc66ff, 0.7).setDepth(46);
            this.scene.tweens.add({
              targets: particle,
              x,
              y,
              alpha: 0,
              scale: 0.1,
              duration: 300,
              ease: "Cubic.easeIn",
              onComplete: () => particle.destroy(),
            });
          }
        });
      },
    });

    // duration 후 폭발
    this.scene.time.delayedCall(duration, () => {
      pullInterval.destroy();

      const explodeRadius = this.level >= 2 ? 220 : 160;
      explode.call(this.scene, x, y, explodeRadius, damage);

      // 폭발 스턴 (Lv4+)
      if (this.level >= 4) {
        findEnemiesInRange(x, y, explodeRadius).forEach((enemy) => {
          enemy.stunnedUntil = this.scene.time.now + 800;
          enemy.setFillStyle(0x99ddff);
        });
      }

      // 미니 블랙홀 (Lv5)
      if (this.level >= 5) {
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2;
          const mx = x + Math.cos(angle) * 120;
          const my = y + Math.sin(angle) * 120;
          this.scene.time.delayedCall(i * 180, () => {
            this.spawnMiniBlackHole(mx, my, damage * 0.45);
          });
        }
      }

      outerRing.destroy();
      core.destroy();
      glow.destroy();
    });

    // 코어 펄스 트윈
    this.scene.tweens.add({
      targets: glow,
      scale: { from: 1, to: 1.4 },
      alpha: { from: 0.22, to: 0.1 },
      duration: 500,
      yoyo: true,
      repeat: Math.floor(duration / 1000),
    });
  }

  spawnMiniBlackHole(x, y, damage) {
    const radius = 110;
    const miniCore = this.scene.add.circle(x, y, 10, 0x000000, 1)
      .setStrokeStyle(3, 0xcc66ff, 0.8).setDepth(47);
    const miniGlow = this.scene.add.circle(x, y, 22, 0x6600cc, 0.2).setDepth(46);

    const pullInterval = this.scene.time.addEvent({
      delay: 80,
      loop: true,
      callback: () => {
        enemies.getChildren().forEach((enemy) => {
          if (!enemy.active) return;
          const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (dist > radius) return;
          const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
          enemy.body.setVelocity(Math.cos(angle) * 130, Math.sin(angle) * 130);
        });
      },
    });

    this.scene.time.delayedCall(1000, () => {
      pullInterval.destroy();
      explode.call(this.scene, x, y, radius, damage);
      miniCore.destroy();
      miniGlow.destroy();
    });

    this.scene.tweens.add({
      targets: [miniCore, miniGlow],
      alpha: 0,
      duration: 1000,
      delay: 600,
      onComplete: () => { miniCore.destroy(); miniGlow.destroy(); },
    });
  }
}

// ─── 부메랑 ───────────────────────────────────────────────

class BoomerangWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "boomerang", 1800);
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    const count = this.level >= 2 ? 2 : 1;
    const trips = this.level >= 3 ? 2 : 1;

    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 180, () => {
        this.throwBoomerang(trips, i);
      });
    }

    // 선회 부메랑 (Lv5)
    if (this.level >= 5) {
      [-1, 1].forEach((dir, idx) => {
        this.scene.time.delayedCall(idx * 120, () => {
          this.throwOrbitBoomerang(dir);
        });
      });
    }
  }

  throwBoomerang(trips, offset = 0) {
    const target = findNearestEnemy();
    if (!target) return;

    const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y)
      + (offset === 1 ? 0.18 : offset === 0 ? -0.09 : 0);

    const size = this.level >= 4 ? 14 : 10;
    const damage = getWeaponDamage(this.type, this.level);
    const speed = 520;
    const maxDist = 500;

    this.launchBoomerang(player.x, player.y, angle, size, damage, speed, maxDist, trips);
  }

  launchBoomerang(startX, startY, angle, size, damage, speed, maxDist, tripsLeft) {
    const color = 0x88ffdd;
    const boomBody = this.scene.add.rectangle(startX, startY, size * 3, size * 0.7, color, 0.92)
      .setDepth(32);
    this.scene.physics.add.existing(boomBody);
    boomBody.body.setSize(size * 3, size * 0.7);
    boomBody.damage = damage;
    boomBody.trailColor = color;
    boomBody.trailSize = size * 0.5;
    // 변경 — bullets 그룹에 추가하지 않고 physics만 적용
this.scene.physics.add.existing(boomBody);

    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    boomBody.body.setVelocity(vx, vy);

    let returning = false;
    let hitEnemies = new Set();
    let distTraveled = 0;
    let lastX = startX;
    let lastY = startY;

    const spinTween = this.scene.tweens.add({
      targets: boomBody,
      rotation: { from: 0, to: Math.PI * 2 },
      duration: 400,
      repeat: -1,
    });

    const updateTimer = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        if (!boomBody.active) { updateTimer.destroy(); spinTween.stop(); return; }

        // 이동 거리 추적
        distTraveled += Phaser.Math.Distance.Between(lastX, lastY, boomBody.x, boomBody.y);
        lastX = boomBody.x;
        lastY = boomBody.y;

        // 적 피해 판정
        enemies.getChildren().forEach((enemy) => {
          if (!enemy.active || hitEnemies.has(enemy)) return;
          const dist = Phaser.Math.Distance.Between(boomBody.x, boomBody.y, enemy.x, enemy.y);
          if (dist < size * 1.8) {
            hitEnemies.add(enemy);
            damageEnemy.call(this.scene, enemy, damage);
            // 복귀 시 히트셋 리셋
            if (returning) hitEnemies.clear();
          }
        });

        // 반환 트리거
        if (!returning && distTraveled >= maxDist) {
          returning = true;
          hitEnemies.clear();
        }

        if (returning) {
          const retAngle = Phaser.Math.Angle.Between(boomBody.x, boomBody.y, player.x, player.y);
          boomBody.body.setVelocity(
            Math.cos(retAngle) * speed * 1.1,
            Math.sin(retAngle) * speed * 1.1
          );

          // 플레이어에 도달하면 제거 or 재발사
          const distToPlayer = Phaser.Math.Distance.Between(boomBody.x, boomBody.y, player.x, player.y);
          if (distToPlayer < 30) {
            updateTimer.destroy();
            spinTween.stop();
            boomBody.destroy();

            if (tripsLeft > 1) {
              const newAngle = Phaser.Math.Angle.Between(player.x, player.y,
                findNearestEnemy()?.x ?? player.x + 1, findNearestEnemy()?.y ?? player.y);
              this.launchBoomerang(player.x, player.y, newAngle, size, damage, speed, maxDist, tripsLeft - 1);
            }
          }
        }
      },
    });
  }

  throwOrbitBoomerang(dir) {
    let orbitAngle = dir > 0 ? 0 : Math.PI;
    const orbitRadius = 110;
    const damage = getWeaponDamage(this.type, this.level) * 0.5;
    const duration = 2200;
    let elapsed = 0;
    const hitCooldown = new Map();

    const orb = this.scene.add.rectangle(
      player.x + Math.cos(orbitAngle) * orbitRadius,
      player.y + Math.sin(orbitAngle) * orbitRadius,
      28, 8, 0x44ffcc, 0.88
    ).setDepth(31);

    const timer = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        elapsed += 16;
        orbitAngle += dir * 0.09;

        const ox = player.x + Math.cos(orbitAngle) * orbitRadius;
        const oy = player.y + Math.sin(orbitAngle) * orbitRadius;
        orb.setPosition(ox, oy).setRotation(orbitAngle);

        // 트레일
        const trail = this.scene.add.circle(ox, oy, 4, 0x44ffcc, 0.3).setDepth(30);
        this.scene.tweens.add({
          targets: trail,
          alpha: 0,
          scale: 0.1,
          duration: 180,
          onComplete: () => trail.destroy(),
        });

        // 피해 판정
        enemies.getChildren().forEach((enemy) => {
          if (!enemy.active) return;
          const dist = Phaser.Math.Distance.Between(ox, oy, enemy.x, enemy.y);
          if (dist < 30) {
            const last = hitCooldown.get(enemy) || 0;
            if (this.scene.time.now > last + 400) {
              hitCooldown.set(enemy, this.scene.time.now);
              damageEnemy.call(this.scene, enemy, damage);
            }
          }
        });

        if (elapsed >= duration) {
          timer.destroy();
          orb.destroy();
        }
      },
    });
  }
}

// ─── 체인 ─────────────────────────────────────────────────

class ChainWeapon extends AutoWeapon {
  constructor(scene) {
    super(scene, "chain", 2200);
    this.activeChains = [];
  }

  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;

    this.clearChains();

    const maxLinks = this.level >= 5 ? 5 : this.level >= 2 ? 3 : 2;
    const targets = findEnemiesInRange(player.x, player.y, 700, maxLinks);
    if (targets.length < 1) return;

    const damage = getWeaponDamage(this.type, this.level);
    const duration = 1800;

    // 플레이어→첫 적 연결
    const chainObjs = [];
    const allTargets = [{ x: player.x, y: player.y }, ...targets];

    for (let i = 0; i < allTargets.length - 1; i++) {
      const from = allTargets[i];
      const to = allTargets[i + 1];
      const line = this.drawChainLine(from, to);
      chainObjs.push(line);
    }

    this.activeChains.push(...chainObjs);

    // 틱 피해 + 시각 업데이트
    let elapsed = 0;
    const tickInterval = 300;
    const hitCooldown = new Map();

    const updateTimer = this.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        elapsed += 16;

        // 선 위치 갱신
        chainObjs.forEach((obj, i) => {
          if (!obj.active) return;
          const from = i === 0 ? player : targets[i - 1];
          const to = targets[i];
          if (!from || !to || !to.active) { obj.destroy(); return; }
          this.updateChainLine(obj, from, to);
        });

        // 연결 피해 틱
        targets.forEach((enemy) => {
          if (!enemy.active) return;
          const last = hitCooldown.get(enemy) || 0;
          if (this.scene.time.now > last + tickInterval) {
            hitCooldown.set(enemy, this.scene.time.now);
            damageEnemy.call(this.scene, enemy, damage * 0.35);

            // Lv3 피해 공유
            if (this.level >= 3) {
              targets.forEach((other) => {
                if (other !== enemy && other.active) {
                  damageEnemy.call(this.scene, other, damage * 0.15);
                }
              });
            }
          }
        });

        // Lv4 끌어당기기
        if (this.level >= 4) {
          targets.forEach((enemy) => {
            if (!enemy.active) return;
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
            enemy.body.setVelocity(
              enemy.body.velocity.x + Math.cos(angle) * 30,
              enemy.body.velocity.y + Math.sin(angle) * 30
            );
          });
        }

        if (elapsed >= duration) {
          updateTimer.destroy();
          chainObjs.forEach((obj) => { if (obj.active) obj.destroy(); });

          // Lv5 사슬 폭발
          if (this.level >= 5) {
            targets.forEach((enemy) => {
              if (!enemy.active) return;
              explode.call(this.scene, enemy.x, enemy.y, 90, damage * 0.6);
            });
          }
        }
      },
    });
  }

  drawChainLine(from, to) {
  const line = this.scene.add.graphics().setDepth(48);
  line._from = from;
  line._to = to;
  this.updateChainLine(line, from, to);
  return line;
}

updateChainLine(graphics, from, to) {
  graphics.clear();

  const segments = 10;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length < 1) return;

  // 수직 방향 (지그재그용)
  const perpX = -dy / length;
  const perpY = dx / length;

  // 매 프레임 랜덤 지그재그 포인트 생성
  const points = [];
  points.push({ x: from.x, y: from.y });

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const baseX = from.x + dx * t;
    const baseY = from.y + dy * t;
    const jitter = Phaser.Math.FloatBetween(-22, 22);
    points.push({
      x: baseX + perpX * jitter,
      y: baseY + perpY * jitter,
    });
  }

  points.push({ x: to.x, y: to.y });

  // 외곽 글로우 (넓고 흐릿하게)
  graphics.lineStyle(14, 0x4466ff, 0.08);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();

  // 중간 글로우
  graphics.lineStyle(6, 0x88aaff, 0.22);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();

  // 코어 (밝고 선명하게)
  graphics.lineStyle(1.8, 0xddeeff, 0.95);
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    graphics.lineTo(points[i].x, points[i].y);
  }
  graphics.strokePath();

  // 분기 번개 (2~3개 랜덤)
  const branchCount = Phaser.Math.Between(2, 3);
  for (let b = 0; b < branchCount; b++) {
    const startIdx = Phaser.Math.Between(2, points.length - 3);
    const startPt = points[startIdx];
    const branchDir = Math.random() < 0.5 ? 1 : -1;
    const branchLen = Phaser.Math.FloatBetween(18, 38);
    const branchAngle = Math.atan2(dy, dx) + branchDir * Phaser.Math.FloatBetween(0.5, 1.1);

    const midX = startPt.x + Math.cos(branchAngle) * branchLen * 0.5 + Phaser.Math.FloatBetween(-8, 8);
    const midY = startPt.y + Math.sin(branchAngle) * branchLen * 0.5 + Phaser.Math.FloatBetween(-8, 8);
    const endX = startPt.x + Math.cos(branchAngle) * branchLen;
    const endY = startPt.y + Math.sin(branchAngle) * branchLen;

    graphics.lineStyle(1.2, 0xaaccff, 0.55);
    graphics.beginPath();
    graphics.moveTo(startPt.x, startPt.y);
    graphics.lineTo(midX, midY);
    graphics.lineTo(endX, endY);
    graphics.strokePath();
  }

  // 연결점 스파크 (from, to 양 끝)
  [from, to].forEach((pt) => {
    graphics.fillStyle(0xffffff, 0.9);
    graphics.fillCircle(pt.x, pt.y, 4.5);
    graphics.fillStyle(0x88aaff, 0.5);
    graphics.fillCircle(pt.x, pt.y, 9);
  });
}

  clearChains() {
    this.activeChains.forEach((obj) => { if (obj?.active) obj.destroy(); });
    this.activeChains = [];
  }
}

function showFusionSelection(availableFusions) {
  pauseGameplay.call(this);

  const overlay = this.add.container(0, 0).setScrollFactor(0).setDepth(2000);
  const shade = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.75).setOrigin(0);

  // 황금빛 타이틀
  const titleGlow = this.add.text(this.scale.width / 2, this.scale.height / 2 - 200, "⚗ 진화 가능!", {
    fontSize: "38px",
    color: "#ffdd44",
    fontStyle: "bold",
    shadow: { blur: 18, color: "#ffaa00", fill: true },
  }).setOrigin(0.5);

  const subtitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 152, "두 무기가 하나로 합쳐집니다", {
    fontSize: "16px",
    color: "#ffeeaa",
  }).setOrigin(0.5);

  overlay.add([shade, titleGlow, subtitle]);

  // 타이틀 펄스
  this.tweens.add({
    targets: titleGlow,
    alpha: { from: 0.7, to: 1 },
    scale: { from: 0.97, to: 1.03 },
    duration: 700,
    yoyo: true,
    repeat: -1,
    ease: "Sine.easeInOut",
  });

  let didSelect = false;

  availableFusions.forEach((recipe, index) => {
    const x = this.scale.width / 2 + (index - (availableFusions.length - 1) / 2) * 270;
    const y = this.scale.height / 2 + 20;

    const card = createFusionCard.call(this, x, y, recipe);
    overlay.add(card);

    const hitZone = this.add.zone(x, y, 230, 300)
      .setOrigin(0.5).setScrollFactor(0).setDepth(2010)
      .setInteractive({ useHandCursor: true });

    hitZone.on("pointerover", () => card.getByName("bg").setStrokeStyle(4, 0xffffff));
    hitZone.on("pointerout", () => card.getByName("bg").setStrokeStyle(2, recipe.color));
    hitZone.on("pointerdown", () => {
      if (didSelect) return;
      didSelect = true;

      // 재료 제거 후 전설 무기 추가
      recipe.requires.forEach((req) => weaponManager.removeWeapon(req));
      weaponManager.addFusion(recipe.id);
      updateWeaponHud();
      overlay.destroy(true);

      // 진화 연출
      showFusionEffect.call(this, recipe);
      resumeGameplay.call(this);
    });

    overlay.add(hitZone);
  });
}

function createFusionCard(x, y, recipe) {
  const card = this.add.container(x, y);

  const req1 = WEAPON_TYPES.find((w) => w.id === recipe.requires[0]);
  const req2 = WEAPON_TYPES.find((w) => w.id === recipe.requires[1]);

  const bg = this.add.rectangle(0, 0, 210, 300, 0x1a1200, 0.97)
    .setStrokeStyle(2, recipe.color)
    .setName("bg");

  // 황금 코너 장식
  const cornerTL = this.add.rectangle(-99, -138, 18, 2, recipe.color, 0.7);
  const cornerTL2 = this.add.rectangle(-99, -138, 2, 18, recipe.color, 0.7);
  const cornerTR = this.add.rectangle(99, -138, 18, 2, recipe.color, 0.7);
  const cornerTR2 = this.add.rectangle(99, -138, 2, 18, recipe.color, 0.7);

  // 전설 배지
  const badge = this.add.text(0, -118, "✦ FUSION ✦", {
    fontSize: "11px",
    color: `#${recipe.color.toString(16).padStart(6, "0")}`,
    letterSpacing: 2,
  }).setOrigin(0.5);

  // 재료 무기 아이콘 (작게)
  const mat1 = this.add.text(-32, -82, req1?.icon ?? "?", {
    fontSize: "16px",
    color: `#${(req1?.color ?? 0xffffff).toString(16).padStart(6, "0")}`,
    backgroundColor: "#1e2030",
    padding: { x: 5, y: 3 },
  }).setOrigin(0.5);

  const plus = this.add.text(0, -82, "+", {
    fontSize: "16px", color: "#ffffff",
  }).setOrigin(0.5);

  const mat2 = this.add.text(32, -82, req2?.icon ?? "?", {
    fontSize: "16px",
    color: `#${(req2?.color ?? 0xffffff).toString(16).padStart(6, "0")}`,
    backgroundColor: "#1e2030",
    padding: { x: 5, y: 3 },
  }).setOrigin(0.5);

  const arrow = this.add.text(0, -52, "▼", {
    fontSize: "14px",
    color: `#${recipe.color.toString(16).padStart(6, "0")}`,
  }).setOrigin(0.5);

  // 결과 무기 아이콘
  const icon = this.add.text(0, -14, recipe.icon, {
    fontSize: "36px",
    color: `#${recipe.color.toString(16).padStart(6, "0")}`,
    fontStyle: "bold",
  }).setOrigin(0.5);

  const name = this.add.text(0, 34, recipe.name, {
    fontSize: "22px",
    color: "#ffffff",
    fontStyle: "bold",
  }).setOrigin(0.5);

  const legendLabel = this.add.text(0, 66, "LEGENDARY", {
    fontSize: "11px",
    color: `#${recipe.color.toString(16).padStart(6, "0")}`,
    letterSpacing: 3,
  }).setOrigin(0.5);

  const desc = this.add.text(0, 102, recipe.desc, {
    fontSize: "13px",
    color: "#d8deea",
    align: "center",
    wordWrap: { width: 170 },
  }).setOrigin(0.5);

  card.add([bg, cornerTL, cornerTL2, cornerTR, cornerTR2, badge, mat1, plus, mat2, arrow, icon, name, legendLabel, desc]);
  return card;
}

function showFusionEffect(recipe) {
  const cx = this.scale.width / 2;
  const cy = this.scale.height / 2;

  const flash = this.add.rectangle(0, 0, this.scale.width, this.scale.height, recipe.color, 0.35)
    .setOrigin(0).setScrollFactor(0).setDepth(3000);

  const text = this.add.text(cx, cy, `⚗ ${recipe.name}`, {
    fontSize: "42px",
    color: `#${recipe.color.toString(16).padStart(6, "0")}`,
    fontStyle: "bold",
    shadow: { blur: 22, color: "#000000", fill: true },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(3001);

  const sub = this.add.text(cx, cy + 58, "FUSION ACTIVATED", {
    fontSize: "16px",
    color: "#ffffff",
    letterSpacing: 5,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(3001);

  this.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 600,
    onComplete: () => flash.destroy(),
  });

  this.tweens.add({
    targets: [text, sub],
    alpha: { from: 1, to: 0 },
    y: `-=30`,
    duration: 1200,
    delay: 400,
    ease: "Cubic.easeIn",
    onComplete: () => { text.destroy(); sub.destroy(); },
  });
}

class FusionWeapon {
  constructor(scene, fusionId) {
    this.scene = scene;
    this.type = fusionId;
    this.level = 99; // 레벨업 불가
    this.lastFire = 0;
    this.definition = FUSION_RECIPES.find((r) => r.id === fusionId);
  }

  upgrade() {} // 업그레이드 불가
  canFire(time, cooldown) { return time > this.lastFire + cooldown; }
}

function createFusionWeapon(scene, fusionId) {
  switch (fusionId) {
    case "stormNet":       return new StormNetWeapon(scene);
    case "gravityScythe":  return new GravityScytheWeapon(scene);
    case "poisonGun":      return new PoisonGunWeapon(scene);
    case "magicSword":     return new MagicSwordWeapon(scene);
    case "plasmaCannon":   return new PlasmaCannonWeapon(scene);
    case "stormSword":     return new StormSwordWeapon(scene);
    case "plagueEye":      return new PlagueEyeWeapon(scene);
    case "plasmaBeam":     return new PlasmaBeamWeapon(scene);
    case "explosiveBoom":  return new ExplosiveBoomWeapon(scene);
    case "multiMissile":   return new MultiMissileWeapon(scene);
    case "deathScythe":    return new DeathScytheWeapon(scene);
    default: throw new Error(`Unknown fusion: ${fusionId}`);
  }
}

// ⚡🔗 뇌전망 — 낙뢰 전체 + 체인 전체 + 전장 그물
class StormNetWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "stormNet");
    this.lastStorm = 0;
    this.lastChain = 0;
    this.activeChains = [];
  }

  tick(time, delta) {
    // ── 낙뢰 (400ms) ──────────────────────────────────────
    if (this.canFire(time, 400)) {
      this.lastFire = time;
      const targets = findEnemiesInRange(player.x, player.y, 700, 2);
      targets.forEach((t) => this.strike(t, time));

      // 낙뢰 Lv3 연쇄
      if (targets[0]) {
        findEnemiesInRange(targets[0].x, targets[0].y, 280, 2)
          .filter((e) => !targets.includes(e))
          .forEach((t) => this.strike(t, time, 5.5));
      }
    }

    // ── 낙뢰 Lv5 폭풍 (2000ms) ───────────────────────────
    if (time > this.lastStorm + 2000) {
      this.lastStorm = time;
      findEnemiesInRange(player.x, player.y, 1000, 5).forEach((t) =>
        this.strike(t, time, 6.0)
      );
    }

    // ── 체인 (1800ms) ─────────────────────────────────────
    if (time > this.lastChain + 1800) {
      this.lastChain = time;
      this.fireChain(time);
    }
  }

  strike(target, time, damage = 8.0) {
    showLightningStrike(this.scene, target.x, target.y, true);
    target.stunnedUntil = time + 800;
    target.setFillStyle(0x99ddff);
    // 독 부여 (뇌전망 고유)
    target.poisonUntil = Math.max(target.poisonUntil || 0, time + 2000);
    target.poisonDamage = 0.8;
    damageEnemy.call(this.scene, target, damage);
  }

  fireChain(time) {
    this.clearChains();
    const targets = findEnemiesInRange(player.x, player.y, 800, 5);
    if (targets.length < 1) return;

    const allNodes = [{ x: player.x, y: player.y }, ...targets];
    const chainObjs = [];
    for (let i = 0; i < allNodes.length - 1; i++) {
      chainObjs.push(this.drawChainLine(allNodes[i], allNodes[i + 1]));
    }
    this.activeChains.push(...chainObjs);

    const hitCooldown = new Map();
    let elapsed = 0;
    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        elapsed += 16;
        chainObjs.forEach((obj, i) => {
          if (!obj.active) return;
          const from = i === 0 ? player : targets[i - 1];
          const to = targets[i];
          if (!from || !to || !to.active) { obj.destroy(); return; }
          this.updateChainLine(obj, from, to);
        });

       // 수정
targets.forEach((enemy) => {
  if (!enemy.active || !enemy.body) return;  // ← !enemy.body 추가
  const last = hitCooldown.get(enemy) || 0;
  if (this.scene.time.now > last + 250) {
    hitCooldown.set(enemy, this.scene.time.now);
    targets.forEach((other) => {
      if (other.active) damageEnemy.call(this.scene, other, 3.0);
    });
    const a = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
    if (enemy.active && enemy.body) {  // ← damageEnemy 이후 재확인
      enemy.body.setVelocity(Math.cos(a) * 40, Math.sin(a) * 40);
    }
  }
});

        if (elapsed >= 2000) {
          timer.destroy();
          chainObjs.forEach((o) => { if (o.active) o.destroy(); });
          // 사슬 폭발
          targets.forEach((e) => {
            if (e.active) explode.call(this.scene, e.x, e.y, 110, 6.0);
          });
        }
      },
    });
  }

  drawChainLine(from, to) {
    const g = this.scene.add.graphics().setDepth(48);
    this.updateChainLine(g, from, to);
    return g;
  }

  updateChainLine(g, from, to) {
    g.clear();
    const pts = [{ x: from.x, y: from.y }];
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const px = -dy / len, py = dx / len;
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      pts.push({
        x: from.x + dx * t + px * Phaser.Math.FloatBetween(-20, 20),
        y: from.y + dy * t + py * Phaser.Math.FloatBetween(-20, 20),
      });
    }
    pts.push({ x: to.x, y: to.y });

    g.lineStyle(12, 0x00eeff, 0.08);
    g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p) => g.lineTo(p.x, p.y)); g.strokePath();

    g.lineStyle(2, 0xeeffff, 0.9);
    g.beginPath(); g.moveTo(pts[0].x, pts[0].y);
    pts.forEach((p) => g.lineTo(p.x, p.y)); g.strokePath();
  }

  clearChains() {
    this.activeChains.forEach((o) => { if (o?.active) o.destroy(); });
    this.activeChains = [];
  }
}

// 🌀 중력낫 — 블랙홀 전체 + 부메랑 전체 + 경로 흡입 왕복 폭발
class GravityScytheWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "gravityScythe");
    this.lastBH = 0;
    this.lastOrbit = 0;
  }

  tick(time) {
    // ── 중력낫 투척 (3500ms) ──────────────────────────────
    if (this.canFire(time, 3500)) {
      this.lastFire = time;
      const target = findNearestEnemy();
      if (target) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        this.throwGravityScythe(angle);
      }
    }

    // ── 블랙홀 (5000ms) ───────────────────────────────────
    if (time > this.lastBH + 5000) {
      this.lastBH = time;
      this.spawnBlackHole(time);
    }

    // ── 선회 부메랑 (2200ms) ──────────────────────────────
    if (time > this.lastOrbit + 2200) {
      this.lastOrbit = time;
      [-1, 1].forEach((dir, i) => {
        this.scene.time.delayedCall(i * 120, () => this.throwOrbitBoomerang(dir));
      });
    }
  }

  throwGravityScythe(angle) {
    const speed = 500, maxDist = 650, pullRadius = 230;
    const core = this.scene.add.circle(player.x, player.y, 24, 0x000000, 1)
      .setStrokeStyle(4, 0xcc44ff, 0.9).setDepth(50);
    const glow = this.scene.add.circle(player.x, player.y, 44, 0x6600cc, 0.25).setDepth(49);
    this.scene.physics.add.existing(core);
    core.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    let dist = 0, returning = false, lastX = core.x, lastY = core.y;
    const hit = new Set();

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        if (!core.active) { timer.destroy(); return; }
        dist += Phaser.Math.Distance.Between(lastX, lastY, core.x, core.y);
        lastX = core.x; lastY = core.y;
        glow.setPosition(core.x, core.y);

        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(core.x, core.y, e.x, e.y);
          if (d < pullRadius) {
            const a = Phaser.Math.Angle.Between(e.x, e.y, core.x, core.y);
            e.body.setVelocity(Math.cos(a) * 180, Math.sin(a) * 180);
            if (!hit.has(e)) { hit.add(e); damageEnemy.call(this.scene, e, 9.0); }
          }
        });

        const trail = this.scene.add.circle(core.x, core.y, 12, 0xcc44ff, 0.3).setDepth(48);
        this.scene.tweens.add({ targets: trail, alpha: 0, scale: 0.1, duration: 250, onComplete: () => trail.destroy() });

        if (!returning && dist >= maxDist) {
          returning = true; hit.clear();
          explode.call(this.scene, core.x, core.y, 200, 12.0);
          // 미니 블랙홀 3개 (블랙홀 Lv5 계승)
          for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            this.scene.time.delayedCall(i * 180, () =>
              this.spawnMiniBlackHole(core.x + Math.cos(a) * 130, core.y + Math.sin(a) * 130)
            );
          }
        }

        if (returning) {
          const ra = Phaser.Math.Angle.Between(core.x, core.y, player.x, player.y);
          core.body.setVelocity(Math.cos(ra) * speed * 1.2, Math.sin(ra) * speed * 1.2);
          enemies.getChildren().forEach((e) => {
            if (!e.active || hit.has(e)) return;
            if (Phaser.Math.Distance.Between(core.x, core.y, e.x, e.y) < pullRadius * 0.6) {
              hit.add(e); damageEnemy.call(this.scene, e, 9.0);
            }
          });
          if (Phaser.Math.Distance.Between(core.x, core.y, player.x, player.y) < 35) {
            timer.destroy(); core.destroy(); glow.destroy();
          }
        }
      },
    });
  }

  spawnBlackHole(time) {
    const target = findNearestEnemy();
    const x = target ? target.x + Phaser.Math.FloatBetween(-60, 60) : player.x;
    const y = target ? target.y + Phaser.Math.FloatBetween(-60, 60) : player.y;
    const pullRadius = 300;

    const outerRing = this.scene.add.circle(x, y, pullRadius, 0x220033, 0).setStrokeStyle(2, 0xaa44ff, 0.35).setDepth(45);
    const core = this.scene.add.circle(x, y, 20, 0x000000, 1).setStrokeStyle(4, 0xcc66ff, 0.9).setDepth(47);
    const glow = this.scene.add.circle(x, y, 42, 0x6600cc, 0.22).setDepth(46);

    const pull = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
          if (d > pullRadius) return;
          const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
          e.body.setVelocity(Math.cos(a) * 200, Math.sin(a) * 200);
          e.stunnedUntil = Math.max(e.stunnedUntil || 0, this.scene.time.now + 120);
        });
      },
    });

    this.scene.time.delayedCall(2200, () => {
      pull.destroy();
      explode.call(this.scene, x, y, 260, 14.0);
      findEnemiesInRange(x, y, 260).forEach((e) => { e.stunnedUntil = this.scene.time.now + 900; });
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        this.scene.time.delayedCall(i * 180, () =>
          this.spawnMiniBlackHole(x + Math.cos(a) * 130, y + Math.sin(a) * 130)
        );
      }
      outerRing.destroy(); core.destroy(); glow.destroy();
    });
  }

  spawnMiniBlackHole(x, y) {
    const radius = 130;
    const mc = this.scene.add.circle(x, y, 12, 0x000000, 1).setStrokeStyle(3, 0xcc66ff, 0.8).setDepth(47);
    const mg = this.scene.add.circle(x, y, 26, 0x6600cc, 0.2).setDepth(46);
    const pull = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
          if (d > radius) return;
          const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
          e.body.setVelocity(Math.cos(a) * 150, Math.sin(a) * 150);
        });
      },
    });
    this.scene.time.delayedCall(1200, () => {
      pull.destroy();
      explode.call(this.scene, x, y, radius, 7.0);
      mc.destroy(); mg.destroy();
    });
  }

  throwOrbitBoomerang(dir) {
    let orbitAngle = dir > 0 ? 0 : Math.PI;
    const radius = 130, damage = 6.0, duration = 2500;
    let elapsed = 0;
    const hitCooldown = new Map();

    const orb = this.scene.add.rectangle(
      player.x + Math.cos(orbitAngle) * radius,
      player.y + Math.sin(orbitAngle) * radius,
      32, 9, 0xcc44ff, 0.9
    ).setDepth(31);

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        elapsed += 16;
        orbitAngle += dir * 0.09;
        const ox = player.x + Math.cos(orbitAngle) * radius;
        const oy = player.y + Math.sin(orbitAngle) * radius;
        orb.setPosition(ox, oy).setRotation(orbitAngle);

        const trail = this.scene.add.circle(ox, oy, 5, 0xcc44ff, 0.3).setDepth(30);
        this.scene.tweens.add({ targets: trail, alpha: 0, scale: 0.1, duration: 180, onComplete: () => trail.destroy() });

        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          if (Phaser.Math.Distance.Between(ox, oy, e.x, e.y) < 34) {
            const last = hitCooldown.get(e) || 0;
            if (this.scene.time.now > last + 350) {
              hitCooldown.set(e, this.scene.time.now);
              damageEnemy.call(this.scene, e, damage);
            }
          }
        });

        if (elapsed >= duration) { timer.destroy(); orb.destroy(); }
      },
    });
  }
}

// ☠️ 독탄기관총 — 기관총 전체 + 해골 전체 + 처치시 독구름
class PoisonGunWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "poisonGun");
    this.shotCount = 0;
    this.lastDroneShot = 0;
  }

  tick(time) {
    // ── 기관총 연사 (130ms) ───────────────────────────────
    if (this.canFire(time, 130)) {
      this.lastFire = time;
      for (let i = 0; i < 2; i++) {
        const target = findNearestEnemy();
        if (!target) break;
        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        const isGuided = this.shotCount % 8 === 0;
        const color = isGuided ? 0x99ff44 : 0x88ff44;
        const bullet = createTracerProjectile(this.scene, player.x + i * 10 - 5, player.y, angle, color);
        bullet.damage = 2.2;
        bullet.explodeRadius = 60;
        bullet.explodeDamage = 1.2;
        bullet.poisonOnExplode = true; // ← 폭발에 독 부여 플래그
        if (isGuided) { bullet.homing = true; bullet.target = target; bullet.speed = 680; }
        showMuzzleFlash(this.scene, player.x, player.y, angle, 0x88ff44);
        this.scene.physics.moveToObject(bullet, target, 700);
        this.shotCount++;
      }
    }

    // ── 드론 (500ms) ──────────────────────────────────────
    if (time > this.lastDroneShot + 500) {
      this.lastDroneShot = time;
      [-60, 60].forEach((offset) => {
        const t = findNearestEnemy();
        if (!t) return;
        const angle = Phaser.Math.Angle.Between(player.x + offset, player.y - 35, t.x, t.y);
        const b = createTracerProjectile(this.scene, player.x + offset, player.y - 35, angle, 0x44ff88);
        b.damage = 1.6;
        b.explodeRadius = 45;
        b.explodeDamage = 0.8;
        b.poisonOnExplode = true;
        showMuzzleFlash(this.scene, player.x + offset, player.y - 35, angle, 0x44ff88);
        this.scene.physics.moveToObject(b, t, 600);
      });
    }
  }
}

// 🗡️ 마법검사 — 매직미사일 전체 + 검 전체 + 마법진 연쇄
class MagicSwordWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "magicSword");
    this.rotationAngle = 0;
    this.lastSpinDamage = 0;
    this.lastMissile = 0;
  }

  tick(time, delta) {
    // ── 검 휘두르기 (650ms) ───────────────────────────────
    if (this.canFire(time, 650)) {
      this.lastFire = time;
      // 2회 연속 베기 (검 Lv3)
      [0, 140].forEach((delay) => {
        this.scene.time.delayedCall(delay, () => this.swing(time));
      });
      // 검기 파동 (검 Lv4)
      this.swordWave();
    }

    // ── 회전 궤도검 (검 Lv5) ─────────────────────────────
    this.rotationAngle += delta * 0.007;
    const orbRadius = 110;
    const bx = player.x + Math.cos(this.rotationAngle) * orbRadius;
    const by = player.y + Math.sin(this.rotationAngle) * orbRadius;
    const blade = this.scene.add.rectangle(bx, by, 46, 11, 0xff88ff, 0.85).setRotation(this.rotationAngle).setDepth(30);
    this.scene.tweens.add({ targets: blade, alpha: 0, duration: 90, onComplete: () => blade.destroy() });
    if (time > this.lastSpinDamage + 220) {
      this.lastSpinDamage = time;
      findEnemiesInRange(player.x, player.y, orbRadius + 40, 5).forEach((e) =>
        damageEnemy.call(this.scene, e, 4.5)
      );
    }

    // ── 매직미사일 (700ms) ────────────────────────────────
    if (time > this.lastMissile + 700) {
      this.lastMissile = time;
      for (let i = 0; i < 2; i++) {
        const t = findNearestEnemy();
        if (!t) break;
        this.scene.time.delayedCall(i * 90, () => {
          const bullet = createProjectile(this.scene, player.x, player.y, 0xff88ff, 8);
          bullet.damage = 5.5;
          bullet.homing = true; bullet.target = t; bullet.speed = 500;
          bullet.pierce = 1; // 매직미사일 Lv3 관통
          bullet.explodeRadius = 70; bullet.explodeDamage = 3.5; // Lv4
          bullet.splitOnHit = true; // Lv5 분열
          bullet.trailColor = 0xff88ff; bullet.trailSize = 9;
          this.scene.physics.moveToObject(bullet, t, bullet.speed);

          const aura = this.scene.add.circle(player.x, player.y, 20, 0xff88ff, 0.2).setDepth(32);
          this.scene.tweens.add({ targets: aura, alpha: 0, scale: 2.2, duration: 220, onComplete: () => aura.destroy() });
        });
      }
    }
  }

  swing(time) {
    const range = 165;
    const target = findNearestEnemy();
    const angle = target ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) : this.rotationAngle;

    const arc = this.scene.add.arc(player.x, player.y, range, -65, 65, false, 0xff88ff, 0.2)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(10, 0xff88ff, 0.85).setDepth(25);
    const edge = this.scene.add.arc(player.x, player.y, range + 12, -55, 55, false, 0xffffff, 0)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(3, 0xff88ff, 0.9).setDepth(26);
    this.scene.tweens.add({ targets: [arc, edge], alpha: 0, scale: 1.15, duration: 200, onComplete: () => { arc.destroy(); edge.destroy(); } });

    // 검 피해 + 마법진 소환 (고유 능력)
    findEnemiesInRange(player.x, player.y, range, 10).forEach((e) => {
      damageEnemy.call(this.scene, e, 8.0);
      // 마법진 연쇄 폭발
      this.scene.time.delayedCall(Phaser.Math.Between(50, 200), () => {
        if (!e.active) return;
        const circle = this.scene.add.circle(e.x, e.y, 40, 0xff88ff, 0.18)
          .setStrokeStyle(2, 0xff44ff, 0.7).setDepth(35);
        this.scene.tweens.add({ targets: circle, alpha: 0, scale: 1.5, duration: 300, onComplete: () => { circle.destroy(); explode.call(this.scene, e.x, e.y, 60, 4.0); } });
      });
    });
  }

  swordWave() {
    const target = findNearestEnemy();
    if (!target) return;
    const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
    const wave = this.scene.add.arc(player.x, player.y, 95, -75, 75, false, 0xff88ff, 0.25)
      .setStrokeStyle(18, 0xffffff, 0.85).setRotation(angle).setScale(1.6, 1.1).setDepth(31);
    this.scene.physics.add.existing(wave);
    wave.body.setSize(165, 105);
    bullets.add(wave);
    wave.damage = 6.0;
    wave.trailColor = 0xff88ff; wave.trailSize = 28;
    this.scene.physics.moveToObject(wave, target, 540);
  }
}

// 🔥 열분해포 — 레이저 전체 + 폐 전체 + 레이저 경로 폭발 지대
class PlasmaCannonWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "plasmaCannon");
    this.spinAngle = 0;
    this.lastSpin = 0;
    this.lastLung = 0;
  }

  tick(time, delta) {
    // ── 레이저 2갈래 (900ms) ──────────────────────────────
    if (this.canFire(time, 900)) {
      this.lastFire = time;
      const targets = findEnemiesInRange(player.x, player.y, 950, 2);
      if (targets.length > 0) {
        targets.forEach((t) => {
          const angle = Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y);
          this.firePlasmaLaser(angle, 850);
        });
        if (targets.length === 1) {
          const angle = Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y);
          this.firePlasmaLaser(angle + 0.14, 850);
        }
      }
    }

    // ── 회전 레이저 (레이저 Lv5, 160ms) ──────────────────
    if (time > this.lastSpin + 160) {
      this.lastSpin = time;
      this.spinAngle += delta * 0.007 + 0.24;
      this.firePlasmaLaser(this.spinAngle, 720, true);
    }

    // ── 연속 폭발 (폐 Lv1~5, 3500ms) ─────────────────────
    if (time > this.lastLung + 3500) {
      this.lastLung = time;
      for (let i = 0; i < 5; i++) {
        this.scene.time.delayedCall(i * 200, () => {
          const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const d = Phaser.Math.FloatBetween(40, 170);
          const ex = player.x + Math.cos(a) * d;
          const ey = player.y + Math.sin(a) * d;
          explode.call(this.scene, ex, ey, 140, 7.0);
          findEnemiesInRange(ex, ey, 140).forEach((e) => {
            e.burnUntil = Math.max(e.burnUntil || 0, this.scene.time.now + 2500);
          });
        });
      }
    }
  }

  firePlasmaLaser(angle, length, isSpin = false) {
    const endX = player.x + Math.cos(angle) * length;
    const endY = player.y + Math.sin(angle) * length;
    showLaserBeam(this.scene, player.x, player.y, endX, endY, true);

    // 레이저 경로 폭발 지대 (고유 능력)
    const steps = isSpin ? 3 : 6;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const ex = player.x + (endX - player.x) * t;
      const ey = player.y + (endY - player.y) * t;
      this.scene.time.delayedCall(i * 55, () => {
        explode.call(this.scene, ex, ey, isSpin ? 55 : 80, isSpin ? 3.5 : 6.0);
        findEnemiesInRange(ex, ey, 80).forEach((e) => {
          e.burnUntil = Math.max(e.burnUntil || 0, this.scene.time.now + 2000);
        });
      });
    }
  }
}

// 🌪️ 폭풍검 — 검 전체 + 부메랑 전체 + 던져서 왕복 베기+회오리
class StormSwordWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "stormSword");
    this.rotationAngle = 0;
    this.lastSpinDamage = 0;
    this.lastOrbit = 0;
    this.lastThrow = 0;
  }

  tick(time, delta) {
    // ── 폭풍검 투척 (1400ms) ──────────────────────────────
    if (this.canFire(time, 1400)) {
      this.lastFire = time;
      const target = findNearestEnemy();
      if (target) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
        this.throwStormSword(angle);
      }
      // 검 휘두르기 (검 Lv1~3)
      [0, 140].forEach((d) => this.scene.time.delayedCall(d, () => this.swing()));
    }

    // ── 회전 궤도검 (검 Lv5) ─────────────────────────────
    this.rotationAngle += delta * 0.007;
    const orbRadius = 105;
    const bx = player.x + Math.cos(this.rotationAngle) * orbRadius;
    const by = player.y + Math.sin(this.rotationAngle) * orbRadius;
    const blade = this.scene.add.rectangle(bx, by, 44, 10, 0x44ffcc, 0.85).setRotation(this.rotationAngle).setDepth(30);
    this.scene.tweens.add({ targets: blade, alpha: 0, duration: 90, onComplete: () => blade.destroy() });
    if (time > this.lastSpinDamage + 220) {
      this.lastSpinDamage = time;
      findEnemiesInRange(player.x, player.y, orbRadius + 38, 5).forEach((e) =>
        damageEnemy.call(this.scene, e, 4.5)
      );
    }

    // ── 선회 부메랑 (부메랑 Lv5, 2000ms) ─────────────────
    if (time > this.lastOrbit + 2000) {
      this.lastOrbit = time;
      [-1, 1].forEach((dir, i) => {
        this.scene.time.delayedCall(i * 110, () => this.throwOrbitBoomerang(dir));
      });
    }
  }

  swing() {
    const range = 155;
    const target = findNearestEnemy();
    const angle = target ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) : this.rotationAngle;
    const arc = this.scene.add.arc(player.x, player.y, range, -65, 65, false, 0x44ffcc, 0.2)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(9, 0x44ffcc, 0.85).setDepth(25);
    this.scene.tweens.add({ targets: arc, alpha: 0, scale: 1.12, duration: 190, onComplete: () => arc.destroy() });
    findEnemiesInRange(player.x, player.y, range, 8).forEach((e) =>
      damageEnemy.call(this.scene, e, 7.0)
    );
  }

  throwStormSword(angle) {
    const speed = 560, maxDist = 580, size = 18;
    let dist = 0, returning = false, lastX = player.x, lastY = player.y;
    const hit = new Set();

    const blade = this.scene.add.rectangle(player.x, player.y, size * 3.5, size * 0.6, 0x44ffcc, 0.93).setDepth(33);
    this.scene.physics.add.existing(blade);
    blade.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    const spin = this.scene.tweens.add({ targets: blade, rotation: { from: 0, to: Math.PI * 2 }, duration: 340, repeat: -1 });

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        if (!blade.active) { timer.destroy(); spin.stop(); return; }
        dist += Phaser.Math.Distance.Between(lastX, lastY, blade.x, blade.y);
        lastX = blade.x; lastY = blade.y;

        const trail = this.scene.add.rectangle(blade.x, blade.y, 22, 5, 0x44ffcc, 0.25).setDepth(30);
        this.scene.tweens.add({ targets: trail, alpha: 0, duration: 180, onComplete: () => trail.destroy() });

        enemies.getChildren().forEach((e) => {
          if (!e.active || hit.has(e)) return;
          if (Phaser.Math.Distance.Between(blade.x, blade.y, e.x, e.y) < size * 2) {
            hit.add(e); damageEnemy.call(this.scene, e, 9.5);
          }
        });

        if (!returning && dist >= maxDist) {
          returning = true; hit.clear();
          this.spawnWhirlwind(blade.x, blade.y);
        }

        if (returning) {
          const ra = Phaser.Math.Angle.Between(blade.x, blade.y, player.x, player.y);
          blade.body.setVelocity(Math.cos(ra) * speed * 1.15, Math.sin(ra) * speed * 1.15);
          enemies.getChildren().forEach((e) => {
            if (!e.active || hit.has(e)) return;
            if (Phaser.Math.Distance.Between(blade.x, blade.y, e.x, e.y) < size * 2) {
              hit.add(e); damageEnemy.call(this.scene, e, 9.5);
            }
          });
          if (Phaser.Math.Distance.Between(blade.x, blade.y, player.x, player.y) < 30) {
            timer.destroy(); spin.stop(); blade.destroy();
          }
        }
      },
    });
  }

  spawnWhirlwind(x, y) {
    let angle = 0, elapsed = 0;
    const timer = this.scene.time.addEvent({
      delay: 55, loop: true,
      callback: () => {
        elapsed += 55; angle += 0.5;
        const wx = x + Math.cos(angle) * 60, wy = y + Math.sin(angle) * 60;
        const b = this.scene.add.arc(wx, wy, 34, -90, 90, false, 0x44ffcc, 0.18)
          .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(3, 0xccffee, 0.7).setDepth(30);
        this.scene.tweens.add({ targets: b, alpha: 0, scale: 1.2, duration: 155, onComplete: () => b.destroy() });
        findEnemiesInRange(wx, wy, 85, 4).forEach((e) => damageEnemy.call(this.scene, e, 4.0));
        if (elapsed >= 1800) timer.destroy();
      },
    });
  }

  throwOrbitBoomerang(dir) {
    let orbitAngle = dir > 0 ? 0 : Math.PI;
    const radius = 115, damage = 5.5, duration = 2200;
    let elapsed = 0;
    const hitCD = new Map();
    const orb = this.scene.add.rectangle(
      player.x + Math.cos(orbitAngle) * radius,
      player.y + Math.sin(orbitAngle) * radius,
      30, 8, 0x44ffcc, 0.88
    ).setDepth(31);

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        elapsed += 16; orbitAngle += dir * 0.09;
        const ox = player.x + Math.cos(orbitAngle) * radius;
        const oy = player.y + Math.sin(orbitAngle) * radius;
        orb.setPosition(ox, oy).setRotation(orbitAngle);
        const trail = this.scene.add.circle(ox, oy, 4, 0x44ffcc, 0.3).setDepth(30);
        this.scene.tweens.add({ targets: trail, alpha: 0, scale: 0.1, duration: 175, onComplete: () => trail.destroy() });
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          if (Phaser.Math.Distance.Between(ox, oy, e.x, e.y) < 32) {
            const last = hitCD.get(e) || 0;
            if (this.scene.time.now > last + 380) { hitCD.set(e, this.scene.time.now); damageEnemy.call(this.scene, e, damage); }
          }
        });
        if (elapsed >= duration) { timer.destroy(); orb.destroy(); }
      },
    });
  }
}

// 👁️ 역병의 눈 — 해골 전체 + 블랙홀 전체 + 흡입 독전파 폭발
class PlagueEyeWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "plagueEye");
    this.lastSkull = 0;
    this.lastBH = 0;
  }

  tick(time) {
    // ── 역병의 눈 (4000ms) ────────────────────────────────
    if (this.canFire(time, 4000)) {
      this.lastFire = time;
      this.spawnPlagueEye(time);
    }

    // ── 해골 광역 (해골 Lv1~5, 4500ms) ───────────────────
    if (time > this.lastSkull + 4500) {
      this.lastSkull = time;
      const radius = 270;
      findEnemiesInRange(player.x, player.y, radius).forEach((e) => {
        e.stunnedUntil = time + 1000;
        e.setFillStyle(0xcc99ff);
        e.poisonUntil = Math.max(e.poisonUntil || 0, time + 5000);
        e.poisonDamage = 1.0;
        e.nextPoisonTick = 0;
        damageEnemy.call(this.scene, e, 6.0);
      });
      this.showSkullEffect(radius);
    }

    // ── 블랙홀 (5000ms) ───────────────────────────────────
    if (time > this.lastBH + 5000) {
      this.lastBH = time;
      this.spawnBlackHole(time);
    }
  }

  spawnPlagueEye(time) {
    const pullRadius = 280;
    const x = player.x + Phaser.Math.FloatBetween(-90, 90);
    const y = player.y + Phaser.Math.FloatBetween(-90, 90);

    const eyeOuter = this.scene.add.ellipse(x, y, 65, 38, 0x000000, 0.9).setStrokeStyle(3, 0xaaff44, 0.85).setDepth(52);
    const pupil = this.scene.add.circle(x, y, 11, 0x44ff44, 0.9).setDepth(53);
    const glow = this.scene.add.circle(x, y, pullRadius, 0x224400, 0.1).setStrokeStyle(2, 0x88ff44, 0.3).setDepth(50);

    let elapsed = 0;
    const hitCD = new Map();
    const timer = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        elapsed += 80;
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
          if (d > pullRadius) return;
          const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
          e.body.setVelocity(Math.cos(a) * 150, Math.sin(a) * 150);
          const last = hitCD.get(e) || 0;
          if (this.scene.time.now > last + 280) {
            hitCD.set(e, this.scene.time.now);
            e.poisonUntil = Math.max(e.poisonUntil || 0, this.scene.time.now + 3000);
            e.poisonDamage = 1.2; e.nextPoisonTick = 0;
            e.stunnedUntil = this.scene.time.now + 200;
            damageEnemy.call(this.scene, e, 5.0);
          }
        });

        if (elapsed >= 2800) {
          timer.destroy();
          explode.call(this.scene, x, y, pullRadius, 12.0);
          findEnemiesInRange(x, y, pullRadius + 100).forEach((e) => {
            e.poisonUntil = Math.max(e.poisonUntil || 0, this.scene.time.now + 5000);
            e.poisonDamage = 1.5; e.nextPoisonTick = 0;
          });
          // 미니 블랙홀 3개 (블랙홀 Lv5 계승)
          for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2;
            this.scene.time.delayedCall(i * 180, () =>
              this.spawnMiniBlackHole(x + Math.cos(a) * 130, y + Math.sin(a) * 130)
            );
          }
          eyeOuter.destroy(); pupil.destroy(); glow.destroy();
        }
      },
    });

    this.scene.tweens.add({ targets: [eyeOuter, pupil], scaleX: { from: 0.2, to: 1 }, scaleY: { from: 0.2, to: 1 }, duration: 300, ease: "Back.easeOut" });
  }

  spawnBlackHole(time) {
    const target = findNearestEnemy();
    const x = target ? target.x + Phaser.Math.FloatBetween(-60, 60) : player.x;
    const y = target ? target.y + Phaser.Math.FloatBetween(-60, 60) : player.y;
    const pullRadius = 300;

    const outerRing = this.scene.add.circle(x, y, pullRadius, 0x220033, 0).setStrokeStyle(2, 0xaa44ff, 0.35).setDepth(45);
    const core = this.scene.add.circle(x, y, 20, 0x000000, 1).setStrokeStyle(4, 0xcc66ff, 0.9).setDepth(47);
    const glow = this.scene.add.circle(x, y, 42, 0x6600cc, 0.22).setDepth(46);

    const pull = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          const d = Phaser.Math.Distance.Between(x, y, e.x, e.y);
          if (d > pullRadius) return;
          const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
          e.body.setVelocity(Math.cos(a) * 200, Math.sin(a) * 200);
          e.stunnedUntil = Math.max(e.stunnedUntil || 0, this.scene.time.now + 120);
          // 독 전파 (역병의 눈 고유)
          e.poisonUntil = Math.max(e.poisonUntil || 0, this.scene.time.now + 2000);
          e.poisonDamage = 1.0; e.nextPoisonTick = 0;
        });
      },
    });

    this.scene.time.delayedCall(2200, () => {
      pull.destroy();
      explode.call(this.scene, x, y, 270, 15.0);
      findEnemiesInRange(x, y, 270).forEach((e) => { e.stunnedUntil = this.scene.time.now + 900; });
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        this.scene.time.delayedCall(i * 180, () =>
          this.spawnMiniBlackHole(x + Math.cos(a) * 130, y + Math.sin(a) * 130)
        );
      }
      outerRing.destroy(); core.destroy(); glow.destroy();
    });
  }

  spawnMiniBlackHole(x, y) {
    const radius = 130;
    const mc = this.scene.add.circle(x, y, 12, 0x000000, 1).setStrokeStyle(3, 0xcc66ff, 0.8).setDepth(47);
    const mg = this.scene.add.circle(x, y, 26, 0x6600cc, 0.2).setDepth(46);
    const pull = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          if (Phaser.Math.Distance.Between(x, y, e.x, e.y) > radius) return;
          const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
          e.body.setVelocity(Math.cos(a) * 150, Math.sin(a) * 150);
          e.poisonUntil = Math.max(e.poisonUntil || 0, this.scene.time.now + 1500);
          e.poisonDamage = 1.0;
        });
      },
    });
    this.scene.time.delayedCall(1200, () => { pull.destroy(); explode.call(this.scene, x, y, radius, 8.0); mc.destroy(); mg.destroy(); });
  }

  showSkullEffect(radius) {
    const ring = this.scene.add.circle(player.x, player.y, radius, 0xcc99ff, 0).setStrokeStyle(3, 0xcc99ff, 0.7).setDepth(50);
    const fog = this.scene.add.circle(player.x, player.y, radius * 0.85, 0x220033, 0.18).setDepth(49);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const drop = this.scene.add.circle(player.x + Math.cos(a) * radius * 0.5, player.y + Math.sin(a) * radius * 0.5, 5, 0x99ff66, 0.8).setDepth(51);
      this.scene.tweens.add({ targets: drop, x: player.x + Math.cos(a) * radius, y: player.y + Math.sin(a) * radius, alpha: 0, scale: 0.2, duration: 700, onComplete: () => drop.destroy() });
    }
    this.scene.tweens.add({ targets: [ring, fog], alpha: 0, scale: 1.15, duration: 800, ease: "Cubic.easeOut", onComplete: () => { ring.destroy(); fog.destroy(); } });
  }
}

// ☄️ 플라즈마 빔 — 낙뢰 전체 + 레이저 전체 + 레이저 피격시 낙뢰 연쇄
class PlasmaBeamWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "plasmaBeam");
    this.spinAngle = 0;
    this.lastSpin = 0;
    this.lastStorm = 0;
  }

  tick(time, delta) {
    // ── 레이저+낙뢰 (900ms) ───────────────────────────────
    if (this.canFire(time, 900)) {
      this.lastFire = time;
      const targets = findEnemiesInRange(player.x, player.y, 950, 2);
      targets.forEach((t) => {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y);
        this.firePlasmaBeam(angle, 880, time);
      });
      if (targets.length === 1) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y);
        this.firePlasmaBeam(angle + 0.13, 880, time);
      }
    }

    // ── 회전 레이저 (레이저 Lv5, 160ms) ──────────────────
    if (time > this.lastSpin + 160) {
      this.lastSpin = time;
      this.spinAngle += delta * 0.007 + 0.23;
      this.firePlasmaBeam(this.spinAngle, 720, time, true);
    }

    // ── 낙뢰 폭풍 (낙뢰 Lv5, 2200ms) ────────────────────
    if (time > this.lastStorm + 2200) {
      this.lastStorm = time;
      findEnemiesInRange(player.x, player.y, 1000, 5).forEach((t) => {
        showLightningStrike(this.scene, t.x, t.y, true);
        t.stunnedUntil = time + 800;
        damageEnemy.call(this.scene, t, 7.0);
      });
    }
  }

  firePlasmaBeam(angle, length, time, isSpin = false) {
    const endX = player.x + Math.cos(angle) * length;
    const endY = player.y + Math.sin(angle) * length;
    showLaserBeam(this.scene, player.x, player.y, endX, endY, false);

    enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const d = distanceToSegment(e.x, e.y, player.x, player.y, endX, endY);
      if (d <= 30) {
        damageEnemy.call(this.scene, e, isSpin ? 4.5 : 8.0);
        // 낙뢰 연쇄 (고유 능력)
        showLightningStrike(this.scene, e.x, e.y, false);
        e.stunnedUntil = Math.max(e.stunnedUntil || 0, time + 550);
        findEnemiesInRange(e.x, e.y, 200, 3).forEach((nearby) => {
          if (nearby !== e) {
            damageEnemy.call(this.scene, nearby, isSpin ? 2.5 : 4.5);
            showLightningStrike(this.scene, nearby.x, nearby.y, false);
            nearby.stunnedUntil = Math.max(nearby.stunnedUntil || 0, time + 400);
          }
        });
      }
    });
  }
}

// 💥 폭발 부메랑 — 폐 전체 + 부메랑 전체 + 왕복 카펫폭격
class ExplosiveBoomWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "explosiveBoom");
    this.lastOrbit = 0;
    this.lastLung = 0;
  }

  tick(time) {
    // ── 폭발 부메랑 투척 (1800ms) ─────────────────────────
    if (this.canFire(time, 1800)) {
      this.lastFire = time;
      // 2개 동시 발사 (부메랑 Lv2)
      [0, 180].forEach((delay, i) => {
        this.scene.time.delayedCall(delay, () => {
          const target = findNearestEnemy();
          if (!target) return;
          const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) + (i === 1 ? 0.2 : 0);
          // 왕복 2회 (부메랑 Lv3)
          this.throwExplosiveBoom(angle, 2);
        });
      });
    }

    // ── 선회 부메랑 (부메랑 Lv5, 2000ms) ─────────────────
    if (time > this.lastOrbit + 2000) {
      this.lastOrbit = time;
      [-1, 1].forEach((dir, i) => {
        this.scene.time.delayedCall(i * 110, () => this.throwOrbitBoomerang(dir));
      });
    }

    // ── 연속 폭발 (폐 Lv1~5, 3500ms) ─────────────────────
    if (time > this.lastLung + 3500) {
      this.lastLung = time;
      for (let i = 0; i < 5; i++) {
        this.scene.time.delayedCall(i * 200, () => {
          const a = Phaser.Math.FloatBetween(0, Math.PI * 2);
          const d = Phaser.Math.FloatBetween(40, 165);
          const ex = player.x + Math.cos(a) * d;
          const ey = player.y + Math.sin(a) * d;
          explode.call(this.scene, ex, ey, 130, 6.5);
          findEnemiesInRange(ex, ey, 130).forEach((e) => {
            e.burnUntil = Math.max(e.burnUntil || 0, this.scene.time.now + 2200);
          });
        });
      }
    }
  }

  throwExplosiveBoom(angle, tripsLeft) {
    const speed = 520, maxDist = 600, size = 15;
    let dist = 0, returning = false, lastX = player.x, lastY = player.y;
    let nextExplode = 0;

    const body = this.scene.add.rectangle(player.x, player.y, size * 3, size * 0.7, 0xffaa33, 0.92).setDepth(33);
    this.scene.physics.add.existing(body);
    body.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    const spin = this.scene.tweens.add({ targets: body, rotation: { from: 0, to: Math.PI * 2 }, duration: 370, repeat: -1 });

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        if (!body.active) { timer.destroy(); spin.stop(); return; }
        dist += Phaser.Math.Distance.Between(lastX, lastY, body.x, body.y);
        lastX = body.x; lastY = body.y;

        // 경로 카펫 폭격 (고유 능력)
        if (this.scene.time.now > nextExplode) {
          nextExplode = this.scene.time.now + 160;
          explode.call(this.scene, body.x, body.y, 85, 5.5);
          findEnemiesInRange(body.x, body.y, 85).forEach((e) => {
            e.burnUntil = Math.max(e.burnUntil || 0, this.scene.time.now + 1800);
          });
        }

        if (!returning && dist >= maxDist) {
          returning = true;
          explode.call(this.scene, body.x, body.y, 140, 9.0);
        }

        if (returning) {
          const ra = Phaser.Math.Angle.Between(body.x, body.y, player.x, player.y);
          body.body.setVelocity(Math.cos(ra) * speed * 1.1, Math.sin(ra) * speed * 1.1);
          if (Phaser.Math.Distance.Between(body.x, body.y, player.x, player.y) < 30) {
            timer.destroy(); spin.stop(); body.destroy();
            if (tripsLeft > 1) {
              const target = findNearestEnemy();
              if (target) {
                const newAngle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y);
                this.throwExplosiveBoom(newAngle, tripsLeft - 1);
              }
            }
          }
        }
      },
    });
  }

  throwOrbitBoomerang(dir) {
    let orbitAngle = dir > 0 ? 0 : Math.PI;
    const radius = 115, damage = 6.0, duration = 2300;
    let elapsed = 0;
    const hitCD = new Map();
    const orb = this.scene.add.rectangle(
      player.x + Math.cos(orbitAngle) * radius,
      player.y + Math.sin(orbitAngle) * radius,
      30, 8, 0xffaa33, 0.88
    ).setDepth(31);

    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        elapsed += 16; orbitAngle += dir * 0.09;
        const ox = player.x + Math.cos(orbitAngle) * radius;
        const oy = player.y + Math.sin(orbitAngle) * radius;
        orb.setPosition(ox, oy).setRotation(orbitAngle);

        const trail = this.scene.add.circle(ox, oy, 4, 0xffaa33, 0.3).setDepth(30);
        this.scene.tweens.add({ targets: trail, alpha: 0, scale: 0.1, duration: 175, onComplete: () => trail.destroy() });

        enemies.getChildren().forEach((e) => {
          if (!e.active) return;
          if (Phaser.Math.Distance.Between(ox, oy, e.x, e.y) < 32) {
            const last = hitCD.get(e) || 0;
            if (this.scene.time.now > last + 350) {
              hitCD.set(e, this.scene.time.now);
              damageEnemy.call(this.scene, e, damage);
              explode.call(this.scene, ox, oy, 60, 3.5);
            }
          }
        });

        if (elapsed >= duration) { timer.destroy(); orb.destroy(); }
      },
    });
  }
}

// 🚀 다연장 추적포 — 기관총 전체 + 매직미사일 전체 + 기관총 속도 추적 미사일
class MultiMissileWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "multiMissile");
    this.shotCount = 0;
    this.lastDrone = 0;
  }

  tick(time) {
    // ── 추적 미사일 연사 (기관총 속도, 130ms) ─────────────
    if (this.canFire(time, 130)) {
      this.lastFire = time;
      for (let i = 0; i < 2; i++) {
        const target = findNearestEnemy();
        if (!target) break;

        const isGuided = this.shotCount % 8 === 0; // 기관총 Lv3 유도탄 계승
        const bullet = createProjectile(this.scene, player.x + i * 12 - 6, player.y, 0xff66aa, 8);
        bullet.damage = 4.5;
        bullet.homing = true; bullet.target = target; bullet.speed = 540;
        bullet.pierce = 1; // 매직미사일 Lv3 관통
        bullet.explodeRadius = 60; bullet.explodeDamage = 2.8; // Lv4
        bullet.splitOnHit = true; // 매직미사일 Lv5 분열
        bullet.trailColor = 0xff66aa; bullet.trailSize = 8;
        this.scene.physics.moveToObject(bullet, target, bullet.speed);

        // 유도탄 (기관총 Lv3, 8발마다) — 속도 강화
        if (isGuided) { bullet.speed = 720; }

        const aura = this.scene.add.circle(player.x, player.y, 14, 0xff66aa, 0.18).setDepth(32);
        this.scene.tweens.add({ targets: aura, alpha: 0, scale: 2.0, duration: 170, onComplete: () => aura.destroy() });
        this.shotCount++;
      }
    }

    // ── 드론 미사일 (기관총 Lv5, 500ms) ──────────────────
    if (time > this.lastDrone + 500) {
      this.lastDrone = time;
      [-65, 65].forEach((offset) => {
        const t = findNearestEnemy();
        if (!t) return;
        const bullet = createProjectile(this.scene, player.x + offset, player.y - 35, 0xff66aa, 7);
        bullet.damage = 3.5;
        bullet.homing = true; bullet.target = t; bullet.speed = 510;
        bullet.explodeRadius = 50; bullet.explodeDamage = 2.0;
        bullet.splitOnHit = true; // 매직미사일 Lv5 드론도 분열
        bullet.trailColor = 0xff66aa;
        this.scene.physics.moveToObject(bullet, t, bullet.speed);
      });
    }
  }
}

// 💀 사신의 낫 — 체인 전체 + 대낫 전체 + 낫+사슬 끌어당기며 연속 베기
class DeathScytheWeapon extends FusionWeapon {
  constructor(scene) {
    super(scene, "deathScythe");
    this.swingAngle = 0;
    this.activeChains = [];
    this.lastChain = 0;
    this.lastWhirl = 0;
  }

  tick(time) {
    // ── 사신의 낫 휘두르기 (1300ms) ───────────────────────
    if (this.canFire(time, 1300)) {
      this.lastFire = time;
      // 2회 연속 베기 (대낫 Lv3)
      [0, 260].forEach((delay) => {
        this.scene.time.delayedCall(delay, () => this.swing(time));
      });
    }

    // ── 체인 (체인 전체, 1800ms) ──────────────────────────
    if (time > this.lastChain + 1800) {
      this.lastChain = time;
      this.fireChain(time);
    }

    // ── 회오리 (대낫 Lv5, 3000ms) ────────────────────────
    if (time > this.lastWhirl + 3000) {
      this.lastWhirl = time;
      this.spawnWhirlwind();
    }
  }

  swing(time) {
    const target = findNearestEnemy();
    const range = 250;
    const baseAngle = target
      ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y)
      : this.swingAngle;
    this.swingAngle = baseAngle;

    // 낫 이펙트
    const arc = this.scene.add.arc(player.x, player.y, range, -80, 80, false, 0xccffaa, 0.15)
      .setAngle(Phaser.Math.RadToDeg(baseAngle)).setStrokeStyle(13, 0xccffaa, 0.88).setDepth(29);
    const edge = this.scene.add.arc(player.x, player.y, range + 16, -72, 72, false, 0xffffff, 0)
      .setAngle(Phaser.Math.RadToDeg(baseAngle)).setStrokeStyle(3, 0xeeffdd, 0.95).setDepth(30);
    this.scene.tweens.add({ targets: [arc, edge], alpha: 0, scale: 1.1, duration: 270, ease: "Cubic.easeOut", onComplete: () => { arc.destroy(); edge.destroy(); } });

    // 낫 피해 (관통, 대낫 Lv4)
    const hitEnemies = new Set();
    findEnemiesInRange(player.x, player.y, range).forEach((e) => {
      const ea = Phaser.Math.Angle.Between(player.x, player.y, e.x, e.y);
      const diff = Phaser.Math.Angle.Wrap(ea - baseAngle);
      if (Math.abs(diff) <= 1.4) {
        hitEnemies.add(e);
        damageEnemy.call(this.scene, e, 11.0);
      }
    });

    // 사슬 끌어당기기 (고유 능력 — 낫 범위 밖 적까지)
    const chainTargets = findEnemiesInRange(player.x, player.y, 520, 5)
      .filter((e) => !hitEnemies.has(e));

    chainTargets.forEach((e, i) => {
      this.scene.time.delayedCall(i * 70, () => {
        if (!e.active) return;
        // 사슬 시각
        const g = this.scene.add.graphics().setDepth(48);
        let elapsed = 0;
        const pull = this.scene.time.addEvent({
          delay: 16, loop: true,
          callback: () => {
            elapsed += 16;
            if (!e.active) { pull.destroy(); g.destroy(); return; }
            g.clear();
            g.lineStyle(6, 0xccffaa, 0.12); g.beginPath(); g.moveTo(player.x, player.y); g.lineTo(e.x, e.y); g.strokePath();
            g.lineStyle(1.5, 0xeeffdd, 0.85); g.beginPath(); g.moveTo(player.x, player.y); g.lineTo(e.x, e.y); g.strokePath();
            const a = Phaser.Math.Angle.Between(e.x, e.y, player.x, player.y);
            e.body.setVelocity(Math.cos(a) * 220, Math.sin(a) * 220);
            if (elapsed >= 550) {
              pull.destroy(); g.destroy();
              if (e.active) {
                damageEnemy.call(this.scene, e, 9.0);
                // 낫 추가 베기 (고유 능력)
                const slashArc = this.scene.add.arc(e.x, e.y, 70, -100, 100, false, 0xccffaa, 0.2)
                  .setStrokeStyle(7, 0xccffaa, 0.7).setDepth(28);
                this.scene.tweens.add({ targets: slashArc, alpha: 0, scale: 1.2, duration: 200, onComplete: () => slashArc.destroy() });
              }
            }
          },
        });
      });
    });
  }

  fireChain(time) {
    this.clearChains();
    const targets = findEnemiesInRange(player.x, player.y, 750, 5);
    if (targets.length < 1) return;

    const allNodes = [{ x: player.x, y: player.y }, ...targets];
    const chainObjs = [];
    for (let i = 0; i < allNodes.length - 1; i++) {
      chainObjs.push(this.drawChainLine(allNodes[i], allNodes[i + 1]));
    }
    this.activeChains.push(...chainObjs);

    const hitCD = new Map();
    let elapsed = 0;
    const timer = this.scene.time.addEvent({
      delay: 16, loop: true,
      callback: () => {
        elapsed += 16;
        chainObjs.forEach((obj, i) => {
          if (!obj.active) return;
          const from = i === 0 ? player : targets[i - 1];
          const to = targets[i];
          if (!from || !to || !to.active) { obj.destroy(); return; }
          this.updateChainLine(obj, from, to);
        });

        targets.forEach((e) => {
          if (!e.active) return;
          const last = hitCD.get(e) || 0;
          if (this.scene.time.now > last + 280) {
            hitCD.set(e, this.scene.time.now);
            targets.forEach((other) => { if (other.active) damageEnemy.call(this.scene, other, 3.5); });
            const a = Phaser.Math.Angle.Between(e.x, e.y, player.x, player.y);
            e.body.setVelocity(e.body.velocity.x + Math.cos(a) * 35, e.body.velocity.y + Math.sin(a) * 35);
          }
        });

        if (elapsed >= 2000) {
          timer.destroy();
          chainObjs.forEach((o) => { if (o.active) o.destroy(); });
          // 사슬 폭발 (체인 Lv5)
          targets.forEach((e) => {
            if (e.active) explode.call(this.scene, e.x, e.y, 100, 7.0);
          });
        }
      },
    });
  }

  spawnWhirlwind() {
    let angle = 0, elapsed = 0;
    const timer = this.scene.time.addEvent({
      delay: 70, loop: true,
      callback: () => {
        elapsed += 70; angle += 0.48;
        const wx = player.x + Math.cos(angle) * 65;
        const wy = player.y + Math.sin(angle) * 65;
        const b = this.scene.add.arc(wx, wy, 40, -90, 90, false, 0xccffaa, 0.18)
          .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(4, 0xeeffdd, 0.7).setDepth(30);
        this.scene.tweens.add({ targets: b, alpha: 0, scale: 1.2, duration: 165, onComplete: () => b.destroy() });
        findEnemiesInRange(wx, wy, 90, 5).forEach((e) => damageEnemy.call(this.scene, e, 4.5));
        if (elapsed >= 2000) timer.destroy();
      },
    });
  }

  drawChainLine(from, to) {
    const g = this.scene.add.graphics().setDepth(48);
    this.updateChainLine(g, from, to);
    return g;
  }

  updateChainLine(g, from, to) {
    g.clear();
    const pts = [{ x: from.x, y: from.y }];
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    const px = -dy / len, py = dx / len;
    for (let i = 1; i < 10; i++) {
      const t = i / 10;
      pts.push({ x: from.x + dx * t + px * Phaser.Math.FloatBetween(-22, 22), y: from.y + dy * t + py * Phaser.Math.FloatBetween(-22, 22) });
    }
    pts.push({ x: to.x, y: to.y });
    g.lineStyle(14, 0x4466ff, 0.08); g.beginPath(); g.moveTo(pts[0].x, pts[0].y); pts.forEach((p) => g.lineTo(p.x, p.y)); g.strokePath();
    g.lineStyle(1.8, 0xddeeff, 0.95); g.beginPath(); g.moveTo(pts[0].x, pts[0].y); pts.forEach((p) => g.lineTo(p.x, p.y)); g.strokePath();
  }

  clearChains() {
    this.activeChains.forEach((o) => { if (o?.active) o.destroy(); });
    this.activeChains = [];
  }
}


function initInfiniteBackground() {
  // 비네팅 (카메라 고정, 한 번만 생성)
  const vignette = this.add.graphics().setScrollFactor(0).setDepth(5);
  const W = this.scale.width;
  const H = this.scale.height;
  for (let i = 10; i > 0; i--) {
    const ratio = i / 10;
    vignette.fillStyle(0x000000, 0.06 * ratio);
    vignette.fillRect(
      W * (1 - ratio) * 0.5,
      H * (1 - ratio) * 0.5,
      W * ratio,
      H * ratio
    );
  }
  // 첫 프레임 청크 미리 생성
  updateInfiniteBackground.call(this);
}

function updateInfiniteBackground() {
  // 플레이어가 속한 청크 좌표
  const pcx = Math.floor(player.x / CHUNK_SIZE);
  const pcy = Math.floor(player.y / CHUNK_SIZE);

  const needed = new Set();

  // 주변 청크 목록 계산
  for (let cx = pcx - CHUNK_RENDER_RADIUS; cx <= pcx + CHUNK_RENDER_RADIUS; cx++) {
    for (let cy = pcy - CHUNK_RENDER_RADIUS; cy <= pcy + CHUNK_RENDER_RADIUS; cy++) {
      const key = `${cx},${cy}`;
      needed.add(key);

      if (!bgChunks.has(key)) {
        // 새 청크 생성
        const chunkGraphics = createChunk.call(this, cx, cy);
        bgChunks.set(key, chunkGraphics);
      }
    }
  }

  // 멀어진 청크 제거
  for (const [key, graphics] of bgChunks) {
    if (!needed.has(key)) {
      graphics.destroy();
      bgChunks.delete(key);
    }
  }
}

function createChunk(cx, cy) {
  const tileSize = 64;
  const tilesPerChunk = Math.ceil(CHUNK_SIZE / tileSize);
  const startX = cx * CHUNK_SIZE;
  const startY = cy * CHUNK_SIZE;

  // 청크마다 고정 시드로 난수 생성 (같은 청크는 항상 동일하게)
  const seed = (cx * 73856093) ^ (cy * 19349663);
  const rand = mulberry32(seed);

  const g = this.add.graphics().setDepth(-10);

  for (let row = 0; row < tilesPerChunk; row++) {
    for (let col = 0; col < tilesPerChunk; col++) {
      const x = startX + col * tileSize;
      const y = startY + row * tileSize;

      // 전역 타일 좌표로 패턴 결정 (청크 경계에서 끊기지 않게)
      const globalCol = cx * tilesPerChunk + col;
      const globalRow = cy * tilesPerChunk + row;
      const isDark = (globalRow + globalCol) % 2 === 0;
      const baseColor = isDark ? 0x0d1117 : 0x111820;

      // 타일 채우기
      g.fillStyle(baseColor, 1);
      g.fillRect(x, y, tileSize, tileSize);

      // 테두리
      g.lineStyle(1, 0x1a2535, 0.8);
      g.strokeRect(x, y, tileSize, tileSize);

      // 입체 하이라이트 (윗면+왼쪽)
      g.lineStyle(1, 0x1e2d40, 0.5);
      g.beginPath();
      g.moveTo(x + 1, y + tileSize - 1);
      g.lineTo(x + 1, y + 1);
      g.lineTo(x + tileSize - 1, y + 1);
      g.strokePath();

      // 입체 그림자 (아랫면+오른쪽)
      g.lineStyle(1, 0x080c10, 0.6);
      g.beginPath();
      g.moveTo(x + tileSize - 1, y + 1);
      g.lineTo(x + tileSize - 1, y + tileSize - 1);
      g.lineTo(x + 1, y + tileSize - 1);
      g.strokePath();

      // 균열 (시드 기반)
      if (rand() < 0.10) {
        g.lineStyle(1, 0x060a0e, 0.9);
        const crackX = x + 10 + Math.floor(rand() * (tileSize - 20));
        const crackY = y + 10 + Math.floor(rand() * (tileSize - 20));
        const crackAngle = rand() * Math.PI;
        const crackLen = 8 + Math.floor(rand() * 14);
        g.beginPath();
        g.moveTo(crackX, crackY);
        g.lineTo(
          crackX + Math.cos(crackAngle) * crackLen,
          crackY + Math.sin(crackAngle) * crackLen
        );
        g.strokePath();

        if (rand() < 0.5) {
          const branchAngle = crackAngle + (rand() - 0.5) * 1.6;
          g.beginPath();
          g.moveTo(
            crackX + Math.cos(crackAngle) * crackLen * 0.5,
            crackY + Math.sin(crackAngle) * crackLen * 0.5
          );
          g.lineTo(
            crackX + Math.cos(branchAngle) * crackLen * 0.55,
            crackY + Math.sin(branchAngle) * crackLen * 0.55
          );
          g.strokePath();
        }
      }

      // 이끼 얼룩
      if (rand() < 0.05) {
        g.fillStyle(0x0a1a0f, 0.55);
        g.fillEllipse(
          x + 12 + Math.floor(rand() * (tileSize - 24)),
          y + 12 + Math.floor(rand() * (tileSize - 24)),
          10 + Math.floor(rand() * 14),
          6 + Math.floor(rand() * 10)
        );
      }
    }
  }

  // 큰 돌판 이음새 (4타일마다)
  g.lineStyle(2, 0x0a0f16, 0.9);
  const seamTiles = 4;
  for (let col = 0; col <= tilesPerChunk; col++) {
    const globalCol = cx * tilesPerChunk + col;
    if (globalCol % seamTiles === 0) {
      const sx = startX + col * tileSize;
      g.beginPath();
      g.moveTo(sx, startY);
      g.lineTo(sx, startY + CHUNK_SIZE);
      g.strokePath();
    }
  }
  for (let row = 0; row <= tilesPerChunk; row++) {
    const globalRow = cy * tilesPerChunk + row;
    if (globalRow % seamTiles === 0) {
      const sy = startY + row * tileSize;
      g.beginPath();
      g.moveTo(startX, sy);
      g.lineTo(startX + CHUNK_SIZE, sy);
      g.strokePath();
    }
  }

  // 횃불 빛 (청크당 0~2개, 시드 기반)
  const lightCount = Math.floor(rand() * 3);
  for (let i = 0; i < lightCount; i++) {
    const lx = startX + Math.floor(rand() * CHUNK_SIZE);
    const ly = startY + Math.floor(rand() * CHUNK_SIZE);
    const color = rand() < 0.7 ? 0xff8833 : 0x3399ff;
    const radius = 90 + Math.floor(rand() * 90);

    [0.04, 0.07, 0.11].forEach((alpha, j) => {
      const r = radius * (1 - j * 0.28);
      g.fillStyle(color, alpha);
      g.fillCircle(lx, ly, r);
    });
  }

  return g;
}

// 시드 기반 난수 생성기 (같은 시드 → 항상 같은 결과)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function showWarningText() {
  const cx = this.scale.width / 2;
  const cy = this.scale.height / 2;

  const warn = this.add.text(cx, cy, "⚠ 대규모 침공!", {
    fontSize: "38px",
    color: "#ff4444",
    fontStyle: "bold",
    shadow: { blur: 16, color: "#ff0000", fill: true },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4000);

  const sub = this.add.text(cx, cy + 52, "적의 수가 급증합니다", {
    fontSize: "18px",
    color: "#ffaaaa",
    letterSpacing: 3,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4000);

  this.tweens.add({
    targets: warn,
    alpha: { from: 1, to: 0 },
    scale: { from: 1, to: 1.15 },
    y: cy - 30,
    duration: 1800,
    delay: 800,
    ease: "Cubic.easeIn",
    onComplete: () => warn.destroy(),
  });

  this.tweens.add({
    targets: sub,
    alpha: { from: 1, to: 0 },
    duration: 1500,
    delay: 1000,
    onComplete: () => sub.destroy(),
  });
}