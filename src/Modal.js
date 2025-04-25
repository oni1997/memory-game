import React, { useState } from 'react';
import './Modal.css';

function Modal({ startGame }) {
  const [gameMode, setGameMode] = useState('single'); // 'single' or 'two-player'
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  const handleStartGame = () => {
    if (gameMode === 'single') {
      startGame({
        mode: 'single',
        player1: player1 || 'Player',
        player2: 'Computer'
      });
    } else {
      startGame({
        mode: 'two-player',
        player1: player1 || 'Player 1',
        player2: player2 || 'Player 2'
      });
    }
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Memory Game Setup</h2>
        <div className="mode-selector">
          <button 
            className={gameMode === 'single' ? 'active' : ''} 
            onClick={() => setGameMode('single')}
          >
            Single Player
          </button>
          <button 
            className={gameMode === 'two-player' ? 'active' : ''} 
            onClick={() => setGameMode('two-player')}
          >
            Two Players
          </button>
        </div>
        <input
          type="text"
          placeholder={gameMode === 'single' ? "Your Name" : "Player 1 Name"}
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        {gameMode === 'two-player' && (
          <input
            type="text"
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        )}
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
}

export default Modal;
