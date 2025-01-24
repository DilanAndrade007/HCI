import React from 'react';
import styled, { keyframes } from 'styled-components';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px currentColor; }
  50% { box-shadow: 0 0 10px currentColor; }
`;

const StickContainer = styled.div`
  position: absolute;
  left: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Stick = styled.div`
  width: 8px;
  height: 80px;
  background: linear-gradient(90deg, #333, #4a4a4a);
  margin-top: -3px;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
`;

const LightBox = styled.div`
  width: 35px;
  height: 90px;
  background: #333;
  border-radius: 18px;
  padding: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-shadow: 
    -3px -3px 5px rgba(255, 255, 255, 0.1),
    3px 3px 7px rgba(0, 0, 0, 0.4),
    inset 1px 1px 3px rgba(255, 255, 255, 0.1);
  border: 3px solid #404040;
`;

const Light = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.active ? props.color : '#1a1a1a'};
  animation: ${props => props.active ? glow : 'none'} 1s infinite;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    filter: blur(1px);
  }
`;

const Message = styled.div`
  position: absolute;
  left: 50px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  transform: translateX(${props => props.show ? '0' : '-20px'});
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CountdownCircle = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 0.8rem;
  font-weight: bold;
  opacity: ${props => props.show ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const TrafficLight = ({ color, countdown }) => {
  const getMessage = () => {
    switch(color) {
      case 'red': return { text: '¡PUEDES CRUZAR!', emoji: '✅', color: '#00C851' };
      case 'yellow': return { text: '¡PRECAUCIÓN!', emoji: '⚠️', color: '#ffbb33' };
      case 'green': return { text: '¡ALTO!', emoji: '🖐️', color: '#ff4444' };
      default: return { text: '', emoji: '', color: '#333' };
    }
  };

  const message = getMessage();

  return (
    <StickContainer>
      {color === 'red' && countdown > 0 && (
        <CountdownCircle show={true}>
          {countdown}
        </CountdownCircle>
      )}
      <LightBox>
        <Light 
          active={color === 'red'} 
          color="#ff4444"
        />
        <Light 
          active={color === 'yellow'} 
          color="#ffbb33"
        />
        <Light 
          active={color === 'green'} 
          color="#00C851"
        />
      </LightBox>
      <Message show={true}>
        <span>{message.emoji}</span>
        {message.text}
      </Message>
      <Stick />
    </StickContainer>
  );
};

export default TrafficLight;
