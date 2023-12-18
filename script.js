const gameArea = document.getElementById('gameArea')
const introScreen = document.getElementById('introScreen')
const leftPaddle = document.getElementById('playerPaddleLeft')
const rightPaddle = document.getElementById('playerPaddleRight')
const ball = document.getElementById('ball')
const leftScoreBoard = document.getElementById('leftScore')
const rightScoreBoard = document.getElementById('rightScore')
const startGameButton = document.getElementById('startGame')
const playAgainButton = document.getElementById('playAgain')
const victoryScreen = document.getElementById('victoryScreen')
const victoryMessage = document.getElementById('victoryMessage')

let gameInterval
let leftScore = 0, rightScore = 0
let ballSpeedX = 3, ballSpeedY = 3
let leftPaddleSpeed = 0, rightPaddleSpeed = 0

function startGame() {
    introScreen.style.display = 'none'
    resetGame()
    gameInterval = setInterval(gameLoop, 10)
    startGameButton.style.display = 'none'
}

function gameLoop() {
    moveBall()
    movePaddles()
    updateScore()
    checkGameOver()
}

function moveBall() {
    let ballRect = ball.getBoundingClientRect()
    let gameRect = gameArea.getBoundingClientRect()
    let leftPaddleRect = leftPaddle.getBoundingClientRect()
    let rightPaddleRect = rightPaddle.getBoundingClientRect()

    ballSpeedX *= 1.0002
    ballSpeedY *= 1.0002

    let newLeft = ballRect.left - gameRect.left + ballSpeedX
    let newTop = ballRect.top - gameRect.top + ballSpeedY

    if (newTop <= 0 || newTop + ballRect.height >= gameRect.height)
        ballSpeedY *= -1

    if (ballSpeedX < 0 && ballRect.left <= leftPaddleRect.right && ballRect.right >= leftPaddleRect.left && ballRect.bottom >= leftPaddleRect.top && ballRect.top <= leftPaddleRect.bottom) 
        ballSpeedX *= -1

    if (ballSpeedX > 0 && ballRect.right >= rightPaddleRect.left && ballRect.left <= rightPaddleRect.right && ballRect.bottom >= rightPaddleRect.top && ballRect.top <= rightPaddleRect.bottom) 
        ballSpeedX *= -1
    
    ball.style.left = newLeft + 'px'
    ball.style.top = newTop + 'px'

    if (newLeft + ballRect.width <= 0 || newLeft >= gameRect.width) {
        if (newLeft + ballRect.width <= 0)
            rightScore++
        else
            leftScore++

        resetBall()
    }

}

function movePaddles() {
    let leftRect = leftPaddle.getBoundingClientRect()
    let rightRect = rightPaddle.getBoundingClientRect()
    let gameRect = gameArea.getBoundingClientRect()

    leftPaddle.style.top = Math.min(gameRect.height - leftRect.height, Math.max(0, leftRect.top - gameRect.top + leftPaddleSpeed)) + 'px'
    rightPaddle.style.top = Math.min(gameRect.height - rightRect.height, Math.max(0, rightRect.top - gameRect.top + rightPaddleSpeed)) + 'px'
}

function updateScore() {
    leftScoreBoard.textContent = leftScore
    rightScoreBoard.textContent = rightScore
}

function resetGame() {
    resetBall()
    leftScore = 0
    rightScore = 0
    updateScore()
}

function resetBall() {
    const ballDiameter = 20

    const gameAreaCenterX = gameArea.clientWidth / 2
    const gameAreaCenterY = gameArea.clientHeight / 2

    ball.style.left = (gameAreaCenterX - ballDiameter / 2) + 'px'
    ball.style.top = (gameAreaCenterY - ballDiameter / 2) + 'px'

    ballSpeedX = Math.random() > 0.5 ? 3 : -3
    ballSpeedY = Math.random() > 0.5 ? 3 : -3   
}

function displayVictory(winner) {
    victoryMessage.textContent = winner + " Venceu!"
    victoryScreen.style.display = 'flex'

    playAgainButton.onclick = function() {
        victoryScreen.style.display = 'none'
        resetGame()
    }
}

function checkGameOver() {
    if (leftScore >= 5 || rightScore >= 5) {
        clearInterval(gameInterval)

        let winner = leftScore >= 5 ? 'Jogador 1' : 'Jogador 2'
        
        displayVictory(winner)
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'w') 
        leftPaddleSpeed = -5
    if (e.key === 's') 
        leftPaddleSpeed = 5
    if (e.key === 'ArrowUp') 
        rightPaddleSpeed = -5
    if (e.key === 'ArrowDown') 
        rightPaddleSpeed = 5
})

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's') 
        leftPaddleSpeed = 0
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') 
        rightPaddleSpeed = 0
})

startGameButton.addEventListener('click', startGame)
playAgainButton.addEventListener('click', startGame)
