// Prueba

// Obtener referencia al tablero de juego
const gameBoard = document.getElementById('game-board');

// Función para dibujar el tablero de juego
function drawBoard(snake, food) {
  // Limpiar el tablero
  gameBoard.innerHTML = '';

  // Dibujar la serpiente
  snake.body.forEach(segment => {
    const snakeSegment = createSegment(segment.x, segment.y);
    snakeSegment.classList.add('snake');
    snakeSegment.style.backgroundColor = snake.color; // Establecer el color de la serpiente
    gameBoard.appendChild(snakeSegment);
  });

  // Dibujar la comida
  const foodSegment = createSegment(food.x, food.y);
  foodSegment.classList.add('food');
  gameBoard.appendChild(foodSegment);
}

// Función para crear un segmento en el tablero
function createSegment(x, y) {
  const segment = document.createElement('div');
  segment.className = 'cell';
  segment.style.left = x * 20 + 'px';
  segment.style.top = y * 20 + 'px';
  return segment;
}

// Función principal para iniciar el juego
function startGame() {
  const snakeType = prompt("Elige el tipo de serpiente ('green' o 'blue'): ");
  const snake = chooseSnake(snakeType);
  let food = Food.create();

  // Dibujar el tablero inicial
  drawBoard(snake, food);

// Bucle de juego
const gameLoop = setInterval(() => {
    snake.move();
  
    // Verificar si la serpiente come la comida
    if (snake.checkCollision(food)) {
      snake.grow();
      food = Food.create(); // Generar nueva comida con un tipo aleatorio
    }
  
    // Verificar si la serpiente choca con el borde o consigo misma
    if (
      snake.body[0].x < 0 || 
      snake.body[0].x >= 20 || 
      snake.body[0].y < 0 || 
      snake.body[0].y >= 20 ||
      snake.body.slice(1).some(segment => segment.x === snake.body[0].x && segment.y === snake.body[0].y)
    ) {
      clearInterval(gameLoop); // Detener el bucle de juego
      alert('¡Game Over! La serpiente chocó consigo misma o con el borde.'); // Mostrar mensaje de fin de partida
      return;
    }
  
    // Dibujar el tablero actualizado
    drawBoard(snake, food);
  }, 200); // Velocidad del juego en milisegundos
  

  // Control de la dirección de la serpiente mediante el teclado
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') {
      snake.changeDirection('up');
    } else if (key === 'arrowdown' || key === 's') {
      snake.changeDirection('down');
    } else if (key === 'arrowleft' || key === 'a') {
      snake.changeDirection('left');
    } else if (key === 'arrowright' || key === 'd') {
      snake.changeDirection('right');
    }
  });
}

// Función para elegir el tipo de serpiente
function chooseSnake(snakeType) {
  let snake;
  switch (snakeType) {
    case 'green':
      snake = new ColoredSnake('green');
      break;
    case 'blue':
      snake = new ColoredSnake('blue');
      break;
    default:
      console.error('Tipo de serpiente no válido.');
  }
  return snake;
}

// Iniciar el juego al cargar la página
startGame();