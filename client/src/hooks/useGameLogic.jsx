import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';


const DIFFICULTY_SETTINGS = {
  1: { lanes: 2, vehicleSpeed: 20, spawnRate: 2000, redLightTime: 6000, greenLightTime: 4000, yellowLightTime: 2000, trafficDensity: 0.3 },
  2: { lanes: 2, vehicleSpeed: 50, spawnRate: 1900, redLightTime: 5000, greenLightTime: 4000, yellowLightTime: 2000, trafficDensity: 0.4 },
  3: { lanes: 4, vehicleSpeed: 80, spawnRate: 1800, redLightTime: 4000, greenLightTime: 3500, yellowLightTime: 1500, trafficDensity: 0.5 },
  4: { lanes: 4, vehicleSpeed: 120, spawnRate: 1700, redLightTime: 3000, greenLightTime: 3000, yellowLightTime: 1500, trafficDensity: 0.6 },
  5: { lanes: 4, vehicleSpeed: 140, spawnRate: 1600, redLightTime: 3000, greenLightTime: 2500, yellowLightTime: 1500, trafficDensity: 0.7 },
  6: { lanes: 6, vehicleSpeed: 160, spawnRate: 1500, redLightTime: 2000, greenLightTime: 2000, yellowLightTime: 1000, trafficDensity: 0.8 },
  7: { lanes: 6, vehicleSpeed: 180, spawnRate: 1400, redLightTime: 1000, greenLightTime: 1000, yellowLightTime: 2000, trafficDensity: 0.85 },
  8: { lanes: 6, vehicleSpeed: 200, spawnRate: 1300, redLightTime: 1000, greenLightTime: 1000, yellowLightTime: 1000, trafficDensity: 0.9 },
  9: { lanes: 6, vehicleSpeed: 200, spawnRate: 1200, redLightTime: 1000, greenLightTime: 1000, yellowLightTime: 1000, trafficDensity: 0.95 },
  10: { lanes: 6, vehicleSpeed: 200, spawnRate: 1000, redLightTime: 1000, greenLightTime: 1000, yellowLightTime: 1000, trafficDensity: 1 }
};

const kmhToPixels = (kmh) => (kmh * 0.277778) / 60;

export const useGameLogic = () => {
  const navigate = useNavigate();
  const { score, lives, difficulty, gameStats, updateScore, loseLife, gameOver } = useGame();

  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: window.innerHeight - 150 });
  const [vehicles, setVehicles] = useState([]);
  const [trafficLightColor, setTrafficLightColor] = useState('red');
  const [countdown, setCountdown] = useState(6);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [warning, setWarning] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [crosswalkPosition, setCrosswalkPosition] = useState(window.innerWidth / 2);
  const [currentLanes, setCurrentLanes] = useState(2);
  const [lastCollisionTime, setLastCollisionTime] = useState(0);
  const [isMovingUp, setIsMovingUp] = useState(false);

  useEffect(() => {
    setCurrentLanes(gameStats.num_carriles);
  }, [gameStats.num_carriles]);

  const isInCrosswalk = useCallback(() => {
    const crosswalkWidth = 200;
    const playerCenter = playerPosition.x + 30;
    return Math.abs(playerCenter - crosswalkPosition) < crosswalkWidth / 2;
  }, [playerPosition.x, crosswalkPosition]);

  const repositionCrosswalk = useCallback(() => {
    const minPosition = window.innerWidth * 0.2;
    const maxPosition = window.innerWidth * 0.8;
    const newPosition = minPosition + Math.random() * (maxPosition - minPosition);
    setCrosswalkPosition(newPosition);
  }, []);

  useEffect(() => {
    if (gameOver) {
      navigate('/game-over');
      return;
    }

    const handleKeyPress = (e) => {
      if (isGamePaused || lives <= 0) return;

      const STEP = 20;
      setPlayerPosition(prev => {
        const newPos = { ...prev };
        const roadTop = window.innerHeight / 2 - (currentLanes * 20);
        const roadBottom = window.innerHeight / 2 + (currentLanes * 20);
        const isInRoad = prev.y >= roadTop && prev.y <= roadBottom;

        switch (e.key) {
          case 'ArrowUp':
            setIsMovingUp(true);
            if (isInRoad && !isReturning) {
              if (trafficLightColor !== 'red' || !isInCrosswalk()) {
                if (trafficLightColor !== 'red') {
                  setWarning('¡Espera a que el semáforo esté en rojo!');
                } else {
                  setWarning('¡Usa el paso de cebra!');
                }
                loseLife();
                setIsReturning(true);
                setTimeout(() => {
                  setPlayerPosition({ x: prev.x, y: window.innerHeight - 150 });
                  setIsReturning(false);
                }, 100);
                return prev;
              }
            }
            newPos.y = Math.max(0, prev.y - STEP);
            break;
          case 'ArrowDown':
            setIsMovingUp(false);
            newPos.y = Math.min(window.innerHeight - 60, prev.y + STEP);
            break;
          case 'ArrowLeft':
            newPos.x = Math.max(0, prev.x - STEP);
            break;
          case 'ArrowRight':
            newPos.x = Math.min(window.innerWidth - 60, prev.x + STEP);
            break;
          case 'Escape':
            setIsGamePaused(prev => !prev);
            break;
        }
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGamePaused, lives, trafficLightColor, isInCrosswalk, loseLife, isReturning, gameOver, navigate, currentLanes]);

  useEffect(() => {
    if (isGamePaused || lives <= 0 || gameOver) return;

    const settings = DIFFICULTY_SETTINGS[difficulty];
    let timer;

    const switchLight = (color, nextColor, delay) => {
      setTrafficLightColor(color);
      if (color === 'red') {
        setCountdown(Math.floor(delay / 1000));
      }
      timer = setTimeout(() => switchLight(nextColor, 
        nextColor === 'red' ? 'green' : nextColor === 'green' ? 'yellow' : 'red',
        nextColor === 'red' ? settings.redLightTime : nextColor === 'green' ? settings.greenLightTime : settings.yellowLightTime
      ), delay);
    };

    if (!timer) {
      switchLight(trafficLightColor, 
        trafficLightColor === 'red' ? 'green' : trafficLightColor === 'green' ? 'yellow' : 'red',
        trafficLightColor === 'red' ? settings.redLightTime : trafficLightColor === 'green' ? settings.greenLightTime : settings.yellowLightTime
      );
    }

    return () => clearTimeout(timer);
  }, [trafficLightColor, isGamePaused, lives, difficulty, gameOver]);

  useEffect(() => {
    if (isGamePaused || lives <= 0 || gameOver) {
        console.log('Game is paused, over, or no lives');
        return;
    }
    
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const speed = kmhToPixels(settings.vehicleSpeed);

    console.log('Setting up vehicle system:', {
        difficulty,
        speed,
        spawnRate: settings.spawnRate,
        currentLanes
    });

    const spawnVehicle = () => {
        console.log('Attempting to spawn vehicle');
        const laneIndex = Math.floor(Math.random() * currentLanes);
        const direction = Math.random() > 0.5 ? 'right' : 'left';
        const startX = direction === 'right' ? -100 : window.innerWidth + 100;
        const laneY = window.innerHeight / 2 + (laneIndex - (currentLanes - 1) / 2) * 40;
        
        setVehicles(prev => [...prev, {
            id: Date.now(),
            x: startX,
            y: laneY,
            direction,
            speed,
            lane: laneIndex
        }]);
        console.log('Vehicle spawned');
    };

    const moveVehicles = () => {
        setVehicles(prev => {
            if (prev.length === 0) return prev;
            
            return prev
                .map(vehicle => {
                    let newX = vehicle.x;
                    
                    if (trafficLightColor === 'red') {
                        const stopDistance = vehicle.direction === 'right' ? 100 : -100;
                        const shouldStop = 
                            (vehicle.direction === 'right' && vehicle.x < crosswalkPosition - stopDistance) ||
                            (vehicle.direction === 'left' && vehicle.x > crosswalkPosition + stopDistance);
                        
                        if (!shouldStop) {
                            newX = vehicle.direction === 'right' ? 
                                vehicle.x + vehicle.speed : 
                                vehicle.x - vehicle.speed;
                        }
                    } else {
                        newX = vehicle.direction === 'right' ? 
                            vehicle.x + vehicle.speed : 
                            vehicle.x - vehicle.speed;
                    }
                    
                    return {
                        ...vehicle,
                        x: newX
                    };
                })
                .filter(vehicle => 
                    vehicle.x > -200 && vehicle.x < window.innerWidth + 200
                );
        });
    };

    // Create the intervals
    const spawnInterval = setInterval(spawnVehicle, settings.spawnRate);
    const moveInterval = setInterval(moveVehicles, 16);

    console.log('Intervals created:', {
        spawnRate: settings.spawnRate,
        moveRate: 16
    });

    // Cleanup function
    return () => {
        console.log('Cleaning up vehicle intervals');
        clearInterval(spawnInterval);
        clearInterval(moveInterval);
    };
}, [isGamePaused, lives, gameOver, difficulty, crosswalkPosition, currentLanes, trafficLightColor]); // Removed vehicles from dependencies
  useEffect(() => {
    if (isGamePaused || lives <= 0 || gameOver || isReturning) return;

    const checkCollisions = () => {
      const now = Date.now();
      if (now - lastCollisionTime < 1000) return;

      const playerRect = {
        left: playerPosition.x + 10,
        right: playerPosition.x + 50,
        top: playerPosition.y + 10,
        bottom: playerPosition.y + 50
      };

      const hasCollision = vehicles.some(vehicle => {
        const vehicleRect = {
          left: vehicle.x + 10,
          right: vehicle.x + 90,
          top: vehicle.y + 10,
          bottom: vehicle.y + 30
        };

        return !(
          playerRect.right < vehicleRect.left ||
          playerRect.left > vehicleRect.right ||
          playerRect.bottom < vehicleRect.top ||
          playerRect.top > vehicleRect.bottom
        );
      });

      if (hasCollision) {
        setLastCollisionTime(now);
        setWarning('¡Cuidado con los vehículos!');
        loseLife();
        setTimeout(() => {
          setIsReturning(true);
          setPlayerPosition({ x: playerPosition.x, y: window.innerHeight - 150 });
          setTimeout(() => setIsReturning(false), 100);
        }, 200);
      }
    };

    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [playerPosition, vehicles, isGamePaused, lives, loseLife, lastCollisionTime, gameOver, isReturning]);

  useEffect(() => {
    if (playerPosition.y < 100 && isInCrosswalk() && !isReturning) {
      const crossingTime = Date.now() - lastCollisionTime;
      const timeBonus = Math.max(0, gameStats.tiempo_cruce * 1000 - crossingTime);
      const bonusPoints = Math.floor(timeBonus / 100);
      
      updateScore(100 + bonusPoints);
      setIsReturning(true);
      repositionCrosswalk();
      
      setTimeout(() => {
        setPlayerPosition({ x: 100, y: window.innerHeight - 150 });
        setTimeout(() => {
          setIsReturning(false);
        }, 200);
      }, 200);
    }
  }, [playerPosition.y, isInCrosswalk, updateScore, isReturning, repositionCrosswalk, gameStats.tiempo_cruce, lastCollisionTime]);

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [warning]);

  return {
    playerPosition,
    setPlayerPosition,
    vehicles,
    trafficLightColor,
    countdown,
    isGamePaused,
    setIsGamePaused,
    warning,
    difficulty,
    crosswalkPosition,
    currentLanes,
    isInCrosswalk,
    repositionCrosswalk,
    isReturning,
    gameStats 
  };
};

export default useGameLogic;