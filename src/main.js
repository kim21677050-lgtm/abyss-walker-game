import Phaser from "phaser";

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
let lastShot = 0;
let expOrbs;
let exp = 0;
let level = 1;
let expToNextLevel = 5;

const playerVelocity = {
  x: 0,
  y: 0,
};

function preload() {}

function create() {
  // 월드 크기
  this.physics.world.setBounds(-3000, -3000, 6000, 6000);

  // 플레이어
  player = this.add.rectangle(640, 360, 40, 40, 0xffffff);
  this.physics.add.existing(player);

  player.body.setDrag(800);
  player.body.setMaxVelocity(400);

  // 적 그룹
  enemies = this.physics.add.group();

  // 시작 적
  for (let i = 0; i < 25; i++) {
    spawnEnemy.call(this);
  }

  // 적 계속 생성
  this.time.addEvent({
    delay: 800,
    callback: () => {
      spawnEnemy.call(this);
    },
    loop: true,
  });

  // 총알
  bullets = this.physics.add.group();

  // 경험치 구슬
expOrbs = this.physics.add.group();

  // 충돌
  this.physics.add.overlap(
    bullets,
    enemies,
    (bullet, enemy) => {
      bullet.destroy();

      enemy.hp--;

      if (enemy.hp <= 0) {

  const orb = this.add.circle(
    enemy.x,
    enemy.y,
    8,
    0x00aaff
  );

  this.physics.add.existing(orb);
  expOrbs.add(orb);

  enemy.destroy();
}
    }
  );

  // 카메라
  this.cameras.main.startFollow(player, true, 0.08, 0.08);
  this.cameras.main.setZoom(0.8);

  // 키
  cursors = this.input.keyboard.addKeys({
    up: "W",
    down: "S",
    left: "A",
    right: "D",
  });

  // 경험치 흡수
this.physics.add.overlap(
  player,
  expOrbs,
  (player, orb) => {
    orb.destroy();

    exp++;

    console.log(
      `EXP: ${exp}/${expToNextLevel}`
    );

    if (exp >= expToNextLevel) {
  level++;

  console.log(
    `LEVEL UP! Lv.${level}`
  );

  alert(`레벨업! Lv.${level}`);

  exp = 0;
  expToNextLevel += 3;
}
  }
);
}

function update(time) {
  const acceleration = 40;
  const maxSpeed = 350;

  // 관성 이동
  if (cursors.left.isDown) {
    playerVelocity.x -= acceleration;
  }

  if (cursors.right.isDown) {
    playerVelocity.x += acceleration;
  }

  if (cursors.up.isDown) {
    playerVelocity.y -= acceleration;
  }

  if (cursors.down.isDown) {
    playerVelocity.y += acceleration;
  }

  // 감속
  playerVelocity.x *= 0.9;
  playerVelocity.y *= 0.9;

  // 최대 속도 제한
  playerVelocity.x = Phaser.Math.Clamp(
    playerVelocity.x,
    -maxSpeed,
    maxSpeed
  );

  playerVelocity.y = Phaser.Math.Clamp(
    playerVelocity.y,
    -maxSpeed,
    maxSpeed
  );

  player.body.setVelocity(
    playerVelocity.x,
    playerVelocity.y
  );

  // 적 추적 (더 빠름)
  enemies.getChildren().forEach((enemy) => {
    this.physics.moveToObject(enemy, player, 180);
  });

  // 자동 공격
  if (time > lastShot + 400) {
    shootBullet.call(this);
    lastShot = time;
  }

  // 경험치 구슬 끌어당김
expOrbs.getChildren().forEach((orb) => {
  const distance =
    Phaser.Math.Distance.Between(
      player.x,
      player.y,
      orb.x,
      orb.y
    );

  if (distance < 150) {
    this.physics.moveToObject(
      orb,
      player,
      250
    );
  }
});

}

function spawnEnemy() {
  const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  const distance = 1200;

  const x = player.x + Math.cos(angle) * distance;
  const y = player.y + Math.sin(angle) * distance;

  const enemy = this.add.circle(
    x,
    y,
    20,
    0xff0000
  );

  this.physics.add.existing(enemy);

  enemy.hp = 3;

  enemies.add(enemy);
}

function shootBullet() {
  const nearestEnemy = findNearestEnemy();

  if (!nearestEnemy) return;

  const bullet = this.add.circle(
    player.x,
    player.y,
    8,
    0xffff00
  );

  this.physics.add.existing(bullet);
  bullets.add(bullet);

  this.physics.moveToObject(
    bullet,
    nearestEnemy,
    600
  );
}

function findNearestEnemy() {
  let nearest = null;
  let shortestDistance = Infinity;

  enemies.getChildren().forEach((enemy) => {
    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      enemy.x,
      enemy.y
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = enemy;
    }
  });

  return nearest;
}