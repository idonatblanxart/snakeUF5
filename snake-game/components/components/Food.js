import React from 'react';
import styled from 'styled-components';

const FoodItem = styled.img`
  position: absolute;
  width: 20px;
  height: 20px;
`;

const Food = ({ food }) => {
  return (
    <FoodItem
      src={`img/${food.type}.png`}
      style={{ left: `${food.x * 20}px`, top: `${food.y * 20}px` }}
    />
  );
};

export default Food;
