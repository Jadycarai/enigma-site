const startButton = document.getElementById('start-button');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const endScreen = document.getElementById('end-screen');
const endText = document.getElementById('end-text');

let gameRunning = false;
let playerX = 100;
let playerY = 100;
let playerSize = 20;
let velocity = 2;

canvas.width = 400;
canvas.height = 400;

startButton.addEventListener('click', startGame);

function startGame() {
    gameRunning = true;
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    requestAnimationFrame(updateGame);
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Movimenta o jogador
    if (playerX + playerSize > canvas.width || playerX < 0) {
        gameOver();
        return;
    }

    playerX += velocity;
    
    // Desenha o jogador
    ctx.fillStyle = '#fff';
    ctx.fillRect(playerX, playerY, playerSize, playerSize);

    // Aumenta a velocidade do jogo
    velocity += 0.01;

    requestAnimationFrame(updateGame);
}

function gameOver() {
    gameRunning = false;
    canvas.style.display = 'none';
    endScreen.style.display = 'block';

    if (playerX >= canvas.width) {
        // Jogador ganhou
        endText.innerHTML = '<p>TExte numero um, catorrteze vezes mamão</p>';
    } else {
        // Jogador perdeu
        endText.textContent = 'Game Over';
    }
}
