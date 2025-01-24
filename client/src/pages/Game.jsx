import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';
import { useGameLogic } from '../hooks/useGameLogic';
import Character from '../components/Character';
import TrafficLight from '../components/TrafficLight';
import Vehicle from '../components/Vehicle';

const ScorePanel = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.color || '#333'};
  gap: 8px;
`;

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #e0f7ff 100%);
  position: relative;
  overflow: hidden;
`;

const Road = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => props.lanes * 40}px;
  background: #454545;
  top: 50%;
  transform: translateY(-50%);
  border-top: 4px solid white;
  border-bottom: 4px solid white;
  transition: height 0.3s ease-out;
`;

const RoadLine = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  background: white;
  opacity: 0.5;
  top: ${props => props.top}%;
`;

const CrosswalkContainer = styled.div`
  position: absolute;
  width: 200px;
  height: 100%;
  left: ${props => props.position}px;
  transform: translateX(-50%);
  z-index: 1;
  transition: left 0.3s ease-out;
`;

const Crosswalk = styled.div`
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    white 0px,
    white 20px,
    #454545 20px,
    #454545 40px
  );
  position: relative;

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 4px;
    height: 100%;
    background: white;
  }

  &::before { left: -2px; }
  &::after { right: -2px; }
`;

const TrafficLightContainer = styled.div`
  position: absolute;
  left: ${props => props.position - 180}px;
  top: calc(50% - 180px);
  z-index: 100;
  transition: left 0.3s ease-out;
`;

const ReturnButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #ff5252;
    transform: translateY(-2px);
  }
`;

const Warning = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 69, 58, 0.9);
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.2rem;
  z-index: 1000;
  text-align: center;
`;

const PauseOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PauseMenu = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;

  h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }

  button {
    margin: 10px;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    
    &:first-child {
      background: #4CAF50;
      color: white;
      &:hover { background: #45a049; }
    }
    
    &:last-child {
      background: #ff6b6b;
      color: white;
      &:hover { background: #ff5252; }
    }
  }
`;

const Game = () => {
  const navigate = useNavigate();
  const { score, lives, resetGame } = useGame();
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
    isReturning
  } = useGameLogic();

  const handleReturn = () => {
    if (window.confirm('¿Estás seguro que quieres volver al menú? Perderás tu progreso.')) {
      resetGame();
      navigate('/menu');
    }
  };

  const renderLanes = () => {
    const lanes = [];
    for (let i = 1; i < currentLanes; i++) {
      lanes.push(
        <RoadLine key={i} top={(i * 100) / currentLanes} />
      );
    }
    return lanes;
  };

  console.log('Rendering Game with lanes:', currentLanes); // Debug

  return (
    <GameContainer>
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
      </ScorePanel>

      <ReturnButton onClick={handleReturn}>
        Volver al Menú 🏠
      </ReturnButton>

      <Road lanes={currentLanes}>
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
          direction={vehicle.direction}
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
  );
};

export default Game;