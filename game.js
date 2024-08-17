const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const endScreen = document.getElementById('end-screen');
const endText = document.getElementById('end-text');
const restartButton = document.getElementById('restart-button');

canvas.width = 400;
canvas.height = 400;

let gameRunning = false;
let player = { x: 50, y: 50, size: 20, speed: 3 };
let shadow = { x: 350, y: 350, size: 20, speed: 2 };
let keys = {};

function startGame() {
    gameRunning = true;
    endScreen.style.display = 'none';
    player.x = 50;
    player.y = 50;
    shadow.x = 350;
    shadow.y = 350;
    requestAnimationFrame(updateGame);
}

function endGame(message) {
    gameRunning = false;
    endText.textContent = message;
    endScreen.style.display = 'flex';
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movimenta o jogador
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.size < canvas.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x + player.size < canvas.width) player.x += player.speed;

    // Movimenta a sombra na direção do jogador
    if (shadow.x < player.x) shadow.x += shadow.speed;
    if (shadow.x > player.x) shadow.x -= shadow.speed;
    if (shadow.y < player.y) shadow.y += shadow.speed;
    if (shadow.y > player.y) shadow.y -= shadow.speed;

    // Desenha o jogador
    ctx.fillStyle = 'yellow';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Desenha a sombra
    ctx.fillStyle = 'gray';
    ctx.fillRect(shadow.x, shadow.y, shadow.size, shadow.size);

    // Checa colisão
    if (player.x < shadow.x + shadow.size &&
        player.x + player.size > shadow.x &&
        player.y < shadow.y + shadow.size &&
        player.y + player.size > shadow.y) {
        endGame('Game Over');
    } else {
        requestAnimationFrame(updateGame);
    }
}

function handleKeydown(event) {
    keys[event.key] = true;
}

function handleKeyup(event) {
    keys[event.key] = false;
}

document.addEventListener('keydown', handleKeydown);
document.addEventListener('keyup', handleKeyup);
restartButton.addEventListener('click', startGame);

startGame();
