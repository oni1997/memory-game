import React from 'react';
import './Card.css';

function Card({ id, value, color, isFlipped, handleClick }) {
  const handleClickInternal = () => {
    if (!isFlipped) {
      handleClick(id);
    }
  };

  return (
    <div
      className={`card ${isFlipped ? 'flipped' : ''} ${color}`}
      onClick={handleClickInternal}
    >
      {isFlipped && <p>{value}</p>}
    </div>
  );
}

export default Card;
