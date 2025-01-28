import React, { createContext, useState, useContext, useEffect } from 'react';
import { predictDifficulty } from '../services/predict';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('gameScore')) || 0);
  const [lives, setLives] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [gameStats, setGameStats] = useState({
    edad_jugador: 3, // Target demographic: 3-5 years
    tiempo_cruce: 6.0,
    velocidad_vehiculos: 25,
    num_carriles: 2,
    num_intentos: 1
  });

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  // Update difficulty based on ML model predictions
  useEffect(() => {
    const updateDifficulty = async () => {
      try {
        // Update game stats based on current score and performance
        const updatedStats = {
          ...gameStats,
          velocidad_vehiculos: Math.min(25 + (score / 50), 80),
          num_carriles: Math.min(2 + Math.floor(score / 300) * 2, 6),
          tiempo_cruce: Math.max(6.0, 6.0 + (score / 200))
        };
        setGameStats(updatedStats);

        // Get difficulty prediction from ML model
        const prediction = await predictDifficulty(updatedStats);
        const newDifficulty = Math.min(10, Math.max(1, Math.round(prediction.difficulty)));
        console.log('ML Predicted difficulty:', newDifficulty);
        setDifficulty(newDifficulty);
      } catch (error) {
        console.error('Error updating difficulty:', error);
        // Fallback to score-based difficulty if ML prediction fails
        const fallbackDifficulty = Math.min(10, Math.floor(score / 100) + 1);
        setDifficulty(fallbackDifficulty);
      }
    };

    updateDifficulty();
  }, [score]);

  const updateScore = (points) => {
    const newScore = score + points;
    console.log('Updating score to:', newScore);
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
    
    // Update game stats when player loses a life
    setGameStats(prev => ({
      ...prev,
      num_intentos: prev.num_intentos + 1
    }));
  };

  const resetGame = () => {
    setScore(0);
    setLives(4);
    setGameOver(false);
    setDifficulty(1);
    setGameStats({
      edad_jugador: 3,
      tiempo_cruce: 6.0,
      velocidad_vehiculos: 25,
      num_carriles: 2,
      num_intentos: 1
    });
    localStorage.removeItem('gameScore');
  };

  const value = {
    score,
    lives,
    gameOver,
    difficulty,
    gameStats,
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