class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake extends GameObject {
  constructor(color) {
    super(5, 5); // Posición inicial de la serpiente
    this.body = [{ x: 5, y: 5 }];
    this.direction = 'right';
    this.color = color; // Nuevo atributo para almacenar el color de la serpiente
    this.foodType = ['pera', 'carne', 'tomate']; // Tipos de comida
  }

  move() {
    const head = { ...this.body[0] };

    switch (this.direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    this.body.unshift(head);
    this.body.pop();
  }

  changeDirection(newDirection) {
    if (
      (newDirection === 'up' && this.direction !== 'down') ||
      (newDirection === 'down' && this.direction !== 'up') ||
      (newDirection === 'left' && this.direction !== 'right') ||
      (newDirection === 'right' && this.direction !== 'left')
    ) {
      this.direction = newDirection;
    }
  }

  grow() {
    const tail = { ...this.body[this.body.length - 1] };
    this.body.push(tail);
  }

  static createFood() {
    const food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
      type: ['pera', 'carne', 'tomate'][Math.floor(Math.random() * 3)] // Tipo de comida aleatorio
    };
    return food;
  }
}

class ColoredSnake extends Snake {
  constructor(color) {
    super(color);
  }

  // Aquí puedes agregar métodos adicionales específicos para las serpientes de colores
}

// Obtener referencia al tablero de juego
const gameBoard = document.getElementById('game-board');

// Modificamos la función drawBoard para dibujar los ojos en la cabeza de la serpiente
function drawBoard(snake, foods) {
  gameBoard.innerHTML = '';

  snake.body.forEach((segment, index) => {
    const snakeSegment = createSegment(segment.x, segment.y);
    snakeSegment.classList.add('segment');
    snakeSegment.style.backgroundColor = snake.color;
    gameBoard.appendChild(snakeSegment);

    // Si es la cabeza de la serpiente, añadir los ojos
    if (index === 0) {
      const headX = segment.x * 20; // Coordenadas X de la cabeza
      const headY = segment.y * 20; // Coordenadas Y de la cabeza
      const eye1 = createEye(headX + 6, headY + 6); // Posición del primer ojo
      const eye2 = createEye(headX + 12, headY + 6); // Posición del segundo ojo
      gameBoard.appendChild(eye1);
      gameBoard.appendChild(eye2);
    }
  });

  foods.forEach(food => {
    const foodImg = new Image();
    foodImg.src = `img/${food.type}.png`;
    foodImg.width = 20;
    foodImg.height = 20;
    foodImg.style.position = 'absolute';
    foodImg.style.left = food.x * 20 + 'px';
    foodImg.style.top = food.y * 20 + 'px';
    gameBoard.appendChild(foodImg);
  });
}

// Función para crear un ojo en una posición específica
function createEye(x, y) {
  const eye = document.createElement('div');
  eye.classList.add('eye');
  eye.style.left = x + 'px';
  eye.style.top = y + 'px';
  return eye;
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
let foodConsumed = 0; // Variable para contar las comidas consumidas
let totalUnitsConsumed = 0; // Variable para contar el total de unidades consumidas

function startGame() {
  const snakeType = prompt("Elige el tipo de serpiente ('green' o 'blue'): ");
  const durationString = prompt("Elige la duración del juego en minutos (1, 2 o 3):");
  const duration = parseInt(durationString);
   // Verificar si la duración ingresada es válida
  if (isNaN(duration) || ![1, 2, 3].includes(duration)) {
    alert("Por favor, ingresa una duración válida (1, 2 o 3 minutos).");
    return;
  }

  const snake = chooseSnake(snakeType);
  let foods = [];
  for (let i = 0; i < 3; i++) {
    foods.push(Snake.createFood());
  }

  let secondsLeft = duration * 60; // Convertir la duración del juego de minutos a segundos

  // Dibujar el tablero inicial
  drawBoard(snake, foods);

  // Actualizar el contador de comidas y total de unidades
  updateFoodCount();
  updateTotalUnitsCount();

  
  // Mostrar la duración del juego en el HTML
   const countdownElement = document.getElementById('countdown');
   countdownElement.textContent = `Tiempo restante: ${duration}:00`;
    // Iniciar la cuenta atrás
   const countdown = setInterval(() => {
     secondsLeft--;
     if (secondsLeft === 0) {
       clearInterval(countdown); // Detener la cuenta atrás cuando llegue a cero
       clearInterval(gameLoop); // Detener el bucle de juego
       alert('¡Game Over! Se acabó el tiempo.'); // Mostrar mensaje de fin de partida por tiempo agotado
       return;
     }
      // Actualizar el tiempo restante en el HTML
     const minutes = Math.floor(secondsLeft / 60);
     const seconds = secondsLeft % 60;
     countdownElement.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
   }, 1000);


  // Bucle de juego
  const gameLoop = setInterval(() => {
    snake.move();

    // Verificar si la serpiente choca con el borde
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

    // Si la serpiente come la comida
    foods.forEach((food, index) => {
      if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
        snake.grow();
        foods[index] = Snake.createFood();
        // Incrementar el contador de comidas y el total de unidades según el tipo de comida
        switch (food.type) {
          case 'pera':
            foodConsumed += 1;
            break;
          case 'carne':
            foodConsumed += 2;
            break;
          case 'tomate':
            foodConsumed += 3;
            break;
          default:
            break;
        }
        totalUnitsConsumed++; // Aumentar el total de unidades consumidas
        // Actualizar el contador de comidas y total de unidades en el HTML
        updateFoodCount();
        updateTotalUnitsCount();
      }
    });

    // Dibujar el tablero actualizado
    drawBoard(snake, foods);
  }, 200);

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

// Función para actualizar el contador de comidas en el HTML
function updateFoodCount() {
  const foodCountElement = document.getElementById('food-count');
  foodCountElement.textContent = `Puntos totales: ${foodConsumed}`;
}

// Función para actualizar el total de unidades consumidas en el HTML
function updateTotalUnitsCount() {
  const totalUnitsElement = document.getElementById('total-units');
  totalUnitsElement.textContent = `Total de unidades consumidas: ${totalUnitsConsumed}`;
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
