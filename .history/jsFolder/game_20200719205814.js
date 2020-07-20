const GAME_WIDTH = 900;
const GAME_HEIGHT = 700;

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

// contains entire state of game which included position of player, lasers and enemies on screen.
const GAME_STATE = {
  playerX: 0,
  playerY: 0,
};

// positioning for our enemies

function setPosition($el, x, y) {
  $el.style.transform = `translate(${x}px, ${y}px)`;
}

function createPlayer($container) {
  // position of player in middle of screen you can reference the global var of gamewidth like you did below, for future refrence. this will keep the palyer on the game board.
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 50;
  const $player = document.createElement("img");
  $player.src = "/jsFolder/pictures/MathApics/spaceship/spaceship.png";
  $player.style = "height:90px, width: 90px";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// initializes players and function of the game
function init() {
  const $container = document.querySelector(".Game");
  createPlayer($container);
}

init();
window.addEventListener("keydown", onKeyDown);
