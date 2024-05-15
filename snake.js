
// Clase para representar objetos en el juego
class GameObject {
  constructor(x, y) {
    this.x = x; // Coordenada X del objeto
    this.y = y; // Coordenada Y del objeto
  }
}

// Clase para representar la serpiente, que hereda de GameObject
class Snake extends GameObject {
  constructor(color) {
    super(5, 5); // Posición inicial de la serpiente
    this.body = [{ x: 5, y: 5 }]; // Cuerpo de la serpiente
    this.direction = 'right'; // Dirección de movimiento
    this.color = color; // Color de la serpiente
    this.foodType = ['pera', 'carne', 'tomate']; // Tipos de comida disponibles
  }

  // Método para mover la serpiente en la dirección actual
  move() {
    const head = { ...this.body[0] }; // Posición de la cabeza

    // Actualizar la posición de la cabeza según la dirección
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

    this.body.unshift(head); // Añadir nueva posición a la cabeza
    this.body.pop(); // Eliminar la última posición del cuerpo
  }

  // Método para cambiar la dirección de la serpiente
  changeDirection(newDirection) {
    // Verificar que la nueva dirección no sea opuesta a la actual
    if (
      (newDirection === 'up' && this.direction !== 'down') ||
      (newDirection === 'down' && this.direction !== 'up') ||
      (newDirection === 'left' && this.direction !== 'right') ||
      (newDirection === 'right' && this.direction !== 'left')
    ) {
      this.direction = newDirection; // Cambiar la dirección
    }
  }

  // Método para hacer crecer la serpiente
  grow() {
    const tail = { ...this.body[this.body.length - 1] }; // Nueva posición de la cola
    this.body.push(tail); // Añadir nueva posición al final del cuerpo
  }

  // Método estático para crear comida en una posición aleatoria
  static createFood() {
    const food = {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
      type: ['pera', 'carne', 'tomate'][Math.floor(Math.random() * 3)] // Tipo de comida aleatorio
    };
    return food; // Devuelve un objeto de comida
  }
}

// Clase para representar serpientes con colores
class ColoredSnake extends Snake {
  constructor(color) {
    super(color); // Llama al constructor de la clase padre
  }

  // Puedes agregar métodos adicionales específicos para las serpientes de colores aquí
}

// Obtener referencia al tablero de juego
const gameBoard = document.getElementById('game-board');

// Función para dibujar el tablero con la serpiente y la comida
function drawBoard(snake, foods) {
  gameBoard.innerHTML = ''; // Limpiar el tablero

  // Dibujar cada segmento de la serpiente
  snake.body.forEach((segment, index) => {
    const snakeSegment = createSegment(segment.x, segment.y); // Crear un segmento
    snakeSegment.classList.add('segment'); // Añadir clase de estilo
    snakeSegment.style.backgroundColor = snake.color; // Establecer color de la serpiente
    gameBoard.appendChild(snakeSegment); // Añadir segmento al tablero

    // Si es la cabeza de la serpiente, dibujar los ojos
    if (index === 0) {
      const headX = segment.x * 20; // Coordenadas X de la cabeza
      const headY = segment.y * 20; // Coordenadas Y de la cabeza
      const eye1 = createEye(headX + 6, headY + 6); // Posición del primer ojo
      const eye2 = createEye(headX + 12, headY + 6); // Posición del segundo ojo
      gameBoard.appendChild(eye1); // Añadir primer ojo al tablero
      gameBoard.appendChild(eye2); // Añadir segundo ojo al tablero
    }
  });

  // Dibujar cada comida en el tablero
  foods.forEach(food => {
    const foodImg = new Image(); // Crear elemento de imagen
    foodImg.src = `img/${food.type}.png`; // Establecer la fuente de la imagen según el tipo de comida
    foodImg.width = 20; // Establecer el ancho de la imagen
    foodImg.height = 20; // Establecer la altura de la imagen
    foodImg.style.position = 'absolute'; // Establecer posición absoluta
    foodImg.style.left = food.x * 20 + 'px'; // Establecer posición izquierda
    foodImg.style.top = food.y * 20 + 'px'; // Establecer posición superior
    gameBoard.appendChild(foodImg); // Añadir imagen al tablero
  });
}

// Función para crear un ojo en una posición específica
function createEye(x, y) {
  const eye = document.createElement('div'); // Crear elemento div
  eye.classList.add('eye'); // Añadir clase de estilo
  eye.style.left = x + 'px'; // Establecer posición izquierda
  eye.style.top = y + 'px'; // Establecer posición superior
  return eye; // Devolver el elemento creado
}

// Función para crear un segmento en el tablero
function createSegment(x, y) {
  const segment = document.createElement('div'); // Crear elemento div
  segment.className = 'cell'; // Establecer clase de estilo
  segment.style.left = x * 20 + 'px'; // Establecer posición izquierda
  segment.style.top = y * 20 + 'px'; // Establecer posición superior
  return segment; // Devolver el elemento creado
}

let foodConsumed = 0; // Contador de comidas consumidas
let totalUnitsConsumed = 0; // Contador de unidades totales consumidas
let durationAsked = false; // Indicador si se preguntó la duración del juego

// Función principal para iniciar el juego
function startGame(snakeColor) {
  const snake = chooseSnake(snakeColor); // Elegir una serpiente con el color especificado
  
  // Si la duración aún no se ha preguntado, preguntarla
  if (!durationAsked) {
    const durationString = prompt("Elige la duración del juego en minutos (1, 2 o 3):"); // Preguntar la duración
    const duration = parseInt(durationString); // Convertir a entero
    
    // Verificar si la duración ingresada es válida
    if (isNaN(duration) || ![1, 2, 3].includes(duration)) {
      alert("Por favor, ingresa una duración válida (1, 2 o 3 minutos)."); // Mostrar mensaje de error
      return;
    }

    durationAsked = true; // Marcar que ya se preguntó la duración
    let secondsLeft = duration * 60; // Convertir la duración a segundos
    
    // Mostrar la duración del juego en el HTML
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `Tiempo restante: ${duration}:00`;

    // Iniciar la cuenta regresiva
    const countdown = setInterval(() => {
      secondsLeft--; // Decrementar los segundos restantes
      if (secondsLeft === 0) {
        clearInterval(countdown); // Detener la cuenta regresiva cuando llegue a cero
        clearInterval(gameLoop); // Detener el bucle de juego
        alert('¡Game Over! Se acabó el tiempo.'); // Mostrar mensaje de fin de partida por tiempo agotado
        return;
      }
      // Actualizar el tiempo restante en el HTML
      const minutes = Math.floor(secondsLeft / 60); // Calcular minutos
      const seconds = secondsLeft % 60; // Calcular segundos
      countdownElement.textContent = `Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
  }

  let foods = []; // Arreglo para almacenar las comidas
  for (let i = 0; i < 3; i++) {
    foods.push(Snake.createFood()); // Crear comida y agregarla al arreglo
  }

  // Dibujar el tablero inicial
  drawBoard(snake, foods);

  // Bucle de juego
  const gameLoop = setInterval(() => {
    snake.move(); // Mover la serpiente

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

    // Si la serpiente come la comida
    foods.forEach((food, index) => {
      if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
        snake.grow(); // Hacer crecer la serpiente
        foods[index] = Snake.createFood(); // Crear nueva comida en esa posición
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
        totalUnitsConsumed++; // Incrementar el total de unidades consumidas
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
      snake.changeDirection('up'); // Cambiar dirección hacia arriba
    } else if (key === 'arrowdown' || key === 's') {
      snake.changeDirection('down'); // Cambiar dirección hacia abajo
    } else if (key === 'arrowleft' || key === 'a') {
      snake.changeDirection('left'); // Cambiar dirección hacia la izquierda
    } else if (key === 'arrowright' || key === 'd') {
      snake.changeDirection('right'); // Cambiar dirección hacia la derecha
    }
  });
}

// Función para actualizar el contador de comidas en el HTML
function updateFoodCount() {
  const foodCountElement = document.getElementById('food-count'); // Obtener elemento de conteo de comidas
  foodCountElement.textContent = `Puntos totales: ${foodConsumed}`; // Actualizar el texto
}

// Función para actualizar el total de unidades consumidas en el HTML
function updateTotalUnitsCount() {
  const totalUnitsElement = document.getElementById('total-units'); // Obtener elemento de conteo de unidades
  totalUnitsElement.textContent = `Total de unidades consumidas: ${totalUnitsConsumed}`; // Actualizar el texto
}

// Función para elegir el tipo de serpiente
function chooseSnake(snakeType) {
  let snake;
  switch (snakeType) {
    case 'green':
      snake = new ColoredSnake('green'); // Crear una serpiente verde
      break;
    case 'blue':
      snake = new ColoredSnake('blue'); // Crear una serpiente azul
      break;
    case 'red':
      snake = new ColoredSnake('red'); // Crear una serpiente roja
      break;
    case 'yellow':
      snake = new ColoredSnake('yellow'); // Crear una serpiente amarilla
      break;
    default:
      console.error('Tipo de serpiente no válido.'); // Mensaje de error si el tipo de serpiente no es válido
  }
  return snake; // Devolver la serpiente creada
}

// Iniciar el juego al cargar la página
document.getElementById('green-button').addEventListener('click', () => startGame('green')); // Botón para iniciar juego con serpiente verde
document.getElementById('blue-button').addEventListener('click', () => startGame('blue')); // Botón para iniciar juego con serpiente azul
document.getElementById('red-button').addEventListener('click', () => startGame('red')); // Botón para iniciar juego con serpiente roja
document.getElementById('yellow-button').addEventListener('click', () => startGame('yellow')); // Botón para iniciar juego con serpiente amarilla
