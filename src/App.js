import React, { useState } from 'react';
import './App.css';
import Modal from './Modal';
import Board from './Board';

function App() {
  const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
  const [showModal, setShowModal] = useState(true);

  const startGame = (players) => {
    setPlayerNames(players);
    setShowModal(false);
  };

  return (
    <div className="App">
      <h1>Memory Game</h1>
      {showModal && <Modal startGame={startGame} />}
      {!showModal && <Board playerNames={playerNames} />}
    </div>
  );
}

export default App;
