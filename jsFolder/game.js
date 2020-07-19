const GAME_WIDTH = 800;
const GAME_HEIGHT = 700;

const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

// contains entire state of game which included position of player and enemies.
const GAME_STATE = {
  playerX: 0,
  playerY: 0,
};

function setPosition($el, x, y) {
  $el.style.transform = `translate(${x}px, ${y}px)`;
}

function createPlayer($container) {
  GAME_STATE.playerX = GAME_WIDTH / 2;
  GAME_STATE.playerY = GAME_HEIGHT - 50;
  const $player = document.createElement("img");
  $player.src = "img/player-blue-1.png";
  $player.className = "player";
  $container.appendChild($player);
  setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

// initializes players and function of the game
function init() {
  const $container = document.querySelector(".game");
  createPlayer($container);
}

init();
window.addEventListener("keydown", onKeyDown);
