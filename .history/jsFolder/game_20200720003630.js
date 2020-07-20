const GAME_WIDTH = 800;
const GAME_HEIGHT = 700;

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

// needed to calculate clamp so player an enemies so no move off screen.
const PLAYER_WIDTH = 5;
// ship movement speed
const PLAYER_MAX_SPEED = 500.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 0.5;

// contains entire state of game which included position of player, lasers and enemies on screen.
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
};

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

function updatePlayer(dt) {
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

  const $player = document.querySelector(".player");
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function createLaser($container, x, y) {
  const $element = document.createElement("img");
  $element.src = "/jsFolder/pictures/img/laser-blue-1.png";
  $element.className = "laser";
  $container.appendChild($element);
  const laser = { x, y, $element };
  GAME_STATE.lasers.push(laser);
  const audio = new Audio("./pictures/sound/sfx-laser1.ogg");
  audio.play();
  setPosition($element, x, y);
}

function updateLasers(dt, $container) {
  const lasers = GAME_STATE.lasers;
  for (let i = 0; i < lasers.length; i++) {
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;
    setPosition(laser.$element, laser.x, laser.y);
  }
}
// initializes players and function of the game
function init() {
  const $container = document.querySelector(".Game");
  createPlayer($container);
}

// game loop runs every frame all the time and makes sure everything runs smoothly makes sure that all elements that have to move actually move it.
function update(e) {
  const currentTime = Date.now();
  const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;

  updatePlayer(dt);
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

// function onKeyDown(e) {
//   console.log(e);
// }

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);
