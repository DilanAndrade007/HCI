import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animaciones
const float = keyframes`
  0% { transform: translateY(0) rotateY(0); }
  50% { transform: translateY(-2px) rotateY(1deg); }
  100% { transform: translateY(0) rotateY(0); }
`;

const glowAnimation = keyframes`
  0%, 100% { filter: brightness(1) drop-shadow(0 0 3px rgba(255, 255, 255, 0.3)); }
  50% { filter: brightness(1.2) drop-shadow(0 0 5px rgba(255, 255, 255, 0.5)); }
`;

const wheelSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Contenedor del vehículo reducido
const VehicleWrapper = styled.div`
  position: absolute;
  width: 30px; /* Reducción proporcional */
  height: 20px; /* Reducción proporcional */
  transition: all 0.2s ease-out;
  animation: ${float} 1s infinite ease-in-out;
  transform-style: preserve-3d;
  perspective: 500px;
`;

const CarBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const MainBody = styled.div`
  height: 18px;
  background: linear-gradient(135deg, #FF4E50, #F9D423);
  border-radius: 5px;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: 
    0 2px 7px rgba(0, 0, 0, 0.3),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2),
    inset 0 2px 5px rgba(255, 255, 255, 0.4);
  animation: ${glowAnimation} 2s infinite ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 5px 5px 0 0;
  }
`;

const Hood = styled.div`
  position: absolute;
  width: 10px;
  height: 8px;
  background: linear-gradient(135deg, #FF4E50, #F9D423);
  top: -3px;
  left: 3px;
  border-radius: 3px;
  transform: skewX(-15deg);
`;

const Windshield = styled.div`
  position: absolute;
  width: 15px;
  height: 9px;
  background: linear-gradient(135deg, #74ebd5, #ACB6E5);
  top: -2px;
  left: 12px;
  border-radius: 5px 6px 0 0;
  transform: skewX(-25deg);
`;

const Wheel = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #333, #666);
  border-radius: 50%;
  bottom: -3px;
  animation: ${wheelSpin} 0.5s linear infinite;
`;

const FrontWheel = styled(Wheel)`
  left: 2px;
`;

const BackWheel = styled(Wheel)`
  right: 2px;
`;

const Lights = styled.div`
  position: absolute;
  width: ${props => props.isBack ? '5px' : '6px'};
  height: ${props => props.isBack ? '5px' : '6px'};
  background: ${props => props.isBack ? 
    'linear-gradient(135deg, #ff4757, #ff6b81)' : 
    'linear-gradient(135deg, #ffd32a, #fffa65)'};
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.isBack ? 'right: -3px;' : 'left: -3px;'}
`;

const Shadow = styled.div`
  position: absolute;
  bottom: -7px;
  left: 10%;
  width: 80%;
  height: 5px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(2px);
  animation: ${float} 1s infinite ease-in-out reverse;
`;

const Vehicle = ({ position = { x: 0, y: 0 }, direction = 'right' }) => {
  return (
    <VehicleWrapper
      style={{
        left: position.x,
        top: position.y,
        transform: direction === 'left' ? 'scaleX(-1)' : 'none'
      }}
    >
      <CarBody>
        <MainBody>
          <Hood />
          <Windshield />
          <Lights isBack={false} />
          <Lights isBack={true} />
        </MainBody>
        <FrontWheel />
        <BackWheel />
        <Shadow />
      </CarBody>
    </VehicleWrapper>
  );
};

export default Vehicle;
