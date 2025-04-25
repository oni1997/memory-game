import React, { useState } from 'react';
import './App.css';
import Modal from './Modal';
import Board from './Board';

function App() {
  const [gameConfig, setGameConfig] = useState(null);
  const [showModal, setShowModal] = useState(true);

  const startGame = (config) => {
    setGameConfig(config);
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      {showModal && <Modal startGame={startGame} />}
      {!showModal && <Board playerNames={gameConfig} />}
    </div>
  );
}

export default App;
