import React, { useState, useEffect } from 'react';
import Card from './Card';
import './Board.css';

function Board({ playerNames }) {
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [turn, setTurn] = useState(playerNames.player1);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const cardColors = ['red', 'black'];

    const initializeDeck = () => {
      const newDeck = [];
      for (let value of cardValues) {
        for (let color of cardColors) {
          newDeck.push({ id: `${value}-${color}`, value, color });
        }
      }
      const shuffledDeck = shuffleDeck(newDeck.concat(newDeck));
      setDeck(shuffledDeck);
    };

    const shuffleDeck = (deck) => {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      return deck;
    };

    initializeDeck();
  }, []);

  const handleCardClick = (id) => {
    setFlipped((flipped) => [...flipped, id]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstCard, secondCard] = flipped;
      if (deck[firstCard].value === deck[secondCard].value) {
        setMatched((matched) => [...matched, firstCard, secondCard]);
      }
      setTimeout(() => setFlipped([]), 1000);
      setTurn((turn) => (turn === playerNames.player1 ? playerNames.player2 : playerNames.player1));
    }
  }, [flipped, deck, playerNames]);

  useEffect(() => {
    if (matched.length === deck.length) {
      setWinner(turn);
    }
  }, [matched, deck, turn]);

  return (
    <div className="board">
      {deck.map((card, index) => (
        <Card
          key={index}
          id={index}
          value={card.value}
          color={card.color}
          isFlipped={flipped.includes(index) || matched.includes(index)}
          handleClick={handleCardClick}
        />
      ))}
      {winner ? (
        <p className="game-over">Game Over! {winner} is the winner!</p>
      ) : (
        <p>Current Turn: {turn}</p>
      )}
    </div>
  );
}

export default Board;
