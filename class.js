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
