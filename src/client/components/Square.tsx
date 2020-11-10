import React from 'react';

interface Square {
  id: number;
  handleClick: (id: number) => void;
  value: string;
  isWinnerSquare: boolean;
}

const Square: React.FC<Square> = ({ id, handleClick, value, isWinnerSquare }) => {
  return (
    <div
      className={`col square border-right border-bottom ${[0, 3, 6].includes(id) ? ' border-left ' : ''}${
        isWinnerSquare ? ' bg-success text-white' : ''
      }`}
      style={{ height: 100 }}
      onClick={() => !value && handleClick(id)}
    >
      {value}
    </div>
  );
};

export default Square;
