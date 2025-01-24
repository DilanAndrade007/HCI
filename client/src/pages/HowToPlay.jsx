import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const particleAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  50% { opacity: 0.7; }
  100% { transform: translateY(-100vh) translateX(20vw); opacity: 0; }
`;

const HowToPlayContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #6C5CE7, #FFD93D, #FF6B6B);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 8s ease infinite;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  position: relative;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background: ${props => props.color || '#FFFFFF'};
  border-radius: 50%;
  animation: ${particleAnimation} ${props => props.duration || '8s'} ease-in-out infinite;
  top: ${props => props.top || '100%'};
  left: ${props => props.left || '50%'};
  opacity: 0.8;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 90%;
  margin: 20px auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, #FF6B6B, #FFD93D, #6C5CE7, #00E5FF);
    z-index: -1;
    filter: blur(20px);
    opacity: 0.6;
    border-radius: 30px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  animation: ${gradientAnimation} 3s ease-in-out infinite;

  span {
    font-size: 2rem;
    color: #FFD93D;
    display: block;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid ${props => props.borderColor || '#6C5CE7'};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    font-size: 2rem;
    color: ${props => props.color || '#6C5CE7'};
  }
`;

const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 15px;
`;

const ControlKey = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .key-icon {
    font-size: 2rem;
    color: #6C5CE7;
  }

  .key-text {
    font-size: 1.2rem;
    color: #333;
    font-weight: bold;
  }
`;

const ObjectiveBox = styled.div`
  background: rgba(108, 92, 231, 0.1);
  padding: 15px;
  border-radius: 15px;
  margin-top: 15px;
  border-left: 4px solid #6C5CE7;

  p {
    font-size: 1.2rem;
    color: #333;
    line-height: 1.6;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
`;

const SafetyTips = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 217, 61, 0.15);
  border-radius: 15px;
  border-left: 4px solid #FFD93D;

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    font-size: 1.2rem;
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '✅';
      font-size: 1.2rem;
      color: #FFD93D;
    }
  }
`;

const Button = styled.button`
  padding: 10px 30px;
  font-size: 1.2rem;
  background: linear-gradient(45deg, rgb(107, 208, 255), rgb(61, 90, 255));
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.5s ease;
  margin-top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(45deg, #6C5CE7, #00E5FF);
    box-shadow: 0 6px 16px rgba(108, 92, 231, 0.6);
  }
`;

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <HowToPlayContainer>
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          size={`${Math.random() * 20 + 10}px`}
          color={i % 2 === 0 ? '#FFD93D' : '#FFFFFF'}
          duration={`${Math.random() * 10 + 5}s`}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
        />
      ))}

      <Title>
        ¿Cómo Jugar? 🎮
        <span>¡Aprende a cruzar! 🚦</span>
      </Title>

      <ContentCard>
        <Section borderColor="#6C5CE7">
          <SectionTitle color="#6C5CE7">
            <span>🎮</span> Controles
          </SectionTitle>
          <ControlGrid>
            <ControlKey>
              <div className="key-icon">⬆️</div>
              <div className="key-text">Mover Arriba</div>
            </ControlKey>
            <ControlKey>
              <div className="key-icon">⬇️</div>
              <div className="key-text">Mover Abajo</div>
            </ControlKey>
            <ControlKey>
              <div className="key-icon">⬅️</div>
              <div className="key-text">Mover Izquierda</div>
            </ControlKey>
            <ControlKey>
              <div className="key-icon">➡️</div>
              <div className="key-text">Mover Derecha</div>
            </ControlKey>
          </ControlGrid>
        </Section>

        <Section borderColor="#FFD93D">
          <SectionTitle color="#FFD93D">
            <span>🎯</span> Objetivo
          </SectionTitle>
          <ObjectiveBox>
            <p>Cruza la calle de forma segura siguiendo estas reglas:</p>
          </ObjectiveBox>
          <SafetyTips>
            <ul>
              <li>Usa siempre el paso de cebra</li>
              <li>Espera a que el semáforo esté en verde</li>
              <li>Mira a ambos lados antes de cruzar</li>
              <li>Evita distraerte con tu teléfono</li>
            </ul>
          </SafetyTips>
        </Section>

        <Button onClick={() => navigate('/menu')}>
          🏠 Volver al Menú
        </Button>
      </ContentCard>
    </HowToPlayContainer>
  );
};

export default HowToPlay;
