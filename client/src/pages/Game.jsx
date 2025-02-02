import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useGameLogic } from '../hooks/useGameLogic';
import Character from '../components/Character';
import TrafficLight from '../components/TrafficLight';
import Vehicle from '../components/Vehicle';

import { 
  Building, 
  Tree, 
  Person, 
  Cloud, 
  ScorePanel, 
  DifficultyMeter, 
  DifficultyBar, 
  DifficultyLabel, 
  ScoreItem, 
  GameContainer, 
  GameWrapper,
  Road, 
  RoadLine, 
  CrosswalkContainer, 
  Crosswalk, 
  TrafficLightContainer, 
  ReturnButton, 
  Warning, 
  PauseOverlay, 
  PauseMenu,
  GrassBackground,
  AIToggleButton,
  Scenery
} from "../styles/GameStyles.jsx"

const Game = () => {
  const navigate = useNavigate();
  const { score, lives, resetGame, gameOver } = useGame(); 
  const {
    playerPosition,
    vehicles,
    trafficLightColor,
    countdown,
    isGamePaused,
    setIsGamePaused,
    warning,
    currentLanes,
    crosswalkPosition,
    isReturning,
    difficulty,
    gameStats,
    useAI,
    setUseAI
  } = useGameLogic();

  const handleReturn = () => {
    if (window.confirm('¿Estás seguro que quieres volver al menú? Perderás tu progreso.')) {
      resetGame();
      navigate('/menu');
    }
  };

  const renderLanes = () => {
    const lanes = [];
    // Renderizar líneas para todos los carriles posibles (6 carriles = 5 líneas)
    for (let i = 1; i < 6; i++) {
      lanes.push(
        <RoadLine 
          key={i} 
          index={i} 
          totalLanes={6} // Siempre usamos 6 como total de carriles
        />
      );
    }
    return lanes;
  };

  useEffect(() => {
    if (gameOver) {
      navigate('/game-over');
    }
  }, [gameOver, navigate]);

  const renderScenery = () => (
    <>
      {/* Buildings */}
      <Building color="#78909C" width={150} height={200} left={50} />
      <Building color="#90A4AE" width={120} height={180} left={250} />
      <Building color="#B0BEC5" width={180} height={220} left={800} />
      <Building color="#78909C" width={140} height={190} left={1050} />
      <Building color="#78909C" width={140} height={190} left={1250} />
      <Building color="#B0BEC5" width={180} height={220} left={1350} />
      <Building color="#78909C" width={140} height={190} left={1450} />
      <Building color="#B0BEC5" width={180} height={220} left={1550} />
      
      {/* Trees */}
      {[100, 300, 600, 900, 1200, 1350, 1550, 1750].map((left, i) => (
        <Tree key={i} left={left} />
      ))}
      
      {/* People */}
      {[200, 400, 700, 1000].map((left, i) => (
        <Person 
          key={i} 
          left={left} 
          color={['#FFA726', '#EF5350', '#7E57C2', '#26C6DA'][i]}
        />
      ))}
      
      {/* Clouds */}
      {[100, 300, 600, 900, 1300, 1500].map((left, i) => (
        <Cloud 
          key={i} 
          top={50 + (i * 30)} 
          left={left} 
          speed={3 + i} 
        />
      ))}
    </>
  );

  return (
    <GameWrapper>
      <GameContainer>
        {renderScenery()}
        
        <ScorePanel>
          <ScoreItem>
            <span>🏆</span> Puntos: {score}
          </ScoreItem>
          <ScoreItem color="#ff4757">
            <span>❤️</span> Vidas: {lives}
          </ScoreItem>
          <ScoreItem>
            <span>🎮</span> Nivel: {Math.floor(score / 100) + 1}
          </ScoreItem>

          <DifficultyMeter>
          {useAI && (
            <DifficultyLabel>
              <span>Dificultad IA:</span>
              <span>{difficulty.toFixed(1)}/10</span>
            </DifficultyLabel>
          )}
          <DifficultyBar value={difficulty}>
            <div />
          </DifficultyBar>
          <DifficultyLabel>
            <small>Carriles: {currentLanes}</small>
            <small>Vel: {Math.round(gameStats?.velocidad_vehiculos || 0)} km/h</small>
          </DifficultyLabel>
        </DifficultyMeter>
        </ScorePanel>

        <ReturnButton onClick={handleReturn}>
          Volver al Menú 🏠
        </ReturnButton>
        <AIToggleButton 
          onClick={() => setUseAI(!useAI)} 
          active={useAI}
        >
          Modo IA: {useAI ? '🤖 ON' : '⚙️ OFF'}
        </AIToggleButton>

        <Road lanes={currentLanes}>
          <GrassBackground lanes={currentLanes} />
          {renderLanes()}
          <CrosswalkContainer position={crosswalkPosition}>
            <Crosswalk />
          </CrosswalkContainer>
        </Road>

        <TrafficLightContainer position={crosswalkPosition}>
          <TrafficLight color={trafficLightColor} countdown={countdown} />
        </TrafficLightContainer>

        <Character position={playerPosition} isReturning={isReturning} />

        {vehicles.map(vehicle => (
          <Vehicle
            key={vehicle.id}
            position={{ x: vehicle.x, y: vehicle.y }}
          />
        ))}

        {warning && <Warning>{warning}</Warning>}

        {isGamePaused && (
          <PauseOverlay>
            <PauseMenu>
              <h2>Juego Pausado</h2>
              <button onClick={() => setIsGamePaused(false)}>Continuar</button>
              <button onClick={handleReturn}>Volver al Menú</button>
            </PauseMenu>
          </PauseOverlay>
        )}
      </GameContainer>
    </GameWrapper>
  );
};

export default Game;