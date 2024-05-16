import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Snake from './components/Snake';
import Food from './components/Food';
import useInterval from './hooks/useInterval';


const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const GameBoard = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  background-color: #000;
  display: grid;
  grid-template-rows: repeat(20, 1fr);
  grid-template-columns: repeat(20, 1fr);
  border: 2px solid #fff;
`;

const Controls = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  width: 400px;
`;

const App = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [direction, setDirection] = useState('right');
  const [food, setFood] = useState(generateFood());
  const [speed, setSpeed] = useState(200);
  const [foodConsumed, setFoodConsumed] = useState(0);
  const [totalUnitsConsumed, setTotalUnitsConsumed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useInterval(() => {
    if (!gameOver) moveSnake();
  }, speed);

  const moveSnake = () => {
    const newSnake = [...snake];
    let head = { ...newSnake[0] };

    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);
    newSnake.pop();

    if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || checkCollision(newSnake)) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
      if (head.x === food.x && head.y === food.y) {
        growSnake();
        setFood(generateFood());
        incrementScore(food.type);
      }
    }
  };

  const changeDirection = (newDirection) => {
    if (
      (newDirection === 'up' && direction !== 'down') ||
      (newDirection === 'down' && direction !== 'up') ||
      (newDirection === 'left' && direction !== 'right') ||
      (newDirection === 'right' && direction !== 'left')
    ) {
      setDirection(newDirection);
    }
  };

  const growSnake = () => {
    const newSnake = [...snake];
    newSnake.push({ ...newSnake[newSnake.length - 1] });
    setSnake(newSnake);
  };

  const generateFood = () => {
    return {
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
      type: ['pera', 'carne', 'tomate'][Math.floor(Math.random() * 3)]
    };
  };

  const incrementScore = (foodType) => {
    let points = 0;
    switch (foodType) {
      case 'pera':
        points = 1;
        break;
      case 'carne':
        points = 2;
        break;
      case 'tomate':
        points = 3;
        break;
      default:
        break;
    }
    setFoodConsumed(foodConsumed + points);
    setTotalUnitsConsumed(totalUnitsConsumed + 1);
  };

  const checkCollision = (snake) => {
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return false;
  };

  const handleKeyDown = (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'w') {
      changeDirection('up');
    } else if (key === 'arrowdown' || key === 's') {
      changeDirection('down');
    } else if (key === 'arrowleft' || key === 'a') {
      changeDirection('left');
    } else if (key === 'arrowright' || key === 'd') {
      changeDirection('right');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  return (
    <AppContainer>
      <h1>Snake Game</h1>
      <GameBoard>
        <Snake snake={snake} />
        <Food food={food} />
      </GameBoard>
      <Controls>
        <div>Puntos totales: {foodConsumed}</div>
        <div>Total de unidades consumidas: {totalUnitsConsumed}</div>
      </Controls>
      {gameOver && <div>¡Game Over!</div>}
    </AppContainer>
  );
};

export default App;
