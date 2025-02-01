import styled, { keyframes } from 'styled-components';

export const Building = styled.div`
  position: absolute;
  background: ${props => props.color};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  bottom: 0;
  left: ${props => props.left}px;
  z-index: 1;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent 0,
      transparent 30px,
      rgba(255,255,255,0.1) 30px,
      rgba(255,255,255,0.1) 40px
    );
  }
`;

export const Tree = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.left}px;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 40px;
    background: #5D4037;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 60px;
    background: #2E7D32;
    border-radius: 50%;
  }
`;

export const Person = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.left}px;
  width: 20px;
  height: 40px;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 15px;
    width: 20px;
    height: 20px;
    background: ${props => props.color};
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 20px;
    height: 25px;
    background: ${props => props.color};
  }
`;

export const Cloud = styled.div`
  position: absolute;
  width: 100px;
  height: 40px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
  }
  
  &::before {
    width: 50px;
    height: 50px;
    top: -20px;
    left: 15px;
  }
  
  &::after {
    width: 40px;
    height: 40px;
    top: -10px;
    right: 15px;
  }
`;

export const ScorePanel = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
`;

export const DifficultyMeter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const DifficultyBar = styled.div`
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  
  div {
    height: 100%;
    width: ${props => (props.value * 10)}%;
    background: ${props => {
      if (props.value <= 3) return '#4CAF50';
      if (props.value <= 6) return '#FFC107';
      return '#FF5252';
    }};
    transition: all 0.3s ease;
  }
`;

export const DifficultyLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  display: flex;
  justify-content: space-between;
`;

export const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: ${props => props.color || '#333'};
  gap: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  span {
    font-size: 1.5rem;
  }
`;

export const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(180deg, #87CEEB 0%, #e0f7ff 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpIi8+PC9zdmc+');
    opacity: 0.5;
    pointer-events: none;
  }
`;




export const Road = styled.div`
  position: absolute;
  width: 100%;
  height: ${props => props.lanes * 40}px;
  background: #454545;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid rgb(73, 113, 103);
  border-bottom: 6px solid rgb(73, 113, 102);
  transition: height 0.3s ease-out;
  box-shadow: 0 0 30px rgba(58, 109, 120, 0.2);
`;

export const RoadLine = styled.div`
  position: absolute;
  width: 100%;
  height: 4px;
  background: white;
  opacity: 0.7;
  top: ${props => props.top}%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

export const CrosswalkContainer = styled.div`
  position: absolute;
  width: 200px;
  height: 100%;
  left: ${props => props.position}px;
  transform: translateX(-50%);
  z-index: 1;
  transition: left 0.3s ease-out;
`;

export const Crosswalk = styled.div`
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.95) 0px,
    rgba(255, 255, 255, 0.95) 20px,
    #454545 20px,
    #454545 40px
  );
  position: relative;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);

  &::before, &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 6px;
    height: 100%;
    background:rgb(255, 255, 255);
    box-shadow: 0 0 10px rgba(57, 56, 51, 0.5);
  }

  &::before { left: -3px; }
  &::after { right: -3px; }
`;

export const TrafficLightContainer = styled.div`
  position: absolute;
  left: calc(100% - 900px);
  top: calc(100% - 750px);
  transform: translateX(-50%);
  z-index: 100;
  transition: all 0.3s ease-out;
`;

export const ReturnButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff6b6b, #ff5252);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
`;

export const Warning = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, rgba(255, 69, 58, 0.95), rgba(255, 45, 85, 0.95));
  color: white;
  padding: 20px 40px;
  border-radius: 15px;
  font-size: 1.3rem;
  z-index: 1000;
  text-align: center;
  box-shadow: 0 8px 25px rgba(255, 69, 58, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
`
export const PauseOverlay = styled.div`
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

export const PauseMenu = styled.div`
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
    margin: 15px;
    padding: 15px 30px;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 1.3rem;
    transition: all 0.3s ease;
    border: 2px solid #FFF;
    
    &:first-child {
      background: linear-gradient(135deg, #4CAF50, #45a049);
      color: white;
      &:hover { 
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
      }
    }
    
    &:last-child {
      background: linear-gradient(135deg, #FF6B6B, #FF5252);
      color: white;
      &:hover { 
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
      }
    }
  }
`;
export const Scenery = styled.div`
  position: absolute;
  width: 100%;
  height: 50%;
  bottom: 0;
  left: 0;
  z-index: 1;
`;