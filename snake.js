// Obtener referencia al tablero de juego
const gameBoard = $('#game-board'); // Usar jQuery para seleccionar el tablero de juego

// Función para dibujar el tablero con la serpiente y la comida
function drawBoard(snake, foods) {
  gameBoard.empty(); // Limpiar el tablero

  // Dibujar cada segmento de la serpiente
  snake.body.forEach((segment, index) => {
    const snakeSegment = createSegment(segment.x, segment.y); // Crear un segmento
    snakeSegment.addClass('segment'); // Añadir clase de estilo
    snakeSegment.css('background-color', snake.color); // Establecer color de la serpiente
    gameBoard.append(snakeSegment); // Añadir segmento al tablero

    // Si es la cabeza de la serpiente, dibujar los ojos
    if (index === 0) {
      const headX = segment.x * 20; // Coordenadas X de la cabeza
      const headY = segment.y * 20; // Coordenadas Y de la cabeza
      const eye1 = createEye(headX + 6, headY + 6); // Posición del primer ojo
      const eye2 = createEye(headX + 12, headY + 6); // Posición del segundo ojo
      gameBoard.append(eye1); // Añadir primer ojo al tablero
      gameBoard.append(eye2); // Añadir segundo ojo al tablero
    }
  });

  // Dibujar cada comida en el tablero
  foods.forEach(food => {
    const foodImg = $('<img>'); // Crear elemento de imagen
    foodImg.attr('src', `img/${food.type}.png`); // Establecer la fuente de la imagen según el tipo de comida
    foodImg.attr('width', 20); // Establecer el ancho de la imagen
    foodImg.attr('height', 20); // Establecer la altura de la imagen
    foodImg.css({
      position: 'absolute', // Establecer posición absoluta
      left: food.x * 20 + 'px', // Establecer posición izquierda
      top: food.y * 20 + 'px' // Establecer posición superior
    });
    gameBoard.append(foodImg); // Añadir imagen al tablero
  });
}

// Función para crear un ojo en una posición específica
function createEye(x, y) {
  const eye = $('<div>'); // Crear elemento div
  eye.addClass('eye'); // Añadir clase de estilo
  eye.css({
    left: x + 'px', // Establecer posición izquierda
    top: y + 'px' // Establecer posición superior
  });
  return eye; // Devolver el elemento creado
}

// Función para crear un segmento en el tablero
function createSegment(x, y) {
  const segment = $('<div>'); // Crear elemento div
  segment.addClass('cell'); // Establecer clase de estilo
  segment.css({
    left: x * 20 + 'px', // Establecer posición izquierda
    top: y * 20 + 'px' // Establecer posición superior
  });
  return segment; // Devolver el elemento creado
}

let foodConsumed = 0; // Contador de comidas consumidas
let totalUnitsConsumed = 0; // Contador de unidades totales consumidas
let durationAsked = false; // Indicador si se preguntó la duración del juego
let gameLoop; // Variable para el bucle de juego
let countdown; // Variable para la cuenta regresiva
let currentSnake; // Variable para almacenar la serpiente actual

// Función principal para iniciar el juego
function startGame(snakeColor) {
  if (gameLoop) clearInterval(gameLoop); // Limpiar cualquier juego anterior
  if (countdown) clearInterval(countdown); // Limpiar cualquier cuenta regresiva anterior

  const snake = chooseSnake(snakeColor); // Elegir una serpiente con el color especificado
  currentSnake = snake; // Almacenar la serpiente actual

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
    const countdownElement = $('#countdown');
    countdownElement.text(`Tiempo restante: ${duration}:00`);

    // Iniciar la cuenta regresiva
    countdown = setInterval(() => {
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
      countdownElement.text(`Tiempo restante: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    }, 1000);
  }

  let foods = []; // Arreglo para almacenar las comidas
  for (let i = 0; i < 3; i++) {
    foods.push(Snake.createFood()); // Crear comida y agregarla al arreglo
  }

  // Dibujar el tablero inicial
  drawBoard(snake, foods);

  // Iniciar el bucle de juego
  gameLoop = setInterval(() => {
    snake.move(); // Mover la serpiente en cada iteración

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
  $(document).on('keydown', handleDirectionChange);
}

// Función para manejar el cambio de dirección de la serpiente
function handleDirectionChange(event) {
  const key = event.key.toLowerCase();
  if (key === 'arrowup' || key === 'w') {
    currentSnake.changeDirection('up'); // Cambiar dirección hacia arriba
  } else if (key === 'arrowdown' || key === 's') {
    currentSnake.changeDirection('down'); // Cambiar dirección hacia abajo
  } else if (key === 'arrowleft' || key === 'a') {
    currentSnake.changeDirection('left'); // Cambiar dirección hacia la izquierda
  } else if (key === 'arrowright' || key === 'd') {
    currentSnake.changeDirection('right'); // Cambiar dirección hacia la derecha
  }
}

// Función para actualizar el contador de comidas en el HTML
function updateFoodCount() {
  const foodCountElement = $('#food-count'); // Obtener elemento de conteo de comidas
  foodCountElement.text(`Puntos totales: ${foodConsumed}`); // Actualizar el texto
}

// Función para actualizar el total de unidades consumidas en el HTML
function updateTotalUnitsCount() {
  const totalUnitsElement = $('#total-units'); // Obtener elemento de conteo de unidades
  totalUnitsElement.text(`Total de unidades consumidas: ${totalUnitsConsumed}`); // Actualizar el texto
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

