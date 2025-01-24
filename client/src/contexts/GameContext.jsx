import React, { createContext, useState, useContext, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('gameScore')) || 0);
  const [lives, setLives] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);

  // Inicializar el juego
  useEffect(() => {
    resetGame();
  }, []);

  // Actualizar dificultad basada en el score
  useEffect(() => {
    console.log('Score actual:', score); // Debug
    const newDifficulty = Math.min(10, Math.floor(score / 100) + 1);
    console.log('Nueva dificultad:', newDifficulty); // Debug
    setDifficulty(newDifficulty);
  }, [score]);

  const updateScore = (points) => {
    const newScore = score + points;
    console.log('Actualizando puntuación a:', newScore); // Debug
    setScore(newScore);
    localStorage.setItem('gameScore', newScore.toString());
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = Math.max(0, prev - 0.5);
      if (newLives === 0) {
        setGameOver(true);
      }
      return newLives;
    });
  };

  const resetGame = () => {
    setScore(0);
    setLives(4);
    setGameOver(false);
    setDifficulty(1);
    localStorage.removeItem('gameScore');
  };

  const value = {
    score,
    lives,
    gameOver,
    difficulty,
    updateScore,
    loseLife,
    resetGame
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};