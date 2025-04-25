import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import './Board.css';

function Board({ playerNames }) {
  const [deck, setDeck] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [turn, setTurn] = useState(playerNames.player1);
  const [scores, setScores] = useState({
    [playerNames.player1]: 0,
    [playerNames.player2]: 0,
  });
  const [winner, setWinner] = useState(null);
  const [showInitialCards, setShowInitialCards] = useState(true);
  const isSinglePlayer = playerNames.player2 === 'Computer';
  const [computerMemory, setComputerMemory] = useState(new Map());

  const shuffleDeck = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const handleCardClick = useCallback((id) => {
    if (showInitialCards || flipped.length === 2) return;
    if (isSinglePlayer && turn === playerNames.player2) return;
    if (matched.includes(id) || flipped.includes(id)) return;
    
    setFlipped(prevFlipped => [...prevFlipped, id]);
  }, [showInitialCards, flipped, isSinglePlayer, turn, playerNames.player2, matched]);

  const updateComputerMemory = useCallback((cardIndex, cardValue, cardColor) => {
    if (!isSinglePlayer) return;
    
    setComputerMemory(prevMemory => {
      const newMemory = new Map(prevMemory);
      newMemory.set(cardIndex, { value: cardValue, color: cardColor });
      
      // Keep only the last 4 cards in memory
      if (newMemory.size > 4) {
        const firstKey = newMemory.keys().next().value;
        newMemory.delete(firstKey);
      }
      return newMemory;
    });
  }, [isSinglePlayer]);

  const computerMove = useCallback(() => {
    if (!isSinglePlayer || turn !== playerNames.player2 || flipped.length > 0) return;

    const makeMove = () => {
      const availableCards = deck
        .map((_, index) => index)
        .filter(index => !matched.includes(index) && !flipped.includes(index));

      // Check memory for matching pairs
      let firstCard = null;
      let secondCard = null;

      // Convert memory to array for easier processing
      const memoryEntries = Array.from(computerMemory.entries());

      // Look for matches in memory
      for (let i = 0; i < memoryEntries.length; i++) {
        const [index1, card1] = memoryEntries[i];
        if (!availableCards.includes(index1)) continue;

        for (let j = i + 1; j < memoryEntries.length; j++) {
          const [index2, card2] = memoryEntries[j];
          if (!availableCards.includes(index2)) continue;

          if (card1.value === card2.value && card1.color === card2.color) {
            firstCard = parseInt(index1);
            secondCard = parseInt(index2);
            break;
          }
        }
        if (firstCard !== null) break;
      }

      // If no matches found in memory, pick random cards
      if (firstCard === null) {
        firstCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        const remainingCards = availableCards.filter(card => card !== firstCard);
        secondCard = remainingCards[Math.floor(Math.random() * remainingCards.length)];
      }

      // Make the moves
      setFlipped([firstCard]);
      setTimeout(() => {
        setFlipped(prev => [...prev, secondCard]);
      }, 1000);
    };

    const timeoutId = setTimeout(makeMove, 1500);
    return () => clearTimeout(timeoutId);
  }, [deck, flipped, matched, isSinglePlayer, turn, playerNames.player2, computerMemory]);

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
      newDeck.push({ id: `Joker-red`, value: 'Joker', color: 'red' });
      newDeck.push({ id: `Joker-black`, value: 'Joker', color: 'black' });

      const shuffledDeck = shuffleDeck(newDeck.concat(newDeck));
      setDeck(shuffledDeck);
      
      const allCardIndexes = Array.from({ length: shuffledDeck.length }, (_, i) => i);
      setFlipped(allCardIndexes);
      
      setTimeout(() => {
        setFlipped([]);
        setShowInitialCards(false);
      }, 5000);
    };

    initializeDeck();
  }, [shuffleDeck]);

  useEffect(() => {
    if (isSinglePlayer && turn === playerNames.player2) {
      computerMove();
    }
  }, [computerMove, isSinglePlayer, turn, playerNames.player2]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [firstCard, secondCard] = flipped;
      const isMatch = deck[firstCard].value === deck[secondCard].value && 
                     deck[firstCard].color === deck[secondCard].color;

      // Update computer's memory of seen cards
      if (turn === playerNames.player1 || isSinglePlayer) {
        updateComputerMemory(firstCard, deck[firstCard].value, deck[firstCard].color);
        updateComputerMemory(secondCard, deck[secondCard].value, deck[secondCard].color);
      }

      const timeoutId = setTimeout(() => {
        if (isMatch) {
          setMatched(prev => [...prev, firstCard, secondCard]);
          setScores(prevScores => ({
            ...prevScores,
            [turn]: prevScores[turn] + 10,
          }));
          setFlipped([]);
        } else {
          setFlipped([]);
          setTurn(currentTurn => 
            currentTurn === playerNames.player1 ? playerNames.player2 : playerNames.player1
          );
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [flipped, deck, turn, playerNames, isSinglePlayer, updateComputerMemory]);

  useEffect(() => {
    if (matched.length === deck.length && deck.length > 0) {
      const winner = scores[playerNames.player1] > scores[playerNames.player2] 
        ? playerNames.player1 
        : playerNames.player2;
      setWinner(winner);
    }
  }, [matched, deck, scores, playerNames]);

  return (
    <div className="board">
      <div className="player-section">
        <h2 className={turn === playerNames.player1 ? 'active-player' : ''}>
          {playerNames.player1}
        </h2>
        <p>Score: {scores[playerNames.player1]}</p>
      </div>
      <div className="game-section">
        {showInitialCards && <div className="countdown">Memorize the cards!</div>}
        <div className="game-board">
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
        </div>
      </div>
      <div className="player-section">
        <h2 className={turn === playerNames.player2 ? 'active-player' : ''}>
          {playerNames.player2}
        </h2>
        <p>Score: {scores[playerNames.player2]}</p>
      </div>
      {winner && (
        <div className="winner-announcement">
          Game Over! {winner} wins with {scores[winner]} points!
        </div>
      )}
    </div>
  );
}

export default Board;
