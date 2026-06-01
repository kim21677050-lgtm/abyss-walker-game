import Phaser from "phaser";

const MAX_ENEMIES = 250;
const PATH_SELECT_LEVEL = 15; // 길 선택 레벨

// ═══════════════════════════════════════════════════════
// 무기 정의
// ═══════════════════════════════════════════════════════
const WEAPON_TYPES = [
  { id: "machineGun",   name: "기관총",    icon: "MG", color: 0xffff66, desc: ["빠른 자동 연사","2발 발사","유도탄 추가","폭발탄","드론 지원"] },
  { id: "magicMissile", name: "매직미사일",icon: "MM", color: 0xbb88ff, desc: ["추적 미사일","2발 발사","관통 재추적","폭발","분열 미사일"] },
  { id: "lightning",    name: "낙뢰",      icon: "LT", color: 0x66ccff, desc: ["주변 번개","2타겟","연쇄 번개","스턴","주기 낙뢰"] },
  { id: "sword",        name: "검",        icon: "SW", color: 0xffd1dc, desc: ["근접 베기","범위 증가","2회 베기","검기","회전 검"] },
  { id: "laser",        name: "레이저",    icon: "LZ", color: 0xff5533, desc: ["직선 레이저","길이 증가","2갈래","화상","회전 레이저"] },
  { id: "skull",        name: "해골",      icon: "SK", color: 0xcc99ff, desc: ["광역 스턴+독","독 지속 증가","반경 확대","스턴 시간 증가","중독 중첩"] },
  { id: "lung",         name: "유지호의 폐",icon:"LG", color: 0xff8844, desc: ["3회 연속 폭발","폭발 범위 증가","5회 연속 폭발","폭발 피해 증가","화염 지속 피해"] },
  { id: "scythe",       name: "대낫",      icon: "SC", color: 0x88ffcc, desc: ["전방 휩쓸기","범위 확대","2회 연속 베기","관통 낫날","회오리 소환"] },
  { id: "blackHole",    name: "블랙홀",    icon: "BH", color: 0xaa44ff, desc: ["적 흡입 후 폭발","반경+피해 증가","2개 동시 소환","흡입 슬로우+폭발 스턴","미니 블랙홀 3개"] },
  { id: "boomerang",    name: "부메랑",    icon: "BR", color: 0x88ffdd, desc: ["관통 왕복 투사체","2개 동시 발사","왕복 2회","크기+피해 증가","선회 부메랑 추가"] },
  { id: "chain",        name: "체인",      icon: "CH", color: 0x88bbff, desc: ["적 2마리 사슬 연결","연결 3마리","피해 공유","적 끌어당김","연결 5마리+사슬 폭발"] },
];

// ═══════════════════════════════════════════════════════
// 길(Path) 시스템 데이터
// ═══════════════════════════════════════════════════════
const PATH_TYPES = {
  dragon: {
    id: "dragon", name: "용의 길", icon: "🐉",
    color: 0xff4422, colorHex: "#ff4422",
    desc: "고대 용의 힘을 빌려 전장을 지배한다",
    skills: ["dragonGaze", "dragonBreath", "dragonEternal"],
  },
  warrior: {
    id: "warrior", name: "전사의 길", icon: "⚔️",
    color: 0xddaa00, colorHex: "#ddaa00",
    desc: "무예의 극한에 이르러 천하무적이 된다",
    skills: ["warriorBaek", "warriorMu", "warriorMan"],
    orderedSkills: true,
  },
  monster: {
    id: "monster", name: "괴물의 길", icon: "👾",
    color: 0x44ff88, colorHex: "#44ff88",
    desc: "인간을 버리고 괴물이 되어 살아남는다",
    skills: ["monsterShed", "monsterDevour", "monsterDream"],
  },
};

const PATH_SKILLS = {
  dragonGaze: {
    id: "dragonGaze", path: "dragon", name: "시선", icon: "👁",
    color: 0xff6644, colorHex: "#ff6644",
    desc: "주변 적에게 둔화를 부여. 2스택 시 0.5초 스턴 후 스택 리셋.",
  },
  dragonBreath: {
    id: "dragonBreath", path: "dragon", name: "브레스", icon: "🔥",
    color: 0xff8833, colorHex: "#ff8833",
    desc: "이동 방향으로 넓은 브레스를 발사. 높은 공격력.",
  },
  dragonEternal: {
    id: "dragonEternal", path: "dragon", name: "영원불멸", icon: "⏸",
    color: 0xffcc44, colorHex: "#ffcc44",
    desc: "10초간 시간 정지. 플레이어만 이동·공격 가능. 쿨타임 45초.",
  },
  warriorBaek: {
    id: "warriorBaek", path: "warrior", name: "백경무예", icon: "🛡",
    color: 0xffee44, colorHex: "#ffee44",
    desc: "피격 시(10초 쿨) 무적+주변 적 날려버림.", order: 0,
  },
  warriorMu: {
    id: "warriorMu", path: "warrior", name: "무량무예", icon: "∞",
    color: 0xffbb22, colorHex: "#ffbb22",
    desc: "모든 무기·스킬 10회 시전마다 2회 추가 시전.", order: 1,
  },
  warriorMan: {
    id: "warriorMan", path: "warrior", name: "만상무예", icon: "💥",
    color: 0xff8800, colorHex: "#ff8800",
    desc: "70번 공격마다 주변 전체를 뒤덮는 거대 폭발.", order: 2,
  },
  monsterShed: {
    id: "monsterShed", path: "monster", name: "시해", icon: "🐍",
    color: 0x44ff88, colorHex: "#44ff88",
    desc: "1분마다 허물 벗기: 무적+잃은 체력 50% 회복. 획득 시 최대체력 25% 감소.",
  },
  monsterDevour: {
    id: "monsterDevour", path: "monster", name: "탐식", icon: "🦷",
    color: 0x22ffcc, colorHex: "#22ffcc",
    desc: "30초마다 주변 적을 먹어치워 최대체력 7% 회복.",
  },
  monsterDream: {
    id: "monsterDream", path: "monster", name: "괴물의 꿈", icon: "😴",
    color: 0x88ff44, colorHex: "#88ff44",
    desc: "2분마다 10초간 주변 적들이 플레이어를 피해 도망침.",
  },
};

// ═══════════════════════════════════════════════════════
// Phaser 설정
// ═══════════════════════════════════════════════════════
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
    arcade: { debug: false },
  },
  scene: { preload, create, update },
};

new Phaser.Game(config);

// ── 전역 변수 ──────────────────────────────────────────
let player, cursors, enemies, bullets, expOrbs;
let exp = 0, level = 1, expToNextLevel = 5;
let levelText, expInfoText, weaponText, levelUpText = null;
let weaponManager, pathManager;
let spawnTimer, enemyHealthTimer, enemySpawnGrowthTimer;
let isChoosingWeapon = false;
let enemyMaxHp = 3, enemySpawnBonus = 0;
let elapsedSeconds = 0, enemySpawnRemainder = 0;
let joystick = null;
let playerHp = 100, playerMaxHp = 100;
let healthBarBg, healthBarGreen, healthBarRed;
let isDead = false, lastDamageTime = 0;
const CONTACT_DAMAGE_PER_SEC = 34;
let gameStartTime = 0;
let devMode = false, devPanelEl = null, gameSceneRef = null;
let timerText = null, devBtnEl = null, lastMoveAngle = 0;
let bgChunks = new Map();
const CHUNK_SIZE = 512, CHUNK_RENDER_RADIUS = 3;
const playerVelocity = { x: 0, y: 0 };

function preload() {
  for (let i = 1; i <= 6; i++) this.load.image(`player_${i}`, `assets/hero-run-${i}.png`);
  this.load.image("death-scythe", "assets/death-scythe.png");
}

function create() {
  gameSceneRef = this;
  this.input.addPointer(2);
  this.physics.world.setBounds(-3000, -3000, 6000, 6000);

  player = this.physics.add.sprite(640, 360, "player_1");
  player.setDisplaySize(120, 120);
  player.body.setDrag(800);
  player.body.setMaxVelocity(400);
  player.body.setSize(75, 75);

  initInfiniteBackground.call(this);

  this.anims.create({ key: "walk", frames: [1,2,3,4,5,6].map(i=>({key:`player_${i}`})), frameRate: 10, repeat: -1 });
  this.anims.create({ key: "idle", frames: [{ key: "player_1" }], frameRate: 1, repeat: -1 });
  player.play("idle");

  playerHp = playerMaxHp;
  gameStartTime = this.time.now;

  enemies = this.physics.add.group();
  bullets = this.physics.add.group();
  expOrbs = this.physics.add.group();
  weaponManager = new WeaponManager(this);
  pathManager = new PathManager(this);        // ← 길 매니저

  for (let i = 0; i < 50; i++) spawnEnemy.call(this);

  spawnTimer = this.time.addEvent({ delay: 250, callback: () => spawnEnemyWave.call(this), loop: true });
  enemyHealthTimer = this.time.addEvent({ delay: 45000, callback: () => increaseEnemyMaxHp.call(this), loop: true });
  enemySpawnGrowthTimer = this.time.addEvent({ delay: 10000, callback: () => increaseEnemySpawnAmount.call(this), loop: true });

  this.physics.add.overlap(bullets, enemies, handleBulletHit, null, this);

  this.physics.add.overlap(player, expOrbs, (player, orb) => {
    orb.destroy();
    exp++;
    if (exp >= expToNextLevel && !isChoosingWeapon) {
      if (devMode) return;
      level++;
      exp = 0;
      expToNextLevel += Math.floor(expToNextLevel * 0.2 + 0.2);
      showLevelUpText.call(this);

      // 15레벨: 길 선택
      if (level === PATH_SELECT_LEVEL && !pathManager.chosenPath) {
        pauseGameplay.call(this);
        showPathSelection.call(this);
      } else {
        showWeaponSelection.call(this);
      }
    }
  });

  this.cameras.main.startFollow(player, true, 0.08, 0.08);
  this.cameras.main.setZoom(1.05);

  levelText = this.add.text(20, 20, `Lv. ${level}`, { fontSize: "24px", color: "#ffffff" }).setScrollFactor(0).setDepth(1000);
  timerText = this.add.text(this.scale.width / 2, 20, "00:00", { fontSize: "22px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1000);
  expInfoText = this.add.text(this.scale.width - 20, 20, "", { fontSize: "15px", color: "#ffffff", align: "right" }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);

  healthBarBg    = this.add.rectangle(this.scale.width - 210, 72, 180, 10, 0x441111).setOrigin(0, 0).setScrollFactor(0).setDepth(1000);
  healthBarRed   = this.add.rectangle(this.scale.width - 210, 72, 180, 10, 0xaa2222).setOrigin(0, 0).setScrollFactor(0).setDepth(1001);
  healthBarGreen = this.add.rectangle(this.scale.width - 210, 72, 180, 10, 0x00ff66).setOrigin(0, 0).setScrollFactor(0).setDepth(1002);

  weaponText = this.add.text(20, 52, "", { fontSize: "16px", color: "#b7f7ff" }).setScrollFactor(0).setDepth(1000);

  cursors = this.input.keyboard.addKeys({ up: "W", down: "S", left: "A", right: "D" });
  weaponManager.addOrUpgrade("machineGun");
  updateWeaponHud();
  updateExpHud();

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
  updateInfiniteBackground.call(this);
  if (isChoosingWeapon) return;

  movePlayer();

  enemies.getChildren().forEach((enemy) => {
    if (!enemy.active || !enemy.body) return;
    if (enemy.frozen) return;

    // 괴물의 꿈: 도망 중인 적
    if (enemy.fleeing) {
      const angle = Phaser.Math.Angle.Between(player.x, player.y, enemy.x, enemy.y);
      this.physics.velocityFromAngle(Phaser.Math.RadToDeg(angle), 130, enemy.body.velocity);
      return;
    }

    if (enemy.stunnedUntil && enemy.stunnedUntil > time) {
      // 둔화 중인 적은 느리게 이동
      if (enemy.slowed) {
        this.physics.moveToObject(enemy, player, 45);
      } else {
        enemy.body.setVelocity(0, 0);
      }
      return;
    }

    this.physics.moveToObject(enemy, player, 95);
  });

  if (!isDead) {
    const elapsed = Math.floor((time - gameStartTime) / 1000);
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    timerText.setText(`${mm}:${ss}`);
  }

  weaponManager.tick(time, delta);
  pathManager.tick(time, delta);       // ← 길 스킬 틱
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

// ═══════════════════════════════════════════════════════
// 길(Path) 매니저
// ═══════════════════════════════════════════════════════
class PathManager {
  constructor(scene) {
    this.scene = scene;
    this.chosenPath = null;       // "dragon" | "warrior" | "monster" | null
    this.acquiredSkills = [];     // 획득한 스킬 ID 목록

    // 용의 길
    this.gazeTimer = 0;
    this.gazeCooldown = 1800;     // 시선 발동 간격
    this.gazeStacks = new Map();  // enemy → stack count

    this.breathCooldown = 2200;
    this.lastBreath = 0;

    this.eternalCooldown = 45000;
    this.lastEternal = 0;
    this.timeStopActive = false;
    this.timeStopUntil = 0;

    // 전사의 길
    this.baekCooldown = 10000;
    this.lastBaekTrigger = -10000;
    this.baekInvincible = false;
    this.baekInvincibleUntil = 0;

    this.muTotalCasts = 0;        // 무량무예: 전체 시전 횟수
    this.muBonusCasts = 0;        // 이번 틱에 추가 시전할 횟수

    this.manTotalAttacks = 0;     // 만상무예: 공격 횟수 카운터

    // 괴물의 길
    this.shedTimer = 0;
    this.shedCooldown = 60000;
    this.shedInvincibleUntil = 0;

    this.devourTimer = 0;
    this.devourCooldown = 30000;

    this.dreamTimer = 0;
    this.dreamCooldown = 120000;
    this.dreamActive = false;
    this.dreamUntil = 0;
  }

  hasSkill(id) { return this.acquiredSkills.includes(id); }

  addSkill(id) {
    if (this.acquiredSkills.includes(id)) return;
    this.acquiredSkills.push(id);

    // 시해 획득 시 최대 체력 25% 감소
    if (id === "monsterShed") {
      playerMaxHp = Math.round(playerMaxHp * 0.75);
      playerHp = Math.min(playerHp, playerMaxHp);
    }
    updateWeaponHud();
  }

  // 백경무예: 피격 시 호출
  onPlayerHit(time) {
    if (!this.hasSkill("warriorBaek")) return;
    if (time < this.lastBaekTrigger + this.baekCooldown) return;
    this.lastBaekTrigger = time;
    this.baekInvincible = true;
    this.baekInvincibleUntil = time + 1200;

    // 주변 적 날려버리기
    enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const dist = Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y);
      if (dist < 300) {
        const angle = Phaser.Math.Angle.Between(player.x, player.y, e.x, e.y);
        if (e.body) e.body.setVelocity(Math.cos(angle) * 600, Math.sin(angle) * 600);
      }
    });

    // 연출
    const ring = this.scene.add.circle(player.x, player.y, 260, 0xffee44, 0)
      .setStrokeStyle(4, 0xffee44, 0.9).setDepth(80);
    this.scene.tweens.add({ targets: ring, alpha: 0, scale: 1.5, duration: 400, onComplete: () => ring.destroy() });
    showBaekNotice(this.scene);
  }

  // 만상무예: 공격 1회 카운트
  countAttack() {
    if (!this.hasSkill("warriorMan")) return;
    this.manTotalAttacks++;
    if (this.manTotalAttacks % 70 === 0) {
      this.triggerManExplosion();
    }
  }

  triggerManExplosion() {
    const radius = 380;
    const ring = this.scene.add.circle(player.x, player.y, radius, 0xff8800, 0)
      .setStrokeStyle(6, 0xff8800, 0.9).setDepth(80);
    const glow = this.scene.add.circle(player.x, player.y, radius * 0.7, 0xffcc44, 0.18).setDepth(79);
    this.scene.tweens.add({ targets: [ring, glow], alpha: 0, scale: 1.3, duration: 500, onComplete: () => { ring.destroy(); glow.destroy(); } });
    explode.call(this.scene, player.x, player.y, radius, 18.0);

    const text = this.scene.add.text(player.x, player.y - 60, "만상무예!", {
      fontSize: "26px", color: "#ff8800", fontStyle: "bold",
    }).setOrigin(0.5).setDepth(200);
    this.scene.tweens.add({ targets: text, alpha: 0, y: player.y - 120, duration: 1000, onComplete: () => text.destroy() });
  }

  tick(time, delta) {
    if (!this.chosenPath) return;

    // 시간 정지 종료 체크
if (this.timeStopActive && time > this.timeStopUntil) {
  this.timeStopActive = false;

  enemies.getChildren().forEach((e) => {
    if (!e.active || !e.body) return;
    e.body.moves = true;
    e.frozen = false;
  });

  bullets.getChildren().forEach((b) => {
    if (!b.active || !b.body) return;
    b.body.moves = true;
    b.frozen = false;
    if (b._frozenVelocity) {
      b.body.setVelocity(b._frozenVelocity.x, b._frozenVelocity.y);
      b._frozenVelocity = null;
    }
  });

  spawnTimer.paused = false;
  enemyHealthTimer.paused = false;
  enemySpawnGrowthTimer.paused = false;

  showTimeStopEnd(this.scene);
}

    // 백경무예 무적 해제
    if (this.baekInvincible && time > this.baekInvincibleUntil) {
      this.baekInvincible = false;
    }

    // 시해 무적 해제
    if (time > this.shedInvincibleUntil) {
      this.shedInvincibleUntil = 0;
    }

    // 괴물의 꿈 종료
    if (this.dreamActive && time > this.dreamUntil) {
      this.dreamActive = false;
      enemies.getChildren().forEach((e) => { if (e.active) e.fleeing = false; });
    }

    // ── 용의 길 스킬 틱 ─────────────────────────────────
    if (this.hasSkill("dragonGaze") && time > this.gazeTimer) {
      this.gazeTimer = time + this.gazeCooldown;
      this.applyGaze(time);
    }

    if (this.hasSkill("dragonBreath") && time > this.lastBreath + this.breathCooldown) {
      this.lastBreath = time;
      this.fireBreath();
    }

    if (this.hasSkill("dragonEternal") && !this.timeStopActive && 
    time > this.lastEternal + this.eternalCooldown) {
  this.triggerEternal(time);
    }

    // ── 괴물의 길 스킬 틱 ───────────────────────────────
    if (this.hasSkill("monsterShed") && time > this.shedTimer + this.shedCooldown) {
      this.shedTimer = time;
      this.triggerShed(time);
    }

    if (this.hasSkill("monsterDevour") && time > this.devourTimer + this.devourCooldown) {
      this.devourTimer = time;
      this.triggerDevour();
    }

    if (this.hasSkill("monsterDream") && time > this.dreamTimer + this.dreamCooldown) {
      this.dreamTimer = time;
      this.triggerDream(time);
    }
  }

  // 시선
  applyGaze(time) {
    const range = 320;
    enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const dist = Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y);
      if (dist > range) return;

      const stacks = (this.gazeStacks.get(e) || 0) + 1;
      if (stacks >= 2) {
        // 스턴
        e.stunnedUntil = time + 500;
        e.slowed = false;
        this.gazeStacks.set(e, 0);
        e.setFillStyle(0xff6644);
        showGazeStun(this.scene, e.x, e.y);
      } else {
        e.slowed = true;
        this.gazeStacks.set(e, stacks);
        e.setFillStyle(0xff9966);
        showGazeSlow(this.scene, e.x, e.y);
      }
    });

    // 범위 표시
    const ring = this.scene.add.circle(player.x, player.y, range, 0xff6644, 0)
      .setStrokeStyle(2, 0xff6644, 0.4).setDepth(50);
    this.scene.tweens.add({ targets: ring, alpha: 0, scale: 1.08, duration: 400, onComplete: () => ring.destroy() });
  }

  // 브레스
  fireBreath() {
    const angle = lastMoveAngle;
    const length = 750;
    const width = 160; // 넓은 브레스

    // 브레스 이펙트
    showBreath(this.scene, player.x, player.y, angle, length, width);

    // 피해 판정 (부채꼴 내 적)
    enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      const dx = e.x - player.x, dy = e.y - player.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > length) return;
      const eAngle = Math.atan2(dy, dx);
      const diff = Math.abs(Phaser.Math.Angle.Wrap(eAngle - angle));
      const halfWidth = Math.atan2(width / 2, dist);
      if (diff < halfWidth + 0.22) {
        damageEnemy.call(this.scene, e, 22.0);
        pathManager.countAttack();
        e.burnUntil = Math.max(e.burnUntil || 0, this.scene.time.now + 2000);
      }
    });
  }

  // 영원불멸 발동 (UI 버튼 또는 키로 트리거)
// triggerEternal 함수 전체 교체
triggerEternal(time) {
  if (!this.hasSkill("dragonEternal")) return;
  if (this.timeStopActive) return;
  if (time < this.lastEternal + this.eternalCooldown) return;

  this.lastEternal = time;
  this.timeStopActive = true;
  this.timeStopUntil = time + 10000;

  // physics.pause() 대신 적들만 개별 정지
  enemies.getChildren().forEach((e) => {
    if (!e.active || !e.body) return;
    e._frozenVelocity = { x: e.body.velocity.x, y: e.body.velocity.y };
    e.body.setVelocity(0, 0);
    e.body.moves = false;   // 물리 이동 비활성
    e.frozen = true;
  });

  // 투사체도 정지
  bullets.getChildren().forEach((b) => {
    if (!b.active || !b.body) return;
    b._frozenVelocity = { x: b.body.velocity.x, y: b.body.velocity.y };
    b.body.setVelocity(0, 0);
    b.body.moves = false;
    b.frozen = true;
  });

  spawnTimer.paused = true;
  enemyHealthTimer.paused = true;
  enemySpawnGrowthTimer.paused = true;
  weaponManager.timeStopped = false;  // 무기는 계속 발동

  showTimeStopStart(this.scene);
}

  // 시해
  triggerShed(time) {
    this.shedInvincibleUntil = time + 1500;
    const lostHp = playerMaxHp - playerHp;
    playerHp = Math.min(playerMaxHp, playerHp + lostHp * 0.5);

    showShedEffect(this.scene);
  }

  // 탐식
  triggerDevour() {
    const range = 280;
    let count = 0;
    enemies.getChildren().forEach((e) => {
      if (!e.active) return;
      if (Phaser.Math.Distance.Between(player.x, player.y, e.x, e.y) < range) {
        damageEnemy.call(this.scene, e, 999);
        count++;
      }
    });
    const heal = playerMaxHp * 0.07;
    playerHp = Math.min(playerMaxHp, playerHp + heal);

    showDevourEffect(this.scene, range);
  }

  // 괴물의 꿈
  triggerDream(time) {
    this.dreamActive = true;
    this.dreamUntil = time + 10000;
    enemies.getChildren().forEach((e) => { if (e.active) e.fleeing = true; });
    showDreamEffect(this.scene);
  }

  isInvincible(time) {
    return this.baekInvincible || time < this.shedInvincibleUntil;
  }
}

// ═══════════════════════════════════════════════════════
// 길 선택 UI
// ═══════════════════════════════════════════════════════
function showPathSelection() {
  const scene = gameSceneRef;
  const W = scene.scale.width, H = scene.scale.height;
  const cx = W / 2, cy = H / 2;

  const overlay = scene.add.container(0, 0).setScrollFactor(0).setDepth(3000);
  const shade = scene.add.rectangle(0, 0, W, H, 0x000000, 0.88).setOrigin(0);

  const titleGlow = scene.add.text(cx, cy - 220, "── 길을 선택하라 ──", {
    fontSize: "32px", color: "#ffffff", fontStyle: "bold", letterSpacing: 8,
  }).setOrigin(0.5);

  const sub = scene.add.text(cx, cy - 176, "한번 선택한 길은 이 생애에서 바꿀 수 없다", {
    fontSize: "14px", color: "#889988", letterSpacing: 2,
  }).setOrigin(0.5);

  overlay.add([shade, titleGlow, sub]);

  const paths = Object.values(PATH_TYPES);
  const cardW = Math.min(200, (W - 80) / 3);
  const spacing = cardW + 20;
  const startX = cx - spacing;

  paths.forEach((path, i) => {
    const x = startX + i * spacing;
    const card = createPathCard.call(scene, x, cy + 20, path);
    overlay.add(card);

    const hitZone = scene.add.zone(x, cy + 20, cardW, 340)
      .setOrigin(0.5).setScrollFactor(0).setDepth(3010)
      .setInteractive({ useHandCursor: true });

    hitZone.on("pointerover", () => card.getByName("bg").setStrokeStyle(4, 0xffffff));
    hitZone.on("pointerout",  () => card.getByName("bg").setStrokeStyle(2, path.color));
    hitZone.on("pointerup",   () => {
      overlay.destroy(true);
      pathManager.chosenPath = path.id;
      showPathChosenEffect.call(scene, path);
      resumeGameplay.call(scene);
      // 16레벨 선택지에서 확정 스킬 지급 플래그
      pathManager.guaranteeNextSkill = true;
    });

    overlay.add(hitZone);
  });
}

function createPathCard(x, y, path) {
  const card = this.add.container(x, y);
  const cardW = 200, cardH = 320;

  const bg = this.add.rectangle(0, 0, cardW, cardH, 0x0a0e1a, 0.97)
    .setStrokeStyle(2, path.color).setName("bg");

  // 아이콘
  const icon = this.add.text(0, -110, path.icon, { fontSize: "56px" }).setOrigin(0.5);
  const name = this.add.text(0, -46, path.name, {
    fontSize: "22px", color: "#ffffff", fontStyle: "bold",
  }).setOrigin(0.5);

  const divider = this.add.rectangle(0, -20, 120, 1, path.color, 0.5);

  const desc = this.add.text(0, 14, path.desc, {
    fontSize: "13px", color: "#aabbaa", align: "center", wordWrap: { width: 170 },
  }).setOrigin(0.5);

  // 스킬 미리보기
  const skillDefs = PATH_TYPES[path.id].skills.map((sid) => PATH_SKILLS[sid]);
  skillDefs.forEach((sk, idx) => {
    const sy = 76 + idx * 44;
    const skillBg = this.add.rectangle(0, sy, 180, 38, 0x111922, 0.9)
      .setStrokeStyle(1, path.color, 0.3);
    const skillIcon = this.add.text(-76, sy, sk.icon, { fontSize: "18px" }).setOrigin(0.5);
    const skillName = this.add.text(-52, sy, sk.name, {
      fontSize: "14px", color: `#${path.color.toString(16).padStart(6, "0")}`, fontStyle: "bold",
    }).setOrigin(0, 0.5);
    card.add([skillBg, skillIcon, skillName]);
  });

  card.add([bg, icon, name, divider, desc]);
  return card;
}

function showPathChosenEffect(path) {
  const cx = this.scale.width / 2, cy = this.scale.height / 2;

  const flash = this.add.rectangle(0, 0, this.scale.width, this.scale.height, path.color, 0.28)
    .setOrigin(0).setScrollFactor(0).setDepth(4000);
  const text = this.add.text(cx, cy - 20, `${path.icon} ${path.name}`, {
    fontSize: "46px", color: path.colorHex, fontStyle: "bold",
    shadow: { blur: 24, color: "#000000", fill: true },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4001);
  const sub = this.add.text(cx, cy + 46, "길이 열린다", {
    fontSize: "18px", color: "#ffffff", letterSpacing: 6,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4001);

  this.tweens.add({ targets: flash, alpha: 0, duration: 700, onComplete: () => flash.destroy() });
  this.tweens.add({ targets: [text, sub], alpha: 0, y: `-=28`, duration: 1300, delay: 500, onComplete: () => { text.destroy(); sub.destroy(); } });
}

// ═══════════════════════════════════════════════════════
// 레벨업 무기 선택 (길 스킬 혼합)
// ═══════════════════════════════════════════════════════
function showWeaponSelection() {
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
  const selectOption = (option) => {
    if (didSelect) return;
    didSelect = true;

    if (option.isPathSkill) {
      pathManager.addSkill(option.skillId);
    } else {
      weaponManager.addOrUpgrade(option.weaponType.id);
    }
    updateWeaponHud();
    overlay.destroy(true);
    resumeGameplay.call(this);
  };

  options.forEach((option, index) => {
    const x = isCompact
      ? this.scale.width / 2
      : this.scale.width / 2 + (index - 1) * 250;
    const y = isCompact
      ? 62 + compactCardHeight / 2 + index * (compactCardHeight + 8)
      : this.scale.height / 2;

    let card;
    if (option.isPathSkill) {
      card = createPathSkillCard.call(this, x, y, index + 1, option.skill);
    } else {
      const owned = weaponManager.getWeapon(option.weaponType.id);
      const nextLevel = owned ? Math.min(owned.level + 1, 5) : 1;
      card = createWeaponCard.call(this, x, y, index + 1, option.weaponType, nextLevel);
    }
    card.setScale(cardScale);

    const hitZone = this.add.zone(x, y, 230 * cardScale, 286 * cardScale)
      .setOrigin(0.5).setScrollFactor(0).setDepth(2001 + index)
      .setInteractive({ useHandCursor: true });

    hitZone.on("pointerup", () => selectOption(option));
    hitZone.on("pointerover", () => card.getByName("bg").setStrokeStyle(4, 0xffffff));
    hitZone.on("pointerout", () => {
      const col = option.isPathSkill ? option.skill.color : option.weaponType.color;
      card.getByName("bg").setStrokeStyle(2, col);
    });
    overlay.add([card, hitZone]);
  });
}

function createPathSkillCard(x, y, number, skill) {
  const card = this.add.container(x, y);
  const pathDef = PATH_TYPES[skill.path];

  const bg = this.add.rectangle(0, 0, 200, 260, 0x0d1108, 0.97)
    .setStrokeStyle(2, skill.color).setName("bg");

  // 번호
  const key = this.add.text(-82, -112, `${number}`, {
    fontSize: "18px", color: "#ffffff", backgroundColor: "#2e3544", padding: { x: 8, y: 4 },
  });

  // 길 배지
  const pathBadge = this.add.text(0, -118, `${pathDef.icon} ${pathDef.name}`, {
    fontSize: "11px", color: pathDef.colorHex, letterSpacing: 2,
  }).setOrigin(0.5);

  const icon = this.add.text(0, -66, skill.icon, { fontSize: "38px" }).setOrigin(0.5);
  const name = this.add.text(0, -18, skill.name, {
    fontSize: "22px", color: "#ffffff", fontStyle: "bold",
  }).setOrigin(0.5);

  const typeBadge = this.add.text(0, 20, "✦ 길 스킬 ✦", {
    fontSize: "12px", color: skill.colorHex, letterSpacing: 2,
  }).setOrigin(0.5);

  const desc = this.add.text(0, 64, skill.desc, {
    fontSize: "13px", color: "#d8deea", align: "center", wordWrap: { width: 165 },
  }).setOrigin(0.5);

  card.add([bg, key, pathBadge, icon, name, typeBadge, desc]);
  return card;
}

// 선택지 생성 (무기 + 길 스킬 혼합)
function getRandomWeaponOptions() {
  const ownedWeapons = weaponManager.getOwnedWeaponTypes();
  const maxedWeapons = weaponManager.weapons.filter((w) => w.level >= 5).map((w) => w.type);

  const weaponPool = ownedWeapons.length >= weaponManager.maxWeapons
    ? WEAPON_TYPES.filter((w) => ownedWeapons.includes(w.id) && !maxedWeapons.includes(w.id))
    : WEAPON_TYPES.filter((w) => !maxedWeapons.includes(w.id));

  // 길 스킬 풀 계산
  let pathSkillOptions = [];
  if (pathManager.chosenPath) {
    const pathDef = PATH_TYPES[pathManager.chosenPath];
    const isOrdered = pathDef.orderedSkills;

    if (isOrdered) {
      // 전사의 길: 순서대로 다음 획득 가능한 것만
      const skills = pathDef.skills;
      const nextIdx = skills.findIndex((sid) => !pathManager.hasSkill(sid));
      if (nextIdx !== -1) {
        pathSkillOptions = [PATH_SKILLS[skills[nextIdx]]];
      }
    } else {
      pathSkillOptions = pathDef.skills
        .filter((sid) => !pathManager.hasSkill(sid))
        .map((sid) => PATH_SKILLS[sid]);
    }
  }

  // 확정 스킬 처리
  const guaranteeSkill = pathManager.guaranteeNextSkill && pathSkillOptions.length > 0;
  const guarantee20 = pathManager.chosenPath &&
    level >= 20 && !pathManager.guaranteed20Done &&
    pathManager.acquiredSkills.filter((sid) => PATH_TYPES[pathManager.chosenPath].skills.includes(sid)).length < 2 &&
    pathSkillOptions.length > 0;

  if (guaranteeSkill) {
    pathManager.guaranteeNextSkill = false;
    // 확정 스킬 1개 + 무기 2개
    const guaranteed = { isPathSkill: true, skill: pathSkillOptions[0], skillId: pathSkillOptions[0].id };
    const weaponOptions = Phaser.Utils.Array.Shuffle([...weaponPool]).slice(0, 2).map((w) => ({ isPathSkill: false, weaponType: w }));
    return Phaser.Utils.Array.Shuffle([guaranteed, ...weaponOptions]);
  }

  if (guarantee20) {
    pathManager.guaranteed20Done = true;
    const guaranteed = { isPathSkill: true, skill: pathSkillOptions[0], skillId: pathSkillOptions[0].id };
    const weaponOptions = Phaser.Utils.Array.Shuffle([...weaponPool]).slice(0, 2).map((w) => ({ isPathSkill: false, weaponType: w }));
    return Phaser.Utils.Array.Shuffle([guaranteed, ...weaponOptions]);
  }

  // 일반: 무기 + 길 스킬 랜덤 혼합 (최대 3개)
  const allOptions = [
    ...weaponPool.map((w) => ({ isPathSkill: false, weaponType: w })),
    ...pathSkillOptions.map((sk) => ({ isPathSkill: true, skill: sk, skillId: sk.id })),
  ];

  if (allOptions.length === 0) return [];
  return Phaser.Utils.Array.Shuffle(allOptions).slice(0, 3);
}

// ═══════════════════════════════════════════════════════
// 길 스킬 이펙트 함수들
// ═══════════════════════════════════════════════════════
function showGazeSlow(scene, x, y) {
  const txt = scene.add.text(x, y - 22, "◆", { fontSize: "16px", color: "#ff9966" }).setOrigin(0.5).setDepth(90);
  scene.tweens.add({ targets: txt, alpha: 0, y: y - 50, duration: 550, onComplete: () => txt.destroy() });
}
function showGazeStun(scene, x, y) {
  const ring = scene.add.circle(x, y, 28, 0xff6644, 0).setStrokeStyle(3, 0xff6644, 0.85).setDepth(90);
  scene.tweens.add({ targets: ring, alpha: 0, scale: 1.8, duration: 300, onComplete: () => ring.destroy() });
  const txt = scene.add.text(x, y - 26, "STUN", { fontSize: "14px", color: "#ff6644", fontStyle: "bold" }).setOrigin(0.5).setDepth(91);
  scene.tweens.add({ targets: txt, alpha: 0, y: y - 60, duration: 500, onComplete: () => txt.destroy() });
}

function showBreath(scene, x, y, angle, length, halfW) {
  // 부채꼴 레이저 이펙트
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const spread = (i / (steps - 1) - 0.5) * (halfW / 180);
    const a = angle + spread;
    const endX = x + Math.cos(a) * length;
    const endY = y + Math.sin(a) * length;
    const midX = (x + endX) / 2, midY = (y + endY) / 2;
    const len = Phaser.Math.Distance.Between(x, y, endX, endY);
    const beam = scene.add.rectangle(midX, midY, len, 28 - i * 2, 0xff4400, 0.6 - i * 0.05)
      .setRotation(a).setDepth(62);
    scene.tweens.add({ targets: beam, alpha: 0, scaleY: 0.1, duration: 220, onComplete: () => beam.destroy() });
  }

  // 중심 코어
  const endX = x + Math.cos(angle) * length;
  const endY = y + Math.sin(angle) * length;
  const midX = (x + endX) / 2, midY = (y + endY) / 2;
  const coreLen = Phaser.Math.Distance.Between(x, y, endX, endY);
  const core = scene.add.rectangle(midX, midY, coreLen, 8, 0xffffff, 0.9).setRotation(angle).setDepth(63);
  scene.tweens.add({ targets: core, alpha: 0, scaleY: 0.1, duration: 180, onComplete: () => core.destroy() });

  // 용 아이콘 플로팅
  const icon = scene.add.text(x, y - 44, "🐉", { fontSize: "28px" }).setOrigin(0.5).setDepth(200);
  scene.tweens.add({ targets: icon, alpha: 0, y: y - 90, duration: 700, onComplete: () => icon.destroy() });
}

function showTimeStopStart(scene) {
  const cx = scene.scale.width / 2, cy = scene.scale.height / 2;
  const flash = scene.add.rectangle(0, 0, scene.scale.width, scene.scale.height, 0xffcc44, 0.22)
    .setOrigin(0).setScrollFactor(0).setDepth(4000);
  const text = scene.add.text(cx, cy, "⏸ 영원불멸", {
    fontSize: "42px", color: "#ffcc44", fontStyle: "bold",
    shadow: { blur: 22, color: "#000", fill: true },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4001);

  scene.tweens.add({ targets: flash, alpha: 0, duration: 800, onComplete: () => flash.destroy() });
  scene.tweens.add({ targets: text, alpha: 0, y: cy - 40, duration: 1200, delay: 400, onComplete: () => text.destroy() });

  // 화면 가장자리 파란 테두리
  const border = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2,
    scene.scale.width - 4, scene.scale.height - 4, 0x000000, 0)
    .setStrokeStyle(4, 0x88ddff, 0.7).setScrollFactor(0).setDepth(3999).setName("timeStopBorder");
  scene.children.bringToTop(border);
  scene.timeStopBorder = border;
}

function showTimeStopEnd(scene) {
  if (scene.timeStopBorder) { scene.timeStopBorder.destroy(); scene.timeStopBorder = null; }
  const cx = scene.scale.width / 2, cy = scene.scale.height / 2;
  const text = scene.add.text(cx, cy, "▶ 시간이 흐른다", {
    fontSize: "28px", color: "#aaddff",
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4001);
  scene.tweens.add({ targets: text, alpha: 0, y: cy - 30, duration: 900, delay: 200, onComplete: () => text.destroy() });
}

function showBaekNotice(scene) {
  const text = scene.add.text(player.x, player.y - 50, "백경무예!", {
    fontSize: "22px", color: "#ffee44", fontStyle: "bold",
  }).setOrigin(0.5).setDepth(200);
  scene.tweens.add({ targets: text, alpha: 0, y: player.y - 110, duration: 900, onComplete: () => text.destroy() });
}

function showShedEffect(scene) {
  const ring = scene.add.circle(player.x, player.y, 80, 0x44ff88, 0)
    .setStrokeStyle(4, 0x44ff88, 0.9).setDepth(80);
  scene.tweens.add({ targets: ring, alpha: 0, scale: 2.2, duration: 600, onComplete: () => ring.destroy() });
  const text = scene.add.text(player.x, player.y - 52, "🐍 시해!", {
    fontSize: "22px", color: "#44ff88", fontStyle: "bold",
  }).setOrigin(0.5).setDepth(200);
  scene.tweens.add({ targets: text, alpha: 0, y: player.y - 110, duration: 900, onComplete: () => text.destroy() });
}

function showDevourEffect(scene, range) {
  const ring = scene.add.circle(player.x, player.y, range, 0x22ffcc, 0)
    .setStrokeStyle(3, 0x22ffcc, 0.8).setDepth(80);
  scene.tweens.add({ targets: ring, alpha: 0, scale: 1.3, duration: 500, onComplete: () => ring.destroy() });
  const text = scene.add.text(player.x, player.y - 52, "🦷 탐식!", {
    fontSize: "22px", color: "#22ffcc", fontStyle: "bold",
  }).setOrigin(0.5).setDepth(200);
  scene.tweens.add({ targets: text, alpha: 0, y: player.y - 110, duration: 900, onComplete: () => text.destroy() });
}

function showDreamEffect(scene) {
  const text = scene.add.text(scene.scale.width / 2, scene.scale.height / 2 - 60, "😴 괴물의 꿈", {
    fontSize: "32px", color: "#88ff44", fontStyle: "bold",
    shadow: { blur: 14, color: "#000", fill: true },
  }).setOrigin(0.5).setScrollFactor(0).setDepth(4001);
  scene.tweens.add({ targets: text, alpha: 0, y: scene.scale.height / 2 - 120, duration: 1500, delay: 400, onComplete: () => text.destroy() });
}

// ═══════════════════════════════════════════════════════
// 영원불멸 키 바인딩 (E 키)
// ═══════════════════════════════════════════════════════
// create()에서 이미 cursors 설정 후 아래 라인 추가:
// eternalKey = this.input.keyboard.addKey("E");

// ─── 조이스틱 ────────────────────────────────────────────
function createJoystick() {
  const base = this.add.circle(0, 0, 58, 0xffffff, 0.1)
    .setStrokeStyle(3, 0x8df7ff, 0.45).setScrollFactor(0).setDepth(1500).setVisible(false);
  const knob = this.add.circle(0, 0, 24, 0x8df7ff, 0.35)
    .setStrokeStyle(2, 0xffffff, 0.55).setScrollFactor(0).setDepth(1501).setVisible(false);

  joystick = { base, knob, pointerId: null, active: false, radius: 54, vector: new Phaser.Math.Vector2(0, 0) };

  this.input.on("pointerdown", (pointer) => {
    if (isChoosingWeapon || joystick.active) return;
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
  this.input.on("pointerup", (pointer) => { if (joystick.pointerId === pointer.id) resetJoystick(); });
  this.input.on("pointerupoutside", (pointer) => { if (joystick.pointerId === pointer.id) resetJoystick(); });
}

function layoutJoystick() {}

function updateJoystick(pointerX, pointerY) {
  const dx = pointerX - joystick.base.x, dy = pointerY - joystick.base.y;
  const distance = Math.min(joystick.radius, Math.sqrt(dx * dx + dy * dy));
  const angle = Math.atan2(dy, dx);
  joystick.knob.setPosition(joystick.base.x + Math.cos(angle) * distance, joystick.base.y + Math.sin(angle) * distance);
  joystick.vector.set((Math.cos(angle) * distance) / joystick.radius, (Math.sin(angle) * distance) / joystick.radius);
}

function resetJoystick() {
  joystick.active = false; joystick.pointerId = null; joystick.vector.set(0, 0);
  joystick.base.setVisible(false); joystick.knob.setVisible(false);
}

// ─── 플레이어 이동 ──────────────────────────────────────
function movePlayer() {
  const maxSpeed = 350;
  let dx = 0, dy = 0;
  if (cursors.left.isDown)  dx -= 1;
  if (cursors.right.isDown) dx += 1;
  if (cursors.up.isDown)    dy -= 1;
  if (cursors.down.isDown)  dy += 1;
  if (joystick?.active) { dx += joystick.vector.x; dy += joystick.vector.y; }
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len > 1) { dx /= len; dy /= len; }

  if (dx !== 0 || dy !== 0) {
    playerVelocity.x = dx * maxSpeed; playerVelocity.y = dy * maxSpeed;
  } else {
    playerVelocity.x *= 0.7; playerVelocity.y *= 0.7;
    if (Math.abs(playerVelocity.x) < 5) playerVelocity.x = 0;
    if (Math.abs(playerVelocity.y) < 5) playerVelocity.y = 0;
  }

  player.body.setVelocity(playerVelocity.x, playerVelocity.y);

  if (Math.abs(playerVelocity.x) > 30 || Math.abs(playerVelocity.y) > 30)
    lastMoveAngle = Math.atan2(playerVelocity.y, playerVelocity.x);

  const isMoving = Math.abs(playerVelocity.x) > 10 || Math.abs(playerVelocity.y) > 10;
  if (isMoving && player.anims.currentAnim?.key !== "walk") player.play("walk");
  else if (!isMoving && player.anims.currentAnim?.key !== "idle") player.play("idle");
}

function pullExpOrbs() {
  expOrbs.getChildren().forEach((orb) => {
    if (Phaser.Math.Distance.Between(player.x, player.y, orb.x, orb.y) < 225)
      this.physics.moveToObject(orb, player, 520);
  });
}

// ─── 레벨업 텍스트 ──────────────────────────────────────
function showLevelUpText() {
  if (levelUpText) levelUpText.destroy();
  levelUpText = this.add.text(player.x, player.y - 50, `LEVEL UP! Lv.${level}`, {
    fontSize: "20px", color: "#00ff00",
  }).setDepth(100);
  this.time.delayedCall(1000, () => { if (levelUpText) { levelUpText.destroy(); levelUpText = null; } });
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

// ─── 무기 카드 ──────────────────────────────────────────
function createWeaponCard(x, y, number, weaponType, nextLevel) {
  const card = this.add.container(x, y);
  const nextDamage = getWeaponDamage(weaponType.id, nextLevel);
  const bg = this.add.rectangle(0, 0, 200, 260, 0x151a24, 0.96)
    .setStrokeStyle(2, weaponType.color).setName("bg");
  const key = this.add.text(-82, -112, `${number}`, {
    fontSize: "18px", color: "#ffffff", backgroundColor: "#2e3544", padding: { x: 8, y: 4 },
  });
  const icon = this.add.text(0, -66, weaponType.icon, {
    fontSize: "34px", color: `#${weaponType.color.toString(16).padStart(6, "0")}`, fontStyle: "bold",
  }).setOrigin(0.5);
  const name = this.add.text(0, -18, weaponType.name, {
    fontSize: "22px", color: "#ffffff", fontStyle: "bold",
  }).setOrigin(0.5);
  const levelLabel = this.add.text(0, 20, `Lv.${nextLevel}`, { fontSize: "18px", color: "#b7f7ff" }).setOrigin(0.5);
  const damageLabel = this.add.text(0, 52, `DMG ${formatDamage(nextDamage)} / hit`, {
    fontSize: "15px", color: "#fff0a6", fontStyle: "bold",
  }).setOrigin(0.5);
  const desc = this.add.text(0, 88, weaponType.desc[nextLevel - 1], {
    fontSize: "15px", color: "#d8deea", align: "center", wordWrap: { width: 160 },
  }).setOrigin(0.5);
  card.add([bg, key, icon, name, levelLabel, damageLabel, desc]);
  return card;
}

// ─── HUD ────────────────────────────────────────────────
function updateWeaponHud() {
  const weaponParts = weaponManager.weapons.map((w) => `${w.definition.name} Lv.${w.level}`);
  const skillParts = pathManager && pathManager.acquiredSkills.length > 0
    ? pathManager.acquiredSkills.map((sid) => `✦ ${PATH_SKILLS[sid].name}`)
    : [];
  const pathPart = pathManager?.chosenPath
    ? [`[${PATH_TYPES[pathManager.chosenPath].name}]`]
    : [];

  weaponText.setText([...pathPart, ...weaponParts, ...skillParts].join(" / "));
  layoutHud(weaponText.scene);
}

function updateExpHud() {
  expInfoText.setText(`Lv. ${level}\nEXP ${exp}/${expToNextLevel}`);
}

function layoutHud(scene, width = scene.scale.width, height = scene.scale.height) {
  const padding = Math.max(14, Math.min(24, width * 0.035));
  const compact = width < 640;
  const safeWidth = Math.max(150, width - padding * 2);

  levelText.setPosition(padding, padding).setFontSize(compact ? "18px" : "24px");
  timerText.setPosition(width / 2, padding).setFontSize(compact ? "16px" : "22px");
  weaponText.setPosition(padding, compact ? padding + 34 : padding + 38).setFontSize(compact ? "12px" : "16px");
  weaponText.setWordWrapWidth(compact ? Math.floor(safeWidth * 0.62) : Math.floor(safeWidth * 0.55));
  expInfoText.setPosition(width - padding, padding).setFontSize(compact ? "12px" : "15px");
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
    skull: [3.0, 3.8, 4.6, 5.5, 6.5],
    lung: [2.8, 3.5, 4.2, 5.2, 6.2],
    scythe: [4.0, 5.0, 6.0, 7.2, 8.5],
    blackHole: [3.5, 4.5, 5.5, 6.8, 8.2],
    boomerang: [2.0, 2.6, 3.2, 4.0, 4.8],
    chain: [1.8, 2.3, 2.8, 3.4, 4.2],
  };
  return damageTable[type][Math.min(level, 5) - 1];
}

// ─── 적 스폰 ────────────────────────────────────────────
function spawnEnemy() {
  if (enemies.getLength() >= MAX_ENEMIES) return;
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = 1200;
  const x = player.x + Math.cos(angle) * distance;
  const y = player.y + Math.sin(angle) * distance;
  const enemy = this.add.circle(x, y, 20, 0xff3355);
  this.physics.add.existing(enemy);
  enemy.maxHp = enemyMaxHp; enemy.hp = enemy.maxHp;
  enemy.burnUntil = 0; enemy.stunnedUntil = 0;
  enemies.add(enemy);
}

function spawnEnemyWave() {
  const current = enemies.getLength();
  if (current >= MAX_ENEMIES) return;
  enemySpawnRemainder += 1 + enemySpawnBonus;
  const spawnCount = Math.min(Math.floor(enemySpawnRemainder), MAX_ENEMIES - current);
  enemySpawnRemainder -= Math.floor(enemySpawnRemainder);
  for (let i = 0; i < spawnCount; i++) spawnEnemy.call(this);
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
  const growthRate = 0.12 + elapsedSeconds * 0.004;
  enemySpawnBonus += growthRate;
  const newDelay = Math.max(120, 250 - elapsedSeconds * 1.2);
  spawnTimer.delay = newDelay;
  if (elapsedSeconds % 60 === 0) {
    showWarningText.call(gameSceneRef);
    gameSceneRef.time.delayedCall(2000, () => {
      const waveCount = 20 + Math.floor(elapsedSeconds / 60) * 10;
      for (let i = 0; i < waveCount; i++) spawnEnemy.call(gameSceneRef);
    });
  }
}

// ─── 전투 ────────────────────────────────────────────────
function handleBulletHit(bullet, enemy) {
  damageEnemy.call(this, enemy, bullet.damage || 1);
  if (bullet.explodeRadius) {
    explode.call(this, bullet.x, bullet.y, bullet.explodeRadius, bullet.explodeDamage || 1,
      bullet.poisonOnExplode ? { poison: true } : {});
  }
  if (bullet.splitOnHit) splitMissile.call(this, bullet.x, bullet.y);
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

  // 만상무예 카운트
  if (pathManager) pathManager.countAttack();

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
  this.tweens.add({ targets: blast, alpha: 0, scale: 1.4, duration: 220, onComplete: () => blast.destroy() });
  this.tweens.add({ targets: ring, alpha: 0, scale: 2.2, duration: 260, ease: "Cubic.easeOut", onComplete: () => ring.destroy() });
  for (let i = 0; i < 10; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const spark = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0xfff0aa, 0.9).setDepth(42);
    this.tweens.add({ targets: spark, x: x + Math.cos(angle) * Phaser.Math.Between(radius * 0.45, radius), y: y + Math.sin(angle) * Phaser.Math.Between(radius * 0.45, radius), alpha: 0, scale: 0.2, duration: Phaser.Math.Between(160, 280), onComplete: () => spark.destroy() });
  }
  enemies.getChildren().forEach((enemy) => {
    if (Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= radius) {
      damageEnemy.call(this, enemy, damage);
      if (options?.poison && enemy.active) {
        enemy.poisonUntil = Math.max(enemy.poisonUntil || 0, this.time.now + 3000);
        enemy.poisonDamage = 0.7; enemy.nextPoisonTick = 0;
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
    if (bullet.homing && bullet.target && bullet.target.active)
      this.physics.moveToObject(bullet, bullet.target, bullet.speed || 520);
    if (bullet.isTracer && bullet.body)
      bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
    if (bullet.burn && bullet.target && bullet.target.active)
      bullet.target.burnUntil = Math.max(bullet.target.burnUntil || 0, time + 1200);
    if (bullet.x < player.x - 1600 || bullet.x > player.x + 1600 || bullet.y < player.y - 1600 || bullet.y > player.y + 1600)
      bullet.destroy();
  });

  enemies.getChildren().forEach((enemy) => {
    if (!enemy.active || !enemy.body) return;
    if (enemy.burnUntil > time && (!enemy.nextBurnTick || time > enemy.nextBurnTick)) {
      enemy.nextBurnTick = time + 350;
      damageEnemy.call(this, enemy, 0.5);
    }
    if (enemy.poisonUntil > time && (!enemy.nextPoisonTick || time > enemy.nextPoisonTick)) {
      enemy.nextPoisonTick = time + 400;
      damageEnemy.call(this, enemy, enemy.poisonDamage || 0.4);
      if (enemy.active) enemy.setFillStyle(0x99ff66);
    }
  });
}

// ─── 투사체 생성 ─────────────────────────────────────────
function createProjectile(scene, x, y, color, radius = 6) {
  const bullet = scene.add.circle(x, y, radius, color);
  scene.physics.add.existing(bullet);
  bullet.trailColor = color; bullet.trailSize = radius;
  bullets.add(bullet);
  return bullet;
}

function createTracerProjectile(scene, x, y, angle, color = 0xffff66) {
  const bullet = scene.add.rectangle(x, y, 22, 3, color, 0.95).setRotation(angle).setDepth(24);
  scene.physics.add.existing(bullet);
  bullet.body.setSize(22, 3);
  bullet.isTracer = true; bullet.trailColor = color; bullet.trailSize = 3;
  bullets.add(bullet);
  return bullet;
}

// ─── 이펙트 ──────────────────────────────────────────────
function showMuzzleFlash(scene, x, y, angle, color = 0xffffaa) {
  const flash = scene.add.triangle(x + Math.cos(angle) * 18, y + Math.sin(angle) * 18, 0, -7, 28, 0, 0, 7, color, 0.85)
    .setRotation(angle).setDepth(38);
  scene.tweens.add({ targets: flash, alpha: 0, scale: 1.8, duration: 90, onComplete: () => flash.destroy() });
}

function showTrailDot(x, y, color, size = 5) {
  const trail = this.add.circle(x, y, size, color, 0.28).setDepth(10);
  this.tweens.add({ targets: trail, alpha: 0, scale: 0.25, duration: 180, onComplete: () => trail.destroy() });
}

function showHitFlash(x, y) {
  const flash = this.add.circle(x, y, 18, 0xffffff, 0.28).setDepth(55);
  this.tweens.add({ targets: flash, alpha: 0, scale: 0.15, duration: 90, onComplete: () => flash.destroy() });
}

function showDeathBurst(x, y) {
  const ring = this.add.circle(x, y, 20, 0xff6688, 0).setStrokeStyle(3, 0xff6688, 0.9).setDepth(44);
  this.tweens.add({ targets: ring, alpha: 0, scale: 2.2, duration: 220, onComplete: () => ring.destroy() });
  for (let i = 0; i < 7; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const shard = this.add.rectangle(x, y, 10, 3, 0xff6688, 0.9).setRotation(angle).setDepth(43);
    this.tweens.add({ targets: shard, x: x + Math.cos(angle) * Phaser.Math.Between(25, 55), y: y + Math.sin(angle) * Phaser.Math.Between(25, 55), alpha: 0, duration: 210, onComplete: () => shard.destroy() });
  }
}

function showEnemyGrowthPulse(x, y) {
  const pulse = this.add.circle(x, y, 24, 0xff3355, 0).setStrokeStyle(2, 0xff99aa, 0.75).setDepth(35);
  this.tweens.add({ targets: pulse, alpha: 0, scale: 1.8, duration: 260, onComplete: () => pulse.destroy() });
}

function showLightningStrike(scene, x, y, isStorm = false) {
  const height = isStorm ? 620 : 470, topY = y - height;
  const bolt = scene.add.graphics().setDepth(70), glow = scene.add.graphics().setDepth(69);
  const points = [];
  for (let i = 0; i <= 9; i++) {
    const progress = i / 9;
    const spread = i === 0 || i === 9 ? 0 : Phaser.Math.Between(-26, 26);
    points.push({ x: x + spread, y: topY + height * progress });
  }
  glow.lineStyle(isStorm ? 24 : 18, 0x9eeeff, 0.22);
  bolt.lineStyle(isStorm ? 7 : 5, 0xeaffff, 0.96);
  drawPolyline(glow, points); drawPolyline(bolt, points);
  for (let i = 2; i < points.length - 1; i += 2) {
    const start = points[i], branchDir = Math.random() < 0.5 ? -1 : 1;
    const branch = scene.add.graphics().setDepth(70);
    const endX = start.x + branchDir * Phaser.Math.Between(36, 72), endY = start.y + Phaser.Math.Between(18, 52);
    branch.lineStyle(2, 0xcff7ff, 0.86);
    branch.beginPath(); branch.moveTo(start.x, start.y);
    branch.lineTo((start.x + endX) / 2 + branchDir * 14, (start.y + endY) / 2);
    branch.lineTo(endX, endY); branch.strokePath();
    scene.tweens.add({ targets: branch, alpha: 0, duration: 140, onComplete: () => branch.destroy() });
  }
  const impactGlow = scene.add.circle(x, y, isStorm ? 52 : 40, 0x99eeff, 0.32).setDepth(68);
  const impactRing = scene.add.circle(x, y, isStorm ? 34 : 26, 0xffffff, 0).setStrokeStyle(4, 0xcff7ff, 0.9).setDepth(71);
  const scorch = scene.add.circle(x, y + 4, isStorm ? 30 : 22, 0x23465a, 0.34).setDepth(8);
  scene.tweens.add({ targets: [bolt, glow], alpha: 0, duration: 150, onComplete: () => { bolt.destroy(); glow.destroy(); } });
  scene.tweens.add({ targets: impactGlow, alpha: 0, scale: 1.7, duration: 230, onComplete: () => impactGlow.destroy() });
  scene.tweens.add({ targets: impactRing, alpha: 0, scale: 2.1, duration: 260, onComplete: () => impactRing.destroy() });
  scene.tweens.add({ targets: scorch, alpha: 0, duration: 900, onComplete: () => scorch.destroy() });
}

function drawPolyline(graphics, points) {
  graphics.beginPath(); graphics.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) graphics.lineTo(points[i].x, points[i].y);
  graphics.strokePath();
}

function showLaserBeam(scene, startX, startY, endX, endY, burn = false) {
  const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
  const length = Phaser.Math.Distance.Between(startX, startY, endX, endY);
  const midX = (startX + endX) / 2, midY = (startY + endY) / 2;
  const glowColor = burn ? 0xff8844 : 0xff5533;
  const core = scene.add.rectangle(midX, midY, length, 4, 0xffffff, 0.95).setRotation(angle).setDepth(61);
  const beam = scene.add.rectangle(midX, midY, length, 10, 0xff5533, 0.82).setRotation(angle).setDepth(60);
  const glow = scene.add.rectangle(midX, midY, length, 26, glowColor, 0.22).setRotation(angle).setDepth(59);
  const muzzle = scene.add.circle(startX, startY, 22, 0xff5533, 0.35).setDepth(62);
  const endpoint = scene.add.circle(endX, endY, 18, 0xffaa66, 0.25).setDepth(62);
  scene.tweens.add({ targets: [core, beam, glow], alpha: 0, scaleY: 0.25, duration: 180, ease: "Cubic.easeOut", onComplete: () => { core.destroy(); beam.destroy(); glow.destroy(); } });
  scene.tweens.add({ targets: [muzzle, endpoint], alpha: 0, scale: 1.8, duration: 180, onComplete: () => { muzzle.destroy(); endpoint.destroy(); } });
}

// ─── 유틸 ────────────────────────────────────────────────
function findNearestEnemy(excludeEnemy = null) {
  let nearest = null, shortestDistance = Infinity;
  enemies.getChildren().forEach((enemy) => {
    if (enemy === excludeEnemy || !enemy.active) return;
    const distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    if (distance < shortestDistance) { shortestDistance = distance; nearest = enemy; }
  });
  return nearest;
}

function findEnemiesInRange(x, y, range, limit = Infinity) {
  return enemies.getChildren()
    .filter((e) => e.active)
    .map((e) => ({ enemy: e, distance: Phaser.Math.Distance.Between(x, y, e.x, e.y) }))
    .filter((entry) => entry.distance <= range)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((entry) => entry.enemy);
}

function splitMissile(x, y) {
  findEnemiesInRange(x, y, 650, 3).forEach((target) => {
    const bullet = createProjectile(this, x, y, 0xd6a6ff, 5);
    bullet.damage = getWeaponDamage("magicMissile", 5) * 0.45;
    bullet.homing = true; bullet.target = target; bullet.speed = 520;
    this.physics.moveToObject(bullet, target, bullet.speed);
  });
}

function distanceToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return Phaser.Math.Distance.Between(px, py, x1, y1);
  const t = Phaser.Math.Clamp(((px - x1) * dx + (py - y1) * dy) / lengthSquared, 0, 1);
  return Phaser.Math.Distance.Between(px, py, x1 + t * dx, y1 + t * dy);
}

// ═══════════════════════════════════════════════════════
// 무기 매니저
// ═══════════════════════════════════════════════════════
class WeaponManager {
  constructor(scene) {
    this.scene = scene;
    this.weapons = [];
    this.maxWeapons = 5;
    this.timeStopped = false;   // 영원불멸 중 무기 동작 여부
    this.globalCastCount = 0;   // 무량무예 카운터
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

  tick(time, delta) {
    // 영원불멸 중에도 무기는 발동 (플레이어만 움직임)
    this.weapons.forEach((w) => w.tick(time, delta));
  }

  // 무량무예: 무기 시전 1회 카운트 후 보너스 시전 여부 반환
  countCast(weaponTick) {
    if (!pathManager?.hasSkill("warriorMu")) return false;
    this.globalCastCount++;
    if (this.globalCastCount % 10 === 0) {
      // 보너스 2회 추가 시전
      weaponTick(); weaponTick();
    }
  }
}

class AutoWeapon {
  constructor(scene, type, cooldown) {
    this.scene = scene; this.type = type; this.level = 1;
    this.cooldown = cooldown; this.lastFire = 0;
    this.definition = WEAPON_TYPES.find((w) => w.id === type);
  }
  upgrade() { this.level = Math.min(this.level + 1, 5); }
  canFire(time, cooldown = this.cooldown) { return time > this.lastFire + cooldown; }

  // 무기 발사 후 무량무예 카운트
  notifyCast(time, delta) {
    weaponManager.countCast(() => this.tick(time, delta));
  }
}

// ── 이하 무기 클래스들은 원본과 동일 ────────────────────
class MachineGunWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "machineGun", 180); this.shotCount = 0; this.lastDroneShot = 0; }
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
        this.shotCount++;
        if (this.level >= 3 && this.shotCount % 8 === 0) { bullet.homing = true; bullet.target = target; bullet.speed = 650; }
        showMuzzleFlash(this.scene, player.x, player.y, angle, 0xffffaa);
        this.scene.physics.moveToObject(bullet, target, 650);
      }
      weaponManager.countCast(() => this.tick(time, 0));
    }
    if (this.level >= 5 && time > this.lastDroneShot + 650) {
      this.lastDroneShot = time;
      [-55, 55].forEach((offset) => {
        const target = findNearestEnemy();
        if (!target) return;
        const angle = Phaser.Math.Angle.Between(player.x + offset, player.y - 30, target.x, target.y);
        const bullet = createTracerProjectile(this.scene, player.x + offset, player.y - 30, angle, 0x99ff66);
        bullet.damage = getWeaponDamage(this.type, this.level) * 0.75;
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
      bullet.homing = true; bullet.target = target; bullet.speed = 480;
      bullet.pierce = this.level >= 3 ? 1 : 0;
      bullet.explodeRadius = this.level >= 4 ? 70 : 0;
      bullet.explodeDamage = getWeaponDamage(this.type, this.level) * 0.5;
      bullet.splitOnHit = this.level >= 5;
      bullet.trailColor = 0xd6a6ff; bullet.trailSize = 8;
      this.scene.tweens.add({ targets: aura, alpha: 0, scale: 2.1, duration: 220, onComplete: () => aura.destroy() });
      this.scene.physics.moveToObject(bullet, target, bullet.speed);
    }
    weaponManager.countCast(() => this.tick(time));
  }
}

class LightningWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "lightning", 1100); this.lastStorm = 0; }
  tick(time) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const targets = findEnemiesInRange(player.x, player.y, 650, this.level >= 2 ? 2 : 1);
      targets.forEach((target) => this.strike(target, time));
      if (this.level >= 3 && targets[0]) {
        findEnemiesInRange(targets[0].x, targets[0].y, 280, 2).filter((e) => !targets.includes(e))
          .forEach((target) => this.strike(target, time, getWeaponDamage(this.type, this.level) * 0.55));
      }
      weaponManager.countCast(() => this.tick(time));
    }
    if (this.level >= 5 && time > this.lastStorm + 2500) {
      this.lastStorm = time;
      findEnemiesInRange(player.x, player.y, 900, 5).forEach((target) =>
        this.strike(target, time, getWeaponDamage(this.type, this.level) * 0.75));
    }
  }
  strike(target, time, damage = getWeaponDamage("lightning", this.level)) {
    showLightningStrike(this.scene, target.x, target.y, this.level >= 5);
    if (this.level >= 4) { target.stunnedUntil = time + 700; target.setFillStyle(0x99ddff); }
    damageEnemy.call(this.scene, target, damage);
  }
}

class SwordWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "sword", 850); this.rotationAngle = 0; this.lastSpinDamage = 0; }
  tick(time, delta) {
    if (this.canFire(time)) {
      this.lastFire = time;
      const swings = this.level >= 3 ? 2 : 1;
      for (let i = 0; i < swings; i++) this.scene.time.delayedCall(i * 130, () => this.swing());
      if (this.level >= 4) this.swordWave();
      weaponManager.countCast(() => this.tick(time, delta));
    }
    if (this.level >= 5) {
      this.rotationAngle += delta * 0.006;
      const radius = 95;
      const x = player.x + Math.cos(this.rotationAngle) * radius;
      const y = player.y + Math.sin(this.rotationAngle) * radius;
      const blade = this.scene.add.rectangle(x, y, 42, 10, 0xffd1dc, 0.85).setRotation(this.rotationAngle).setDepth(30);
      this.scene.tweens.add({ targets: blade, alpha: 0, duration: 90, onComplete: () => blade.destroy() });
      if (time > this.lastSpinDamage + 250) {
        this.lastSpinDamage = time;
        findEnemiesInRange(player.x, player.y, radius + 35, 4).forEach((enemy) =>
          damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level) * 0.45));
      }
    }
  }
  swing() {
    const range = this.level >= 2 ? 150 : 105;
    const target = findNearestEnemy();
    const angle = target ? Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) : this.rotationAngle;
    const arc = this.scene.add.arc(player.x, player.y, range, -65, 65, false, 0xffd1dc, 0.2)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(8, 0xffffff, 0.55).setDepth(25);
    const edge = this.scene.add.arc(player.x, player.y, range + 10, -55, 55, false, 0xffffff, 0)
      .setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(3, 0xffd1dc, 0.9).setDepth(26);
    this.scene.tweens.add({ targets: [arc, edge], alpha: 0, scale: 1.15, duration: 180, onComplete: () => { arc.destroy(); edge.destroy(); } });
    findEnemiesInRange(player.x, player.y, range, 8).forEach((enemy) =>
      damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level)));
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
    wave.trailColor = 0xffd1dc; wave.trailSize = 28;
    this.scene.physics.moveToObject(wave, target, 520);
  }
}

class LaserWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "laser", 1250); this.spinAngle = 0; this.lastSpin = 0; }
  tick(time, delta) {
    if (this.canFire(time)) {
      this.lastFire = time;
      if (this.level >= 2) {
        const targets = findEnemiesInRange(player.x, player.y, 900, 2);
        if (targets.length === 0) return;
        targets.forEach((t) => this.fireLaser(Phaser.Math.Angle.Between(player.x, player.y, t.x, t.y), 780, this.level >= 4));
        if (targets.length === 1) this.fireLaser(Phaser.Math.Angle.Between(player.x, player.y, targets[0].x, targets[0].y) + 0.12, 780, this.level >= 4);
      } else {
        const target = findNearestEnemy();
        if (!target) return;
        this.fireLaser(Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y), 560, false);
      }
      weaponManager.countCast(() => this.tick(time, delta));
    }
    if (this.level >= 5 && time > this.lastSpin + 180) {
      this.lastSpin = time;
      this.spinAngle += delta * 0.006 + 0.22;
      this.fireLaser(this.spinAngle, 700, true, getWeaponDamage(this.type, this.level) * 0.35);
    }
  }
  fireLaser(angle, length, burn = false, damage = getWeaponDamage("laser", this.level)) {
    const endX = player.x + Math.cos(angle) * length, endY = player.y + Math.sin(angle) * length;
    showLaserBeam(this.scene, player.x, player.y, endX, endY, burn);
    enemies.getChildren().forEach((enemy) => {
      if (distanceToSegment(enemy.x, enemy.y, player.x, player.y, endX, endY) <= 28) {
        if (burn) enemy.burnUntil = this.scene.time.now + 1200;
        damageEnemy.call(this.scene, enemy, damage);
      }
    });
  }
}

class SkullWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "skull", 5000); }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    const radius = this.level >= 3 ? 280 : 200;
    const poisonDuration = this.level >= 2 ? 2500 : 1500;
    const stunDuration = this.level >= 4 ? 1000 : 500;
    this.showSkullEffect(radius);
    findEnemiesInRange(player.x, player.y, radius).forEach((enemy) => {
      enemy.stunnedUntil = time + stunDuration;
      enemy.setFillStyle(0xcc99ff);
      const stacks = this.level >= 5 ? 2 : 1;
      enemy.poisonUntil = Math.max(enemy.poisonUntil || 0, time + poisonDuration * stacks);
      enemy.poisonDamage = getWeaponDamage(this.type, this.level) * 0.3;
      enemy.nextPoisonTick = 0;
      damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level));
    });
    weaponManager.countCast(() => this.tick(time));
  }
  showSkullEffect(radius) {
    const ring = this.scene.add.circle(player.x, player.y, radius, 0xcc99ff, 0).setStrokeStyle(3, 0xcc99ff, 0.7).setDepth(50);
    const fog = this.scene.add.circle(player.x, player.y, radius * 0.85, 0x220033, 0.18).setDepth(49);
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const drop = this.scene.add.circle(player.x + Math.cos(angle) * radius * 0.5, player.y + Math.sin(angle) * radius * 0.5, 4, 0x99ff66, 0.8).setDepth(51);
      this.scene.tweens.add({ targets: drop, x: player.x + Math.cos(angle) * radius, y: player.y + Math.sin(angle) * radius, alpha: 0, scale: 0.2, duration: 600, onComplete: () => drop.destroy() });
    }
    this.scene.tweens.add({ targets: [ring, fog], alpha: 0, scale: 1.15, duration: 700, ease: "Cubic.easeOut", onComplete: () => { ring.destroy(); fog.destroy(); } });
  }
}

class LungWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "lung", 4000); }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    const count = this.level >= 3 ? 5 : 3;
    const radius = this.level >= 2 ? 130 : 95;
    const damage = getWeaponDamage(this.type, this.level);
    for (let i = 0; i < count; i++) {
      this.scene.time.delayedCall(i * 220, () => {
        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const dist = Phaser.Math.FloatBetween(40, 160);
        const ex = player.x + Math.cos(angle) * dist, ey = player.y + Math.sin(angle) * dist;
        explode.call(this.scene, ex, ey, radius, damage * (this.level >= 4 ? 1.4 : 1.0));
        if (this.level >= 5) findEnemiesInRange(ex, ey, radius).forEach((enemy) => { enemy.burnUntil = Math.max(enemy.burnUntil || 0, this.scene.time.now + 1500); });
        const smoke = this.scene.add.circle(ex, ey, radius * 0.6, 0xff6622, 0.15).setDepth(38);
        this.scene.tweens.add({ targets: smoke, alpha: 0, scale: 1.6, y: smoke.y - 30, duration: 500, onComplete: () => smoke.destroy() });
      });
    }
    weaponManager.countCast(() => this.tick(time));
  }
}

class ScytheWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "scythe", 2000); this.swingAngle = 0; }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    const swings = this.level >= 3 ? 2 : 1;
    for (let i = 0; i < swings; i++) this.scene.time.delayedCall(i * 280, () => this.swing(time));
    if (this.level >= 5) this.scene.time.delayedCall(600, () => this.spawnWhirlwind());
    weaponManager.countCast(() => this.tick(time));
  }
  swing(time) {
    const range = 250, baseAngle = lastMoveAngle - Math.PI * 0.75;
    const scythe = this.scene.add.image(player.x, player.y, "death-scythe")
      .setDisplaySize(range * 2.2, range * 2.2).setDepth(29).setAlpha(1).setOrigin(0.15, 0.85).setRotation(baseAngle);
    const startTime = this.scene.time.now, duration = 900, savedAngle = baseAngle;
    let followTimer = this.scene.time.addEvent({ delay: 16, loop: true, callback: () => {
      if (!scythe.active) { followTimer.destroy(); return; }
      scythe.setPosition(player.x, player.y);
      const elapsed = this.scene.time.now - startTime, progress = Math.min(elapsed / duration, 1);
      scythe.setRotation(savedAngle + Math.PI * 2 * progress);
      if (progress >= 1) { followTimer.destroy(); this.scene.tweens.add({ targets: scythe, alpha: 0, duration: 150, onComplete: () => scythe.destroy() }); }
    }});
    const ring = this.scene.add.circle(player.x, player.y, range, 0xccffaa, 0).setStrokeStyle(3, 0xccffaa, 0.6).setDepth(27);
    this.scene.tweens.add({ targets: ring, alpha: 0, scale: 1.15, duration: 400, ease: "Cubic.easeOut", onComplete: () => ring.destroy() });
    findEnemiesInRange(player.x, player.y, range).forEach((e) => damageEnemy.call(this.scene, e, 11.0));
    const hitEnemies = new Set(findEnemiesInRange(player.x, player.y, range));
    findEnemiesInRange(player.x, player.y, 520, 5).filter((e) => !hitEnemies.has(e)).forEach((e, i) => {
      this.scene.time.delayedCall(i * 70, () => {
        if (!e.active || !e.body) return;
        const g = this.scene.add.graphics().setDepth(48);
        let elapsed = 0;
        const pull = this.scene.time.addEvent({ delay: 16, loop: true, callback: () => {
          elapsed += 16;
          if (!e.active || !e.body) { pull.destroy(); if (g.active) g.destroy(); return; }
          g.clear();
          g.lineStyle(1.5, 0xeeffdd, 0.85); g.beginPath(); g.moveTo(player.x, player.y); g.lineTo(e.x, e.y); g.strokePath();
          if (e.active && e.body) { const a = Phaser.Math.Angle.Between(e.x, e.y, player.x, player.y); e.body.setVelocity(Math.cos(a) * 220, Math.sin(a) * 220); }
          if (elapsed >= 550) { pull.destroy(); if (g.active) g.destroy(); if (e.active) { damageEnemy.call(this.scene, e, 9.0); } }
        }});
      });
    });
  }
  spawnWhirlwind() {
    const duration = 1800, radius = 120;
    let elapsed = 0, angle = 0;
    const timer = this.scene.time.addEvent({ delay: 80, loop: true, callback: () => {
      elapsed += 80; angle += 0.45;
      const wx = player.x + Math.cos(angle) * 60, wy = player.y + Math.sin(angle) * 60;
      const blade = this.scene.add.arc(wx, wy, 38, -90, 90, false, 0x88ffcc, 0.18).setAngle(Phaser.Math.RadToDeg(angle)).setStrokeStyle(4, 0xccffee, 0.7).setDepth(30);
      this.scene.tweens.add({ targets: blade, alpha: 0, scale: 1.2, duration: 160, onComplete: () => blade.destroy() });
      findEnemiesInRange(wx, wy, radius * 0.55, 4).forEach((enemy) => damageEnemy.call(this.scene, enemy, getWeaponDamage(this.type, this.level) * 0.35));
      if (elapsed >= duration) timer.destroy();
    }});
  }
}

class BlackHoleWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "blackHole", 5000); }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    const count = this.level >= 3 ? 2 : 1;
    for (let i = 0; i < count; i++) this.scene.time.delayedCall(i * 400, () => this.spawnBlackHole(time));
    weaponManager.countCast(() => this.tick(time));
  }
  spawnBlackHole(time) {
    const target = findNearestEnemy();
    const x = target ? target.x + Phaser.Math.FloatBetween(-60, 60) : player.x + Phaser.Math.FloatBetween(-200, 200);
    const y = target ? target.y + Phaser.Math.FloatBetween(-60, 60) : player.y + Phaser.Math.FloatBetween(-200, 200);
    const pullRadius = this.level >= 2 ? 280 : 200, duration = 2000, damage = getWeaponDamage(this.type, this.level);
    const outerRing = this.scene.add.circle(x, y, pullRadius, 0x220033, 0).setStrokeStyle(2, 0xaa44ff, 0.35).setDepth(45);
    const core = this.scene.add.circle(x, y, 18, 0x000000, 1).setStrokeStyle(4, 0xcc66ff, 0.9).setDepth(47);
    const glow = this.scene.add.circle(x, y, 38, 0x6600cc, 0.22).setDepth(46);
    this.scene.tweens.add({ targets: outerRing, scale: { from: 0.4, to: 1 }, alpha: { from: 0, to: 1 }, duration: 300, ease: "Back.easeOut" });
    this.scene.tweens.add({ targets: core, scale: { from: 0.2, to: 1 }, duration: 300, ease: "Back.easeOut" });
    const pullInterval = this.scene.time.addEvent({ delay: 80, loop: true, callback: () => {
      enemies.getChildren().forEach((enemy) => {
        if (!enemy.active) return;
        const dist = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
        if (dist > pullRadius) return;
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
        enemy.body.setVelocity(Math.cos(angle) * (this.level >= 4 ? 180 : 120), Math.sin(angle) * (this.level >= 4 ? 180 : 120));
        if (this.level >= 4) enemy.stunnedUntil = Math.max(enemy.stunnedUntil || 0, this.scene.time.now + 120);
      });
    }});
    this.scene.time.delayedCall(duration, () => {
      pullInterval.destroy();
      explode.call(this.scene, x, y, this.level >= 2 ? 220 : 160, damage);
      if (this.level >= 4) findEnemiesInRange(x, y, 220).forEach((e) => { e.stunnedUntil = this.scene.time.now + 800; e.setFillStyle(0x99ddff); });
      if (this.level >= 5) for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; this.scene.time.delayedCall(i * 180, () => this.spawnMiniBlackHole(x + Math.cos(a) * 120, y + Math.sin(a) * 120, damage * 0.45)); }
      outerRing.destroy(); core.destroy(); glow.destroy();
    });
    this.scene.tweens.add({ targets: glow, scale: { from: 1, to: 1.4 }, alpha: { from: 0.22, to: 0.1 }, duration: 500, yoyo: true, repeat: Math.floor(duration / 1000) });
  }
  spawnMiniBlackHole(x, y, damage) {
    const radius = 110;
    const miniCore = this.scene.add.circle(x, y, 10, 0x000000, 1).setStrokeStyle(3, 0xcc66ff, 0.8).setDepth(47);
    const miniGlow = this.scene.add.circle(x, y, 22, 0x6600cc, 0.2).setDepth(46);
    const pull = this.scene.time.addEvent({ delay: 80, loop: true, callback: () => {
      enemies.getChildren().forEach((e) => {
        if (!e.active) return;
        if (Phaser.Math.Distance.Between(x, y, e.x, e.y) > radius) return;
        const a = Phaser.Math.Angle.Between(e.x, e.y, x, y);
        e.body.setVelocity(Math.cos(a) * 130, Math.sin(a) * 130);
      });
    }});
    this.scene.time.delayedCall(1000, () => { pull.destroy(); explode.call(this.scene, x, y, radius, damage); miniCore.destroy(); miniGlow.destroy(); });
  }
}

class BoomerangWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "boomerang", 1800); }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    const count = this.level >= 2 ? 2 : 1, trips = this.level >= 3 ? 2 : 1;
    for (let i = 0; i < count; i++) this.scene.time.delayedCall(i * 180, () => this.throwBoomerang(trips, i));
    if (this.level >= 5) [-1, 1].forEach((dir, idx) => this.scene.time.delayedCall(idx * 120, () => this.throwOrbitBoomerang(dir)));
    weaponManager.countCast(() => this.tick(time));
  }
  throwBoomerang(trips, offset = 0) {
    const target = findNearestEnemy();
    if (!target) return;
    const angle = Phaser.Math.Angle.Between(player.x, player.y, target.x, target.y) + (offset === 1 ? 0.18 : -0.09);
    this.launchBoomerang(player.x, player.y, angle, this.level >= 4 ? 14 : 10, getWeaponDamage(this.type, this.level), 520, 500, trips);
  }
  launchBoomerang(startX, startY, angle, size, damage, speed, maxDist, tripsLeft) {
    const color = 0x88ffdd;
    const boomBody = this.scene.add.rectangle(startX, startY, size * 3, size * 0.7, color, 0.92).setDepth(32);
    this.scene.physics.add.existing(boomBody);
    boomBody.body.setSize(size * 3, size * 0.7);
    boomBody.body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    let returning = false, hitEnemies = new Set(), distTraveled = 0, lastX = startX, lastY = startY;
    const spinTween = this.scene.tweens.add({ targets: boomBody, rotation: { from: 0, to: Math.PI * 2 }, duration: 400, repeat: -1 });
    const updateTimer = this.scene.time.addEvent({ delay: 16, loop: true, callback: () => {
      if (!boomBody.active) { updateTimer.destroy(); spinTween.stop(); return; }
      distTraveled += Phaser.Math.Distance.Between(lastX, lastY, boomBody.x, boomBody.y);
      lastX = boomBody.x; lastY = boomBody.y;
      enemies.getChildren().forEach((enemy) => {
        if (!enemy.active || hitEnemies.has(enemy)) return;
        if (Phaser.Math.Distance.Between(boomBody.x, boomBody.y, enemy.x, enemy.y) < size * 1.8) { hitEnemies.add(enemy); damageEnemy.call(this.scene, enemy, damage); if (returning) hitEnemies.clear(); }
      });
      if (!returning && distTraveled >= maxDist) { returning = true; hitEnemies.clear(); }
      if (returning) {
        const retAngle = Phaser.Math.Angle.Between(boomBody.x, boomBody.y, player.x, player.y);
        boomBody.body.setVelocity(Math.cos(retAngle) * speed * 1.1, Math.sin(retAngle) * speed * 1.1);
        if (Phaser.Math.Distance.Between(boomBody.x, boomBody.y, player.x, player.y) < 30) {
          updateTimer.destroy(); spinTween.stop(); boomBody.destroy();
          if (tripsLeft > 1) { const ne = findNearestEnemy(); const na = Phaser.Math.Angle.Between(player.x, player.y, ne?.x ?? player.x + 1, ne?.y ?? player.y); this.launchBoomerang(player.x, player.y, na, size, damage, speed, maxDist, tripsLeft - 1); }
        }
      }
    }});
  }
  throwOrbitBoomerang(dir) {
    let orbitAngle = dir > 0 ? 0 : Math.PI, elapsed = 0;
    const radius = 110, damage = getWeaponDamage(this.type, this.level) * 0.5, duration = 2200;
    const hitCooldown = new Map();
    const orb = this.scene.add.rectangle(player.x + Math.cos(orbitAngle) * radius, player.y + Math.sin(orbitAngle) * radius, 28, 8, 0x44ffcc, 0.88).setDepth(31);
    const timer = this.scene.time.addEvent({ delay: 16, loop: true, callback: () => {
      elapsed += 16; orbitAngle += dir * 0.09;
      const ox = player.x + Math.cos(orbitAngle) * radius, oy = player.y + Math.sin(orbitAngle) * radius;
      orb.setPosition(ox, oy).setRotation(orbitAngle);
      const trail = this.scene.add.circle(ox, oy, 4, 0x44ffcc, 0.3).setDepth(30);
      this.scene.tweens.add({ targets: trail, alpha: 0, scale: 0.1, duration: 180, onComplete: () => trail.destroy() });
      enemies.getChildren().forEach((enemy) => {
        if (!enemy.active) return;
        if (Phaser.Math.Distance.Between(ox, oy, enemy.x, enemy.y) < 30) { const last = hitCooldown.get(enemy) || 0; if (this.scene.time.now > last + 400) { hitCooldown.set(enemy, this.scene.time.now); damageEnemy.call(this.scene, enemy, damage); } }
      });
      if (elapsed >= duration) { timer.destroy(); orb.destroy(); }
    }});
  }
}

class ChainWeapon extends AutoWeapon {
  constructor(scene) { super(scene, "chain", 2200); this.activeChains = []; }
  tick(time) {
    if (!this.canFire(time)) return;
    this.lastFire = time;
    this.clearChains();
    const maxLinks = this.level >= 5 ? 5 : this.level >= 2 ? 3 : 2;
    const targets = findEnemiesInRange(player.x, player.y, 700, maxLinks);
    if (targets.length < 1) return;
    const damage = getWeaponDamage(this.type, this.level), duration = 1800;
    const chainObjs = [], allTargets = [{ x: player.x, y: player.y }, ...targets];
    for (let i = 0; i < allTargets.length - 1; i++) chainObjs.push(this.drawChainLine(allTargets[i], allTargets[i + 1]));
    this.activeChains.push(...chainObjs);
    const hitCooldown = new Map(); let elapsed = 0;
    const updateTimer = this.scene.time.addEvent({ delay: 16, loop: true, callback: () => {
      elapsed += 16;
      chainObjs.forEach((obj, i) => {
        if (!obj.active) return;
        const from = i === 0 ? player : targets[i - 1], to = targets[i];
        if (!from || !to || !to.active) { obj.destroy(); return; }
        this.updateChainLine(obj, from, to);
      });
      targets.forEach((enemy) => {
        if (!enemy.active || !enemy.body) return;
        const last = hitCooldown.get(enemy) || 0;
        if (this.scene.time.now > last + 300) {
          hitCooldown.set(enemy, this.scene.time.now);
          damageEnemy.call(this.scene, enemy, damage * 0.35);
          if (this.level >= 3) targets.forEach((other) => { if (other !== enemy && other.active) damageEnemy.call(this.scene, other, damage * 0.15); });
        }
      });
      if (this.level >= 4) targets.forEach((enemy) => {
        if (!enemy.active) return;
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        enemy.body.setVelocity(enemy.body.velocity.x + Math.cos(angle) * 30, enemy.body.velocity.y + Math.sin(angle) * 30);
      });
      if (elapsed >= duration) {
        updateTimer.destroy();
        chainObjs.forEach((obj) => { if (obj.active) obj.destroy(); });
        if (this.level >= 5) targets.forEach((enemy) => { if (enemy.active) explode.call(this.scene, enemy.x, enemy.y, 90, damage * 0.6); });
      }
    }});
    weaponManager.countCast(() => this.tick(time));
  }
  drawChainLine(from, to) { const line = this.scene.add.graphics().setDepth(48); this.updateChainLine(line, from, to); return line; }
  updateChainLine(graphics, from, to) {
    graphics.clear();
    const segments = 10, dx = to.x - from.x, dy = to.y - from.y, length = Math.sqrt(dx * dx + dy * dy);
    if (length < 1) return;
    const perpX = -dy / length, perpY = dx / length;
    const points = [{ x: from.x, y: from.y }];
    for (let i = 1; i < segments; i++) { const t = i / segments; points.push({ x: from.x + dx * t + perpX * Phaser.Math.FloatBetween(-22, 22), y: from.y + dy * t + perpY * Phaser.Math.FloatBetween(-22, 22) }); }
    points.push({ x: to.x, y: to.y });
    graphics.lineStyle(14, 0x4466ff, 0.08); graphics.beginPath(); graphics.moveTo(points[0].x, points[0].y); points.forEach((p) => graphics.lineTo(p.x, p.y)); graphics.strokePath();
    graphics.lineStyle(1.8, 0xddeeff, 0.95); graphics.beginPath(); graphics.moveTo(points[0].x, points[0].y); points.forEach((p) => graphics.lineTo(p.x, p.y)); graphics.strokePath();
    [from, to].forEach((pt) => { graphics.fillStyle(0xffffff, 0.9); graphics.fillCircle(pt.x, pt.y, 4.5); });
  }
  clearChains() { this.activeChains.forEach((obj) => { if (obj?.active) obj.destroy(); }); this.activeChains = []; }
}

function createWeapon(scene, type) {
  switch (type) {
    case "machineGun":  return new MachineGunWeapon(scene);
    case "magicMissile":return new MagicMissileWeapon(scene);
    case "lightning":   return new LightningWeapon(scene);
    case "sword":       return new SwordWeapon(scene);
    case "laser":       return new LaserWeapon(scene);
    case "skull":       return new SkullWeapon(scene);
    case "lung":        return new LungWeapon(scene);
    case "scythe":      return new ScytheWeapon(scene);
    case "blackHole":   return new BlackHoleWeapon(scene);
    case "boomerang":   return new BoomerangWeapon(scene);
    case "chain":       return new ChainWeapon(scene);
    default: throw new Error(`Unknown weapon type: ${type}`);
  }
}

// ─── 피해 / 죽음 ──────────────────────────────────────────
function applyContactDamage(delta) {
  if (isDead || devMode) return;

  // 무적 체크
  if (pathManager && pathManager.isInvincible(gameSceneRef.time.now)) {
    player.setTint(0x88ffaa);
    return;
  }

  let touchingEnemy = false;
  enemies.getChildren().forEach((enemy) => {
    if (!enemy.active) return;
    if (Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y) < 38) {
      touchingEnemy = true;
    }
  });
  if (!touchingEnemy) return;

  const damage = CONTACT_DAMAGE_PER_SEC * (delta / 1000);
  playerHp -= damage;
  player.setTint(0xff8888);

  // 백경무예 발동
  if (pathManager && gameSceneRef.time.now > lastDamageTime + 80) {
    pathManager.onPlayerHit(gameSceneRef.time.now);
  }

  if (gameSceneRef.time.now > lastDamageTime + 80) {
    lastDamageTime = gameSceneRef.time.now;
    gameSceneRef.tweens.add({ targets: player, alpha: 0.55, duration: 60, yoyo: true });
    showBloodEffect.call(gameSceneRef, player.x, player.y);
  }

  if (playerHp <= 0) { playerHp = 0; killPlayer.call(gameSceneRef); }
}

function updateHealthBar() {
  const ratio = Phaser.Math.Clamp(playerHp / playerMaxHp, 0, 1);
  healthBarGreen.width = 180 * ratio;
  healthBarRed.width = 180 - 180 * ratio;
  healthBarRed.x = healthBarBg.x + 180 * ratio;
}

function killPlayer() {
  if (isDead) return;
  isDead = true;
  this.physics.pause();

  const deathTexts = ["YOU DIED", "MISSION FAILED", "ERASED", "THE NIGHT CONSUMED YOU"];
  const chosen = Phaser.Utils.Array.GetRandom(deathTexts);
  const surviveTime = Math.floor((this.time.now - gameStartTime) / 1000);

  const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.75)
    .setOrigin(0).setScrollFactor(0).setDepth(5000);
  this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, chosen, {
    fontSize: "52px", color: "#ff4444", fontStyle: "bold",
  }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);
  this.add.text(this.scale.width / 2, this.scale.height / 2 + 10, `생존 시간 ${surviveTime}초`, {
    fontSize: "24px", color: "#ffffff",
  }).setOrigin(0.5).setScrollFactor(0).setDepth(5001);

  const restartBtnBg = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 70, 180, 44, 0xff4444, 0.15)
    .setStrokeStyle(1.5, 0xff4444, 0.75).setScrollFactor(0).setDepth(5001)
    .setInteractive({ useHandCursor: true });
  const restartBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 70, "RESTART", {
    fontSize: "18px", color: "#ff4444", fontStyle: "bold", letterSpacing: 4,
  }).setOrigin(0.5).setScrollFactor(0).setDepth(5002).setInteractive({ useHandCursor: true });

  const doRestart = () => {
    isDead = false; exp = 0; level = 1; expToNextLevel = 5;
    playerHp = 100; playerMaxHp = 100;
    enemyMaxHp = 3; enemySpawnBonus = 0; enemySpawnRemainder = 0;
    playerVelocity.x = 0; playerVelocity.y = 0;
    this.scene.restart();
  };
  restartBtnBg.on("pointerdown", doRestart);
  restartBtnText.on("pointerdown", doRestart);
}

// ─── 시작 화면 ───────────────────────────────────────────
function showStartScreen() {
  this.physics.pause();
  spawnTimer.paused = true; enemyHealthTimer.paused = true; enemySpawnGrowthTimer.paused = true;
  isChoosingWeapon = true;

  const W = this.scale.width, H = this.scale.height, cx = W / 2, cy = H / 2;
  const objs = [];
  const bg = this.add.rectangle(0, 0, W, H, 0x000000, 0.88).setOrigin(0).setScrollFactor(0).setDepth(9000);
  const lineTop = this.add.rectangle(cx, cy - 112, 260, 1, 0x00ffd5, 0.35).setScrollFactor(0).setDepth(9001);
  const title1 = this.add.text(cx, cy - 88, "ABYSS", { fontSize: "64px", color: "#00ffd5", fontStyle: "bold", letterSpacing: 18 }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const title2 = this.add.text(cx, cy - 20, "WALKER", { fontSize: "38px", color: "#ffffff", fontStyle: "bold", letterSpacing: 22 }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const lineBot = this.add.rectangle(cx, cy + 18, 260, 1, 0x00ffd5, 0.35).setScrollFactor(0).setDepth(9001);
  const sub = this.add.text(cx, cy + 44, "어둠 속을 걸어라", { fontSize: "16px", color: "#7ecfc0", letterSpacing: 4 }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
  const btnBg = this.add.rectangle(cx, cy + 108, 200, 48, 0x00ffd5, 0.12).setStrokeStyle(1.5, 0x00ffd5, 0.75).setScrollFactor(0).setDepth(9002).setInteractive({ useHandCursor: true });
  const btnText = this.add.text(cx, cy + 108, "ENTER THE ABYSS", { fontSize: "15px", color: "#00ffd5", fontStyle: "bold", letterSpacing: 3 }).setOrigin(0.5).setScrollFactor(0).setDepth(9003).setInteractive({ useHandCursor: true });
  const hint = this.add.text(cx, cy + 164, "WASD / 조이스틱으로 이동", { fontSize: "12px", color: "#446060" }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);

  objs.push(bg, lineTop, title1, title2, lineBot, sub, btnBg, btnText, hint);
  this.tweens.add({ targets: [btnBg, btnText], alpha: { from: 0.6, to: 1 }, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  objs.forEach((obj, i) => { obj.setAlpha(0); this.tweens.add({ targets: obj, alpha: i === 1 || i === 4 ? 0.35 : 1, duration: 500, delay: i * 80 }); });

  const startGame = () => {
    objs.forEach((obj) => obj.destroy());
    this.physics.resume(); spawnTimer.paused = false; enemyHealthTimer.paused = false; enemySpawnGrowthTimer.paused = false;
    isChoosingWeapon = false; gameStartTime = this.time.now;

  };

btnBg.on("pointerdown", startGame); btnText.on("pointerdown", startGame);
}


function showBloodEffect(x, y) {
  const centerX = x, centerY = y + 20;
  const count = Phaser.Math.Between(14, 20);
  for (let i = 0; i < count; i++) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const size = Phaser.Math.FloatBetween(4, 9), dist = Phaser.Math.FloatBetween(25, 75);
    const colors = [0xff0000, 0xdd0000, 0xbb0011, 0x990000, 0xff1122];
    const drop = this.add.circle(centerX, centerY, size, colors[Phaser.Math.Between(0, 4)], 1.0).setDepth(60);
    this.tweens.add({ targets: drop, x: centerX + Math.cos(angle) * dist, y: centerY + Math.sin(angle) * dist, alpha: 0, scale: 0.15, duration: Phaser.Math.Between(200, 420), ease: "Cubic.easeOut", onComplete: () => drop.destroy() });
  }
  const splat1 = this.add.circle(centerX, centerY, 20, 0xcc0000, 0.7).setDepth(59);
  this.tweens.add({ targets: splat1, alpha: 0, scale: 2.2, duration: 350, ease: "Cubic.easeOut", onComplete: () => splat1.destroy() });
}

// ─── 개발자 콘솔 ─────────────────────────────────────────
function createDevConsole() {
  const input = document.createElement("input");
  input.type = "text"; input.placeholder = "...";
  input.style.cssText = `position:fixed;bottom:12px;right:12px;width:140px;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.08);font-size:12px;outline:none;z-index:99999;caret-color:rgba(255,255,255,0.3);`;
  document.body.appendChild(input);
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const val = input.value.trim(); input.value = ""; input.blur();
    if (val === "소드마스터") {
      devMode = !devMode;
      showDevNotice(devMode ? "⚔ DEV MODE ON" : "DEV MODE OFF", devMode ? "#00ffd5" : "#ff4444");
      if (devMode) createDevButton(); else { removeDevPanel(); removeDevButton(); }
    }
  });
}

function showDevNotice(msg, color) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:${color};font-size:28px;font-weight:bold;font-family:monospace;letter-spacing:4px;z-index:99999;pointer-events:none;text-shadow:0 0 20px ${color};transition:opacity 0.5s;`;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; }, 800);
  setTimeout(() => el.remove(), 1300);
}

function showDevPanel() {
  removeDevPanel();
  const panel = document.createElement("div");
  panel.id = "dev-panel";
  panel.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(10,14,26,0.97);border:1px solid #00ffd5;border-radius:10px;padding:20px 24px;z-index:99999;color:#fff;font-family:monospace;min-width:320px;box-shadow:0 0 30px rgba(0,255,213,0.15);max-height:85vh;overflow-y:auto;`;

  const title = document.createElement("div");
  title.textContent = "⚔ DEV MODE";
  title.style.cssText = "color:#00ffd5;font-size:16px;font-weight:bold;letter-spacing:3px;margin-bottom:16px;";
  panel.appendChild(title);

  WEAPON_TYPES.forEach((weapon) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:10px;";
    const label = document.createElement("span");
    label.textContent = weapon.name; label.style.cssText = "width:100px;font-size:13px;color:#b7f7ff;";
    const select = document.createElement("select");
    select.style.cssText = "background:#1a2030;border:1px solid #334;color:#fff;padding:3px 6px;border-radius:4px;font-size:12px;";
    const noneOpt = document.createElement("option"); noneOpt.value = "0"; noneOpt.textContent = "없음"; select.appendChild(noneOpt);
    for (let i = 1; i <= 5; i++) { const opt = document.createElement("option"); opt.value = String(i); opt.textContent = `Lv.${i}`; select.appendChild(opt); }
    const owned = weaponManager.getWeapon(weapon.id);
    select.value = owned ? String(owned.level) : "0";
    select.addEventListener("change", () => {
      const lv = parseInt(select.value);
      if (lv === 0) { weaponManager.weapons = weaponManager.weapons.filter((w) => w.type !== weapon.id); }
      else {
        const existing = weaponManager.getWeapon(weapon.id);
        if (existing) { existing.level = lv; }
        else if (weaponManager.weapons.length < weaponManager.maxWeapons) { weaponManager.addOrUpgrade(weapon.id); const added = weaponManager.getWeapon(weapon.id); if (added) added.level = lv; }
        else { showDevNotice("슬롯 가득참!", "#ff4444"); select.value = "0"; return; }
      }
      updateWeaponHud();
    });
    row.appendChild(label); row.appendChild(select); panel.appendChild(row);
  });

  // 길 섹션
  const pathTitle = document.createElement("div");
  pathTitle.textContent = "🐉 길 시스템";
  pathTitle.style.cssText = "color:#ffdd44;font-size:13px;font-weight:bold;letter-spacing:2px;margin-top:16px;border-top:1px solid #223;padding-top:12px;margin-bottom:10px;";
  panel.appendChild(pathTitle);

  // 길 선택
  const pathRow = document.createElement("div");
  pathRow.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:10px;";
  const pathLabel = document.createElement("span");
  pathLabel.textContent = "현재 길"; pathLabel.style.cssText = "width:80px;font-size:13px;color:#b7f7ff;";
  const pathSelect = document.createElement("select");
  pathSelect.style.cssText = "background:#1a2030;border:1px solid #334;color:#fff;padding:3px 6px;border-radius:4px;font-size:12px;";
  const noneOpt = document.createElement("option"); noneOpt.value = ""; noneOpt.textContent = "없음"; pathSelect.appendChild(noneOpt);
  Object.values(PATH_TYPES).forEach((p) => { const o = document.createElement("option"); o.value = p.id; o.textContent = p.name; if (pathManager.chosenPath === p.id) o.selected = true; pathSelect.appendChild(o); });
  pathSelect.addEventListener("change", () => { pathManager.chosenPath = pathSelect.value || null; updateWeaponHud(); });
  pathRow.appendChild(pathLabel); pathRow.appendChild(pathSelect); panel.appendChild(pathRow);

  // 스킬 토글
  Object.values(PATH_SKILLS).forEach((skill) => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:10px;margin-bottom:8px;";
    const label = document.createElement("span");
    label.textContent = `${skill.icon} ${skill.name}`; label.style.cssText = "width:120px;font-size:12px;color:#ffeeaa;";
    const btn = document.createElement("button");
    const has = pathManager.hasSkill(skill.id);
    btn.textContent = has ? "해제" : "획득";
    btn.style.cssText = `background:transparent;border:1px solid ${has ? "#ff4444" : "#00ffd5"};color:${has ? "#ff4444" : "#00ffd5"};padding:3px 10px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:12px;`;
    btn.addEventListener("click", () => {
      if (pathManager.hasSkill(skill.id)) { pathManager.acquiredSkills = pathManager.acquiredSkills.filter((s) => s !== skill.id); }
      else { pathManager.addSkill(skill.id); }
      updateWeaponHud(); removeDevPanel(); showDevPanel();
    });
    row.appendChild(label); row.appendChild(btn); panel.appendChild(row);
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "닫기";
  closeBtn.style.cssText = "margin-top:16px;width:100%;background:transparent;border:1px solid #00ffd5;color:#00ffd5;padding:6px;border-radius:4px;cursor:pointer;font-family:monospace;font-size:13px;letter-spacing:2px;";
  closeBtn.addEventListener("click", () => removeDevPanel());
  panel.appendChild(closeBtn);
  document.body.appendChild(panel);
  devPanelEl = panel;
}

function removeDevPanel() { if (devPanelEl) { devPanelEl.remove(); devPanelEl = null; } }
function createDevButton() {
  removeDevButton();
  const btn = document.createElement("button");
  btn.textContent = "⚔ DEV";
  btn.style.cssText = "position:fixed;top:12px;left:50%;transform:translateX(-50%);background:rgba(10,14,26,0.85);border:1px solid #00ffd5;color:#00ffd5;padding:6px 18px;border-radius:6px;cursor:pointer;font-family:monospace;font-size:13px;letter-spacing:3px;z-index:99999;";
  btn.addEventListener("click", () => { if (devPanelEl) removeDevPanel(); else showDevPanel(); });
  document.body.appendChild(btn); devBtnEl = btn;
}
function removeDevButton() { if (devBtnEl) { devBtnEl.remove(); devBtnEl = null; } }

// ─── 경고 텍스트 ──────────────────────────────────────────
function showWarningText() {
  const cx = this.scale.width / 2, cy = this.scale.height / 2;
  const warn = this.add.text(cx, cy, "⚠ 대규모 침공!", { fontSize: "38px", color: "#ff4444", fontStyle: "bold", shadow: { blur: 16, color: "#ff0000", fill: true } }).setOrigin(0.5).setScrollFactor(0).setDepth(4000);
  const sub = this.add.text(cx, cy + 52, "적의 수가 급증합니다", { fontSize: "18px", color: "#ffaaaa", letterSpacing: 3 }).setOrigin(0.5).setScrollFactor(0).setDepth(4000);
  this.tweens.add({ targets: warn, alpha: 0, scale: 1.15, y: cy - 30, duration: 1800, delay: 800, ease: "Cubic.easeIn", onComplete: () => warn.destroy() });
  this.tweens.add({ targets: sub, alpha: 0, duration: 1500, delay: 1000, onComplete: () => sub.destroy() });
}

// ─── 무한 배경 ───────────────────────────────────────────
function initInfiniteBackground() {
  const vignette = this.add.graphics().setScrollFactor(0).setDepth(5);
  const W = this.scale.width, H = this.scale.height;
  for (let i = 10; i > 0; i--) {
    const ratio = i / 10;
    vignette.fillStyle(0x000000, 0.06 * ratio);
    vignette.fillRect(W * (1 - ratio) * 0.5, H * (1 - ratio) * 0.5, W * ratio, H * ratio);
  }
  updateInfiniteBackground.call(this);
}

function updateInfiniteBackground() {
  const pcx = Math.floor(player.x / CHUNK_SIZE), pcy = Math.floor(player.y / CHUNK_SIZE);
  const needed = new Set();
  for (let cx = pcx - CHUNK_RENDER_RADIUS; cx <= pcx + CHUNK_RENDER_RADIUS; cx++) {
    for (let cy = pcy - CHUNK_RENDER_RADIUS; cy <= pcy + CHUNK_RENDER_RADIUS; cy++) {
      const key = `${cx},${cy}`; needed.add(key);
      if (!bgChunks.has(key)) bgChunks.set(key, createChunk.call(this, cx, cy));
    }
  }
  for (const [key, graphics] of bgChunks) {
    if (!needed.has(key)) { graphics.destroy(); bgChunks.delete(key); }
  }
}

function createChunk(cx, cy) {
  const tileSize = 64, tilesPerChunk = Math.ceil(CHUNK_SIZE / tileSize);
  const startX = cx * CHUNK_SIZE, startY = cy * CHUNK_SIZE;
  const seed = (cx * 73856093) ^ (cy * 19349663);
  const rand = mulberry32(seed);
  const g = this.add.graphics().setDepth(-10);

  for (let row = 0; row < tilesPerChunk; row++) {
    for (let col = 0; col < tilesPerChunk; col++) {
      const x = startX + col * tileSize, y = startY + row * tileSize;
      const globalCol = cx * tilesPerChunk + col, globalRow = cy * tilesPerChunk + row;
      const isDark = (globalRow + globalCol) % 2 === 0;
      g.fillStyle(isDark ? 0x0d1117 : 0x111820, 1); g.fillRect(x, y, tileSize, tileSize);
      g.lineStyle(1, 0x1a2535, 0.8); g.strokeRect(x, y, tileSize, tileSize);
      g.lineStyle(1, 0x1e2d40, 0.5); g.beginPath(); g.moveTo(x + 1, y + tileSize - 1); g.lineTo(x + 1, y + 1); g.lineTo(x + tileSize - 1, y + 1); g.strokePath();
      g.lineStyle(1, 0x080c10, 0.6); g.beginPath(); g.moveTo(x + tileSize - 1, y + 1); g.lineTo(x + tileSize - 1, y + tileSize - 1); g.lineTo(x + 1, y + tileSize - 1); g.strokePath();
      if (rand() < 0.10) {
        g.lineStyle(1, 0x060a0e, 0.9);
        const crackX = x + 10 + Math.floor(rand() * (tileSize - 20)), crackY = y + 10 + Math.floor(rand() * (tileSize - 20));
        const crackAngle = rand() * Math.PI, crackLen = 8 + Math.floor(rand() * 14);
        g.beginPath(); g.moveTo(crackX, crackY); g.lineTo(crackX + Math.cos(crackAngle) * crackLen, crackY + Math.sin(crackAngle) * crackLen); g.strokePath();
      }
      if (rand() < 0.05) { g.fillStyle(0x0a1a0f, 0.55); g.fillEllipse(x + 12 + Math.floor(rand() * (tileSize - 24)), y + 12 + Math.floor(rand() * (tileSize - 24)), 10 + Math.floor(rand() * 14), 6 + Math.floor(rand() * 10)); }
    }
  }

  const lightCount = Math.floor(rand() * 3);
  for (let i = 0; i < lightCount; i++) {
    const lx = startX + Math.floor(rand() * CHUNK_SIZE), ly = startY + Math.floor(rand() * CHUNK_SIZE);
    const color = rand() < 0.7 ? 0xff8833 : 0x3399ff, radius = 90 + Math.floor(rand() * 90);
    [0.04, 0.07, 0.11].forEach((alpha, j) => { g.fillStyle(color, alpha); g.fillCircle(lx, ly, radius * (1 - j * 0.28)); });
  }
  return g;
}

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function easeSwing(t) {
  if (t < 0.2) return 0.5 * Math.pow(t / 0.2, 2) * 0.15;
  else if (t < 0.75) return 0.15 + ((t - 0.2) / 0.55) * 0.72;
  else return 0.87 + (1 - Math.pow(1 - (t - 0.75) / 0.25, 2)) * 0.13;

}