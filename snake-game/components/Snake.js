import React from 'react';
import styled from 'styled-components';

const SnakeSegment = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: green;
`;

const Snake = ({ snake }) => {
  return (
    <>
      {snake.map((segment, index) => (
        <SnakeSegment
          key={index}
          style={{ left: `${segment.x * 20}px`, top: `${segment.y * 20}px` }}
        />
      ))}
    </>
  );
};

export default Snake;
