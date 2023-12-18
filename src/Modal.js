import React, { useState } from 'react';
import './Modal.css';

function Modal({ startGame }) {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleStartGame = () => {
    startGame({ player1, player2 });
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Enter Player Names</h2>
        <input type="text" placeholder="Player 1" onChange={(e) => setPlayer1(e.target.value)} />
        <input type="text" placeholder="Player 2" onChange={(e) => setPlayer2(e.target.value)} />
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
}

export default Modal;
