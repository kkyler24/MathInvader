const GAME_WIDTH = 800;
const GAME_HEIGHT = 700;

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;
const POINT_VALUE = 0;
// needed to calculate clamp so player an enemies so no move off screen.
const PLAYER_WIDTH = 5;
// ship movement speed
const PLAYER_MAX_SPEED = 500.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 0.5;

const TOKENS_PER_ROW = 10;
const ENEMIES_PER_ROW = 3;
const ENEMY_HORIZONTAL_PADDING = 30;
const ENEMY_VERTICAL_PADDING = 20;
const ENEMY_VERTICAL_SPACING = 40;
const ENEMY_COOLDOWN = 5.0;
// contains entire state of game which included position of player, lasers and enemies on screen.
const tokensArray = [
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/one.png",
    point: 1,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/two.png",
    point: 2,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/three.png",
    point: 3,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/four.png",
    point: 4,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/five.png",
    point: 5,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/six.png",
    point: 6,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/seven.png",
    point: 7,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/eight.png",
    point: 8,
  },
  {
    url: "/jsFolder/pictures/MathApics/invaders_png/nine.png",
    point: 9,
  },
];

const GAME_STATE = {
  lastTime: Date.now(),
  // setting the keys pressed to false
  leftPressed: false,
  rightPressed: false,
  spacePressed: false,
  // players
  playerX: 0,
  playerY: 0,
  playerCooldown: 0,
  lasers: [],
  enemies: [],
  tokens: [],
  pointvalue: [],
  enemyLasers: [],
  gameOver: false,
};

function rectsIntersect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

// positioning for our enemies
function setPosition($el, x, y) {
  $el.style.transform = `translate(${x}px, ${y}px)`;
}

// calculates restraints of objects on Canvas, so they do not move beyond canvas
function clamp(v, min, max) {
  // is input value smaller than minumum, yes? return min
  if (v < min) {
    return min;
    // is input value larger than maximum, yes? return max
  } else if (v > max) {
    return max;
    // else give average
  } else {
    return v;
  }
}

function rand(min, max) {
  if (min === undefined) min = 0;
  if (max === undefined) max = 1;
  return min + Math.random() * (max - min);
}

function createPlayer($container) {
  // position of player in middle of screen you can reference the global var of gamewidth like you did below, for future refrence. this will keep the palyer on the game board.
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 70;
  const $player = document.createElement("img");
  $player.src = "/jsFolder/pictures/MathApics/spaceship/spaceship3.png";
  $player.style = "height:90px, width: 90px";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// you lose, when player is hit but laser.
function destroyPlayer($container, player) {
  $container.removeChild(player);
  GAME_STATE.gameOver = true;
  // const audio = new Audio("sound/sfx-lose.ogg");
  audio.play();
}

function updatePlayer(dt, $container) {
  if (GAME_STATE.leftPressed) {
    GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
  }
  if (GAME_STATE.rightPressed) {
    GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
  }

  GAME_STATE.playerX = clamp(
    GAME_STATE.playerX,
    PLAYER_WIDTH,
    GAME_WIDTH - PLAYER_WIDTH
  );

  if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
    createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
    GAME_STATE.playerCooldown = LASER_COOLDOWN;
  }
  if (GAME_STATE.playerCooldown > 0) {
    GAME_STATE.playerCooldown -= dt;
  }

  const player = document.querySelector(".player");
  setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// laser container
function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "/jsFolder/pictures/img/laser-blue-1.png";
  $element.className = "laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.lasers.push(laser);
  // const audio = new Audio("./pictures/sound/sfx-laser1.ogg");
  // audio.play();
  setPosition($element, x, y);
}

function updateLasers(dt, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;
    if (laser.y < 0) {
      destroyLaser($container, laser);
    }
    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const enemies = GAME_STATE.enemies;
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
      if (enemy.isDead) continue;
      const r2 = enemy.$element.getBoundingClientRect();
      if (rectsIntersect(r1, r2)) {
        // Enemy was hit
        destroyEnemy($container, enemy);
        destroyLaser($container, laser);
        break;
      }
    }
  }
  GAME_STATE.lasers = GAME_STATE.lasers.filter((e) => !e.isDead);
}

function destroyLaser($container, laser) {
  $container.removeChild(laser.$element);
  laser.isDead = true;
}

// // CREATE ENEMY
function createEnemy($container, x, y) {
  const $element1 = document.createElement("img");
  const $element2 = document.createElement("img");
  $element1.src =
    "/jsFolder/pictures/MathApics/invaders_png/angerangryalien1.png";
  $element2.src = "/jsFolder/pictures/MathApics/invaders_png/orange.png";
  $element1.className = "enemy";
  $element2.className = "enemy";
  $container.appendChild($element1);
  $container.appendChild($element2);
  const enemy = {
    x,
    y,
    cooldown: rand(0.5, ENEMY_COOLDOWN),
    $element1,
    $element2,
  };
  GAME_STATE.enemies.push(enemy);
  setPosition($element1, x, y);
  setPosition($element2, x, y);
}

function updateEnemies(dt, $container) {
  const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
  const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

  const enemies = GAME_STATE.enemies;
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const x = enemy.x + dx;
    const y = enemy.y + dy;
    setPosition(enemy.$element, x, y);
    enemy.cooldown -= dt;
    if (enemy.cooldown <= 0) {
      createEnemyLaser($container, x, y);
      enemy.cooldown = ENEMY_COOLDOWN;
    }
  }
  GAME_STATE.enemies = GAME_STATE.enemies.filter((e) => !e.isDead);
}

// tokens
// function createTokens($container, x, y) {
//   const $element = document.createElement("img");
//   const index = Math.random() * tokensArray.lenghth;
//   $element.src = tokensArray[index].url;
//   $element.className = "token";
//   $element.setAttribute("data-point", tokensArray[index].point);
//   $container.appendChild($element);
//   const tokens = { x, y, $element };
//   GAME_STATE.tokens.push(tokens);
//   // const audio = new Audio("./pictures/sound/sfx-laser1.ogg");
//   // audio.play();
//   setPosition($element, x, y);
// }

// function updateTokens(dt, $container) {
//   const tokens = GAME_STATE.tokens;
//   for (let i = 0; i < tokensArray.length; i++) {
//     const tokens = tokens[i];
//     tokens.y -= dt * LASER_MAX_SPEED;
//     if (tokens.y < 0) {
//       destroyLaser($container, tokens);
//     }
//     setPosition(tokens.$element, tokens.x, tokens.y);
//     const r1 = tokens.$element.getBoundingClientRect();
//     const enemies = GAME_STATE.enemies;
//     for (let j = 0; j < enemies.length; j++) {
//       const enemy = enemies[j];
//       if (enemy.isDead) continue;
//       const r2 = enemy.$element.getBoundingClientRect();
//       if (rectsIntersect(r1, r2)) {
//         // Enemy was hit
//         destroyToken($container, tokens);
//         // get attribute point form container nd push into array.
//       }
//     }
//   }
//   GAME_STATE.tokens = GAME_STATE.tokens.filter((e) => !e.isDead);
// }

function init() {
  const $container = document.querySelector(".Game");
  createPlayer($container);

  const enemySpacing =
    (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 90) / ENEMIES_PER_ROW - 0.5;
  for (let j = 0; j < 3; j++) {
    const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
    for (let i = 0; i < ENEMIES_PER_ROW; i++) {
      const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
      createEnemy($container, x, y);
    }
  }
}

function update(e) {
  const currentTime = Date.now();
  const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;

  // display gameover block
  if (GAME_STATE.gameOver) {
    document.querySelector(".game-over").style.display = "block";
    return;
  }

  // display winning
  function playerHasWon() {
    return GAME_STATE.enemies.length === 0;
  }

  const $container = document.querySelector(".Game");
  updatePlayer(dt, $container);
  updateLasers(dt, $container);

  GAME_STATE.lastTime = currentTime;
  window.requestAnimationFrame(update);
}

function onKeyDown(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = true;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = true;
  }
}

function onKeyUp(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = false;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = false;
  } else if (e.keyCode === KEY_CODE_SPACE) {
    GAME_STATE.spacePressed = false;
  }
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);
