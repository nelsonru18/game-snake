// HTML elementos
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameOverSign = document.getElementById("gameOver");

// Ajustes del juego
const boardSize = 10;
const gameSpeed = 300;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};

const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 }
};

// Variables del juego
let snake;
let score;
let direction;
let boardSquares;
let emptySquares = [];
let moveInterval;
let paused = false; // Variable para controlar el estado de pausa del juego

const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}

const drawSquare = (square, type) => {
    const [row, column] = square.split(' ').map(Number);
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    }
};

const createBoard = () => {
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    board.innerHTML = "";
    emptySquares = [];
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const squareValue = `${row} ${col}`;
            const squareElement = document.createElement("div");
            squareElement.setAttribute("class", "square emptySquare");
            squareElement.setAttribute("id", squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        }
    }
};

const moveSnake = () => {
    if (paused) return; // Si el juego está pausado, salir de la función sin mover la serpiente

    const head = snake[snake.length - 1];
    const [row, column] = head.split(' ').map(Number);
    const dir = directions[direction];
    const newRow = row + dir.y;
    const newColumn = column + dir.x;

    // Verificar si la nueva posición de la cabeza está dentro del tablero
    if (newRow < 0 || newRow >= boardSize || newColumn < 0 || newColumn >= boardSize) {
        gameOver();
        return;
    }

    const newSquare = `${newRow} ${newColumn}`;

    if (boardSquares[newRow][newColumn] === squareTypes.wall) {
        gameOver();
        return;
    }

    if (boardSquares[newRow][newColumn] === squareTypes.snakeSquare) {
        gameOver();
        return;
    }

    snake.push(newSquare);

    if (boardSquares[newRow][newColumn] !== squareTypes.foodSquare) {
        const tail = snake.shift();
        drawSquare(tail, 'emptySquare');
    } else {
        addFood();
    }

    drawSnake();
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval);
    startButton.disabled = false;
    stopButton.disabled = true; // Deshabilitar el botón Stop
    // Limpiar variables y configuraciones
    snake = [];
    score = 0;
    direction = null;
    boardSquares = [];
    emptySquares = [];
    paused = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    const newDirection = key.code;
    if (directions[newDirection]) {
        const oppositeDirection = { ArrowUp: 'ArrowDown', ArrowDown: 'ArrowUp', ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' };
        if (direction !== oppositeDirection[newDirection]) {
            setDirection(newDirection);
        }
    }
};

const createRandomFood = () => {
    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const randomSquare = emptySquares[randomIndex];
    drawSquare(randomSquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const setGame = () => {
    snake = ["0 0", "0 1", "0 2", "0 3"];
    score = snake.length;
    direction = "ArrowRight";
    createBoard();
    drawSnake();
    updateScore();
};

const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    stopButton.disabled = false; // Habilitar el botón Stop
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(moveSnake, gameSpeed);
};

const toggleGame = () => {
    if (paused) {
        clearInterval(moveInterval); // Pausar el intervalo de movimiento
        paused = false; // Actualizar el estado a no pausado
        stopButton.innerText = "Stop"; // Cambiar el texto del botón a "Stop"
    } else {
        moveInterval = setInterval(moveSnake, gameSpeed); // Reanudar el intervalo de movimiento
        paused = true; // Actualizar el estado a pausado
        stopButton.innerText = "Resume"; // Cambiar el texto del botón a "Resume"
    }
};

stopButton.addEventListener("click", toggleGame); // Agregar evento al botón Stop

startButton.addEventListener("click", startGame);




