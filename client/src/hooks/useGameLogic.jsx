import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import api from '../services/api';

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
  const { score, lives, difficulty, gameStats, updateScore, loseLife, gameOver, useAI, setUseAI } = useGame();
  const [playerPosition, setPlayerPosition] = useState({ x: 550, y: window.innerHeight - 150 });
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
    // Solo actualizar los carriles desde gameStats si useAI está activo
    if (useAI) {
      setCurrentLanes(gameStats.num_carriles);
    } else {
      // Si no está en modo IA, usar los carriles definidos en DIFFICULTY_SETTINGS
      const settings = DIFFICULTY_SETTINGS[difficulty];
      setCurrentLanes(settings.lanes);
    }
  }, [gameStats.num_carriles, difficulty, useAI]);

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

  // useEffect(() => {
  //   if (isGamePaused || lives <= 0 || gameOver) return;
  
  //   let eventSource = null;
  //   let isConnected = false;
  
  //   const connect = () => {
  //     if (!isConnected) {
  //       eventSource = new EventSource('http://127.0.0.1:5000/controller-stream');
        
  //       eventSource.onopen = () => {
  //         console.log('SSE connection established');
  //         isConnected = true;
  //       };
  
  //       eventSource.onmessage = (event) => {
  //         const data = JSON.parse(event.data);
  //         if (data.direction && data.direction !== 'none') {
  //           const STEP = 20;
  //           setPlayerPosition(prev => {
  //             const newPos = { ...prev };
  //             const roadTop = window.innerHeight / 2 - (currentLanes * 20);
  //             const roadBottom = window.innerHeight / 2 + (currentLanes * 20);
  //             const isInRoad = prev.y >= roadTop && prev.y <= roadBottom;
  
  //             switch (data.direction) {
  //               case 'up':
  //                 setIsMovingUp(true);
  //                 if (isInRoad && !isReturning) {
  //                   // Verificamos si está intentando cruzar incorrectamente
  //                   const isValidCrossing = isInCrosswalk() && trafficLightColor === 'red';
  //                   if (!isValidCrossing) {
  //                     if (!isInCrosswalk()) {
  //                       setWarning('¡Usa el paso de cebra!');
  //                     } else if (trafficLightColor !== 'red') {
  //                       setWarning('¡Espera a que el semáforo esté en rojo!');
  //                     }
  //                     loseLife();
  //                     setIsReturning(true);
  //                     setTimeout(() => {
  //                       setPlayerPosition({ x: prev.x, y: window.innerHeight - 150 });
  //                       setIsReturning(false);
  //                     }, 100);
  //                     return prev;
  //                   }
  //                 }
  //                 newPos.y = Math.max(0, prev.y - STEP);
  //                 break;
  //               case 'down':
  //                 setIsMovingUp(false);
  //                 newPos.y = Math.min(window.innerHeight - 60, prev.y + STEP);
  //                 break;
  //               case 'left':
  //                 newPos.x = Math.max(0, prev.x - STEP);
  //                 break;
  //               case 'right':
  //                 newPos.x = Math.min(window.innerWidth - 60, prev.x + STEP);
  //                 break;
  //             }
  //             return newPos;
  //           });
  //         }
  //       };
  
  //       eventSource.onerror = (error) => {
  //         console.error('SSE connection error:', error);
  //         isConnected = false;
  //         eventSource.close();
  //         setTimeout(connect, 1000);
  //       };
  //     }
  //   };
  
  //   connect();
  
  //   return () => {
  //     if (eventSource) {
  //       isConnected = false;
  //       eventSource.close();
  //     }
  //   };
  // }, [isGamePaused, lives, gameOver, currentLanes, isReturning, trafficLightColor, isInCrosswalk, loseLife]);

  useEffect(() => {
    if (isGamePaused || lives <= 0 || gameOver) return;

    const handleKeyPress = (event) => {
      const STEP = 20;
      
      setPlayerPosition(prev => {
        const newPos = { ...prev };
        // Ajustamos el cálculo de la zona de la carretera
        const roadTop = window.innerHeight / 2 - (currentLanes); // Aumentamos el área
        const roadBottom = window.innerHeight / 2 + (currentLanes * 30);
        const isInRoad = prev.y >= roadTop - STEP && prev.y <= roadBottom + STEP; // Añadimos un margen

        switch (event.key) {
          case 'ArrowUp':
            setIsMovingUp(true);
                  if (isInRoad && !isReturning) {
                    // Verificamos si está intentando cruzar incorrectamente
                    const isValidCrossing = isInCrosswalk() && trafficLightColor === 'red';
                    if (!isValidCrossing) {
                      if (!isInCrosswalk()) {
                        setWarning('¡Usa el paso de cebra!');
                      } else if (trafficLightColor !== 'red') {
                        setWarning('¡Espera a que el semáforo esté en rojo!');
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
          default:
            return prev;
        }
        return newPos;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
  
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
}, [isGamePaused, lives, gameOver, currentLanes, isReturning, trafficLightColor, isInCrosswalk, loseLife]);
  
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

// Solo modificamos la parte relevante del useEffect para el spawn de vehículos
useEffect(() => {
  if (isGamePaused || lives <= 0 || gameOver) {
      console.log('Game is paused, over, or no lives');
      return;
  }
  
  const settings = DIFFICULTY_SETTINGS[difficulty];
  // const speed = kmhToPixels(settings.vehicleSpeed);
  const speed = kmhToPixels(useAI ? gameStats.velocidad_vehiculos : settings.vehicleSpeed);
  const spawnRate = useAI ? 2500 : settings.spawnRate;
  const MAX_VEHICLES = 1000; // Máximo de vehículos en pantalla

  console.log('Setting up vehicle system:', {
      difficulty,
      speed,
      spawnRate: settings.spawnRate,
      currentLanes,
      maxVehicles: MAX_VEHICLES
  });

  const spawnVehicle = () => {
      setVehicles(prev => {
          // Si ya hay el máximo de vehículos, no spawneamos más
          if (prev.length >= MAX_VEHICLES) {
              return prev;
          }

          console.log('Attempting to spawn vehicle');
          const laneIndex = Math.floor(Math.random() * currentLanes);
          const direction = 'right';
          const startX = -100;
          // const laneY = window.innerHeight / 2 + (laneIndex - (currentLanes - 1) / 2) * 80;
          const laneY = window.innerHeight / 2 + (laneIndex - (currentLanes - 1) / 2) * 20;
          
          // Solo spawneamos si no hay otro vehículo cerca en el mismo carril
          const hasNearbyVehicle = prev.some(vehicle => 
              vehicle.lane === laneIndex && 
              Math.abs(vehicle.x - startX) < 200
          );

          if (!hasNearbyVehicle) {
              return [...prev, {
                  id: Date.now(),
                  x: startX,
                  y: laneY,
                  direction,
                  speed,
                  lane: laneIndex
              }];
          }
          return prev;
      });
  };

  const moveVehicles = () => {
      setVehicles(prev => {
          if (prev.length === 0) return prev;
          
          return prev
              .map(vehicle => {
                  let newX = vehicle.x;
                  
                  if (trafficLightColor === 'red') {
                      const stopDistance = 100;
                      const shouldStop = vehicle.x < crosswalkPosition - stopDistance;
                      
                      if (!shouldStop) {
                          newX = vehicle.x + vehicle.speed;
                      }
                  } else {
                      newX = vehicle.x + vehicle.speed;
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

  // Intervalo de spawn más largo
  const spawnInterval = setInterval(spawnVehicle, spawnRate);
  const moveInterval = setInterval(moveVehicles, 16);

  return () => {
      console.log('Cleaning up vehicle intervals');
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
  };
}, [isGamePaused, lives, gameOver, difficulty, crosswalkPosition, currentLanes, trafficLightColor, useAI]);
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
        setPlayerPosition({ x: 550, y: window.innerHeight - 150 });
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
    gameStats,
    useAI,
    setUseAI
  };
};

export default useGameLogic;