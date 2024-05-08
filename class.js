class Food {
    constructor(type) {
      this.type = type;
      this.x = Math.floor(Math.random() * 20);
      this.y = Math.floor(Math.random() * 20);
    }
  
    static create() {
      const types = ['apple', 'banana', 'pear'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      return new Food(randomType);
    }
  }
  
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
  
    checkCollision(food) {
      return this.body[0].x === food.x && this.body[0].y === food.y;
    }
  }
  
  class ColoredSnake extends Snake {
    constructor(color) {
      super(color);
    }
  
    // Aquí puedes agregar métodos adicionales específicos para las serpientes de colores
  }
  