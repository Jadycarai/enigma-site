const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const endScreen = document.getElementById('end-screen');
const endText = document.getElementById('end-text');
const restartButton = document.getElementById('restart-button');
const gameOverSound = document.getElementById('game-over-sound');

canvas.width = 600;
canvas.height = 400;

let gameRunning = false;
let player = { x: 50, y: 50, size: 20, speed: 3 };
let shadow = { x: 550, y: 350, size: 20, speed: 2 };
let keys = {};
let dots = [];
let dotsCollected = 0;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tileSize = 40;

function createDots() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 0) {
                dots.push({ x: col * tileSize + tileSize / 2 - 5, y: row * tileSize + tileSize / 2 - 5, size: 10 });
            }
        }
    }
}

function startGame() {
    gameRunning = true;
    endScreen.style.display = 'none';
    player.x = 50;
    player.y = 50;
    shadow.x = 550;
    shadow.y = 350;
    dots = [];
    dotsCollected = 0;
    createDots();
    requestAnimationFrame(updateGame);
}

function endGame(message, win) {
    gameRunning = false;
    if (!win) {
        gameOverSound.play();
    }
    endText.textContent = message;
    endScreen.style.display = 'flex';
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMaze();

    // Movimenta o jogador
    movePlayer();

    // Movimenta a sombra na direção do jogador
    moveShadow();

    // Desenha o jogador
    ctx.fillStyle = 'yellow';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Desenha a sombra
    ctx.fillStyle = 'gray';
    ctx.fillRect(shadow.x, shadow.y, shadow.size, shadow.size);

    // Desenha as bolinhas
    drawDots();

    // Checa colisão com bolinhas
    checkDotCollision();

    // Checa colisão com a sombra
    if (player.x < shadow.x + shadow.size &&
        player.x + player.size > shadow.x &&
        player.y < shadow.y + shadow.size &&
        player.y + player.size > shadow.y) {
        endGame('Game Over', false);
    } else if (dotsCollected === dots.length) {
        // Se o jogador coletou todas as bolinhas
        endGame('Boa noite cidadão, alalalalalalalall', true);
    } else {
        requestAnimationFrame(updateGame);
    }
}

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

function movePlayer() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys.ArrowUp) nextY -= player.speed;
    if (keys.ArrowDown) nextY += player.speed;
    if (keys.ArrowLeft) nextX -= player.speed;
    if (keys.ArrowRight) nextX += player.speed;

    if (!isCollision(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }
}

function moveShadow() {
    if (shadow.x < player.x && !isCollision(shadow.x + shadow.speed, shadow.y)) shadow.x += shadow.speed;
    if (shadow.x > player.x && !isCollision(shadow.x - shadow.speed, shadow.y)) shadow.x -= shadow.speed;
    if (shadow.y < player.y &&
