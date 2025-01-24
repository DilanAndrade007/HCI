import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animaciones
const float = keyframes`
  0% { transform: translateY(0) rotateY(0); }
  50% { transform: translateY(-4px) rotateY(1deg); }
  100% { transform: translateY(0) rotateY(0); }
`;

const glowAnimation = keyframes`
  0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3)); }
  50% { filter: brightness(1.2) drop-shadow(0 0 8px rgba(255, 255, 255, 0.5)); }
`;

const wheelSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Contenedores y componentes del vehículo
const VehicleWrapper = styled.div`
  position: absolute;
  width: 90px; /* Vehículo más pequeño */
  height: 50px; /* Vehículo más pequeño */
  transition: all 0.2s ease-out;
  animation: ${float} 1s infinite ease-in-out;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const CarBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
`;

const MainBody = styled.div`
  height: 35px;
  background: linear-gradient(135deg, #FF4E50, #F9D423);
  border-radius: 10px;
  position: relative;
  transform-style: preserve-3d;
  box-shadow: 
    0 5px 15px rgba(0, 0, 0, 0.3),
    inset 0 -5px 10px rgba(0, 0, 0, 0.2),
    inset 0 5px 10px rgba(255, 255, 255, 0.4);
  animation: ${glowAnimation} 2s infinite ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 45%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 10px 10px 0 0;
  }
`;

const Hood = styled.div`
  position: absolute;
  width: 20px;
  height: 15px;
  background: linear-gradient(135deg, #FF4E50, #F9D423);
  top: -7px;
  left: 5px;
  border-radius: 5px;
  transform: skewX(-15deg);
  box-shadow: 
    inset -2px -2px 5px rgba(0, 0, 0, 0.2),
    inset 2px 2px 5px rgba(255, 255, 255, 0.3);
`;

const Windshield = styled.div`
  position: absolute;
  width: 30px;
  height: 18px;
  background: linear-gradient(135deg, #74ebd5, #ACB6E5);
  top: -5px;
  left: 25px;
  border-radius: 8px 10px 0 0;
  transform: skewX(-25deg);
  box-shadow: 
    inset -2px -2px 5px rgba(0, 0, 0, 0.2),
    inset 2px 2px 5px rgba(255, 255, 255, 0.4);
`;

const Wheel = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #333, #666);
  border-radius: 50%;
  bottom: -5px;
  box-shadow: 
    inset -2px -2px 4px rgba(0, 0, 0, 0.6),
    inset 2px 2px 4px rgba(255, 255, 255, 0.2),
    0 0 10px rgba(0, 0, 0, 0.5);
  animation: ${wheelSpin} 0.5s linear infinite;

  &::before {
    content: '';
    position: absolute;
    width: 60%;
    height: 60%;
    top: 20%;
    left: 20%;
    background: radial-gradient(circle at center, #777, #444);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: 30%;
    height: 30%;
    top: 35%;
    left: 35%;
    background: #222;
    border-radius: 50%;
  }
`;

const FrontWheel = styled(Wheel)`
  left: 5px;
`;

const BackWheel = styled(Wheel)`
  right: 5px;
`;

const Lights = styled.div`
  position: absolute;
  width: ${props => props.isBack ? '10px' : '12px'};
  height: ${props => props.isBack ? '10px' : '12px'};
  background: ${props => props.isBack ? 
    'linear-gradient(135deg, #ff4757, #ff6b81)' : 
    'linear-gradient(135deg, #ffd32a, #fffa65)'};
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.isBack ? 'right: -5px;' : 'left: -5px;'}
  box-shadow: 
    0 0 10px ${props => props.isBack ? '#ff4757' : '#ffd32a'},
    0 0 20px ${props => props.isBack ? 'rgba(255, 71, 87, 0.5)' : 'rgba(255, 211, 42, 0.5)'};
  animation: ${glowAnimation} 1s infinite ease-in-out;
`;

const Shadow = styled.div`
  position: absolute;
  bottom: -15px;
  left: 10%;
  width: 80%;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  filter: blur(4px);
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
