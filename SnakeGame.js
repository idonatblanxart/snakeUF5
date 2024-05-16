import React, { useState } from 'react';

function SnakeGame() {
  const [snakeColor, setSnakeColor] = useState(null);

  // Función para iniciar el juego con el color de serpiente seleccionado
  const startGame = (color) => {
    setSnakeColor(color);
    // Aquí puedes agregar lógica adicional para iniciar el juego con el color de la serpiente seleccionado
  };

  return (
    <div>
      {/* Botones para seleccionar el color de la serpiente */}
      <button onClick={() => startGame('green')}>Serpiente Verde</button>
      <button onClick={() => startGame('blue')}>Serpiente Azul</button>
      <button onClick={() => startGame('red')}>Serpiente Roja</button>
      <button onClick={() => startGame('yellow')}>Serpiente Amarilla</button>

      {/* Aquí puedes renderizar el juego usando el color de la serpiente seleccionado */}
      {snakeColor && <SnakeGameBoard snakeColor={snakeColor} />}
    </div>
  );
}

// Componente SnakeGameBoard que renderiza el juego
function SnakeGameBoard({ snakeColor }) {
  // Aquí puedes colocar la lógica para renderizar el juego utilizando el color de la serpiente seleccionado
  return (
    <div>
      {/* Renderizar el juego */}
      <p>Juego con serpiente de color: {snakeColor}</p>
    </div>
  );
}

export default SnakeGame;
