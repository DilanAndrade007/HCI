import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { predictDifficulty } from '../services/predict';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(() => parseInt(localStorage.getItem('gameScore')) || 0);
  const [lives, setLives] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);
  const [useAI, setUseAI] = useState(false);  // Estado para controlar el modo IA
  const [gameStats, setGameStats] = useState({
    edad_jugador: 3,
    tiempo_cruce: 6.0,
    velocidad_vehiculos: 25,
    num_carriles: 2,
    num_intentos: 1
  });

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  // Función debounced para actualizar la dificultad
  const updateDifficulty = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdateTime < 5000) {
      return;
    }

    try {
      const updatedStats = {
        ...gameStats,
        velocidad_vehiculos: Math.min(25 + (score / 50), 80),
        num_carriles: Math.min(2 + Math.floor(score / 300) * 2, 6),
        tiempo_cruce: Math.max(6.0, 6.0 + (score / 200))
      };

      setGameStats(updatedStats);
      setLastUpdateTime(now);

      if (useAI) {
        // Solo hacer predicción si el modo IA está activo
        console.log('Requesting AI prediction...');
        const prediction = await predictDifficulty(updatedStats);
        if (prediction.success) {
          const newDifficulty = Math.min(10, Math.max(1, Math.round(prediction.difficulty)));
          if (newDifficulty !== difficulty) {
            console.log('AI Predicted difficulty:', newDifficulty);
            setDifficulty(newDifficulty);
          }
        }
      } else {
        // Usar dificultad basada en puntuación cuando IA está desactivada
        const newDifficulty = Math.min(10, Math.floor(score / 100) + 1);
        if (newDifficulty !== difficulty) {
          console.log('Standard difficulty:', newDifficulty);
          setDifficulty(newDifficulty);
        }
      }
    } catch (error) {
      console.error('Error updating difficulty:', error);
      // Fallback suavizado para evitar cambios bruscos
      const fallbackDifficulty = Math.min(10, Math.floor(score / 100) + 1);
      if (Math.abs(fallbackDifficulty - difficulty) > 1) {
        setDifficulty(prev => fallbackDifficulty > prev ? prev + 1 : prev - 1);
      }
    }
  }, [score, gameStats, difficulty, lastUpdateTime, useAI]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateDifficulty();
    }, 1000);

    return () => clearTimeout(timer);
  }, [score, updateDifficulty]);

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
    setLastUpdateTime(0);
    setGameStats({
      edad_jugador: 3,
      tiempo_cruce: 6.0,
      velocidad_vehiculos: 25,
      num_carriles: 2,
      num_intentos: 1
    });
    setUseAI(false); // Asegurarse de que el modo IA se resetea
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
    resetGame,
    useAI,
    setUseAI
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

export default GameContext;