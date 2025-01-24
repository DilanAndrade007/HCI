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

const InfoContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #6C5CE7, #FFD93D, #FF6B6B);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 8s ease infinite;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '15px'};
  height: ${props => props.size || '15px'};
  background: ${props => props.color || '#FFFFFF'};
  border-radius: 50%;
  animation: ${particleAnimation} ${props => props.duration || '10s'} ease-in-out infinite;
  top: ${props => props.top || '100%'};
  left: ${props => props.left || '50%'};
  opacity: 0.8;
`;

const ContentCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  width: 90%;
  margin: 20px auto;
  position: relative;

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
    opacity: 0.7;
    border-radius: 30px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem; /* Ajuste de tamaño */
  color: #fff;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  animation: ${gradientAnimation} 3s ease-in-out infinite;

  span {
    font-size: 2rem; /* Ajuste de tamaño */
    color: #FFD93D;
    display: block;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
  }
`;

const Section = styled.div`
  margin-bottom: 30px; /* Ajuste de espacio */
  padding: 20px;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.85);
  border: 3px solid ${props => props.borderColor || '#6C5CE7'};
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem; /* Ajuste de tamaño */
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 15px;

  span {
    font-size: 2rem; /* Ajuste de tamaño */
    color: ${props => props.color || '#6C5CE7'};
  }
`;

const TrafficLightContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;

const LightInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; /* Ajuste de espacio */
  padding: 15px 20px; /* Ajuste de padding */
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  animation: ${gradientAnimation} 2s infinite alternate;
  width: 100%;
  max-width: 400px;

  .light-emoji {
    font-size: 2rem; /* Ajuste de tamaño */
  }

  .light-text {
    font-size: 1.2rem; /* Ajuste de tamaño */
    color: #333;
    flex-grow: 1;
  }
`;

const CrosswalkInfo = styled.div`
  background: rgba(108, 92, 231, 0.1);
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  margin-top: 15px;

  .zebra-pattern {
    margin: 15px 0;
    height: 50px; /* Ajuste de altura */
    background: repeating-linear-gradient(
      90deg,
      #333 0px,
      #333 20px,
      #fff 20px,
      #fff 40px
    );
    border-radius: 10px;
  }
`;

const SafetyTips = styled.ul`
  list-style: none;
  padding: 0;

  li {
    font-size: 1.2rem; /* Ajuste de tamaño */
    margin: 10px 0;
    padding: 10px;
    background: white;
    border-radius: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);

    &::before {
      content: '✅';
      font-size: 1.2rem; /* Ajuste de tamaño */
      color: #FFD93D;
    }
  }
`;

const Button = styled.button`
  padding: 10px 30px; /* Ajuste de padding */
  font-size: 1.2rem; /* Ajuste de tamaño */
  background: linear-gradient(45deg, #FF6B6B, #FFD93D);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.5s ease;
  margin-top: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-5px);
    background: linear-gradient(45deg, #6C5CE7, #00E5FF);
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.6);
  }
`;

const Information = () => {
  const navigate = useNavigate();

  return (
    <InfoContainer>
      {[...Array(20)].map((_, i) => (
        <Particle
          key={i}
          size={`${Math.random() * 15 + 10}px`}
          color={i % 2 === 0 ? '#FFD93D' : '#FFFFFF'}
          duration={`${Math.random() * 10 + 5}s`}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
        />
      ))}

      <Title>
        ¡Seguridad Vial! 🚸
        <span>¡Aprende cómo cruzar! 🦓</span>
      </Title>

      <ContentCard>
        <Section borderColor="#6C5CE7">
          <SectionTitle color="#6C5CE7">
            <span>🚦</span> El Semáforo
          </SectionTitle>
          <TrafficLightContainer>
            <LightInfo>
              <div className="light-emoji">🔴</div>
              <div className="light-text">
                <strong>ALTO:</strong> Detente y espera.
              </div>
            </LightInfo>
            <LightInfo>
              <div className="light-emoji">🟡</div>
              <div className="light-text">
                <strong>PRECAUCIÓN:</strong> Prepárate para detenerte.
              </div>
            </LightInfo>
            <LightInfo>
              <div className="light-emoji">🟢</div>
              <div className="light-text">
                <strong>AVANZA:</strong> Cruza con cuidado.
              </div>
            </LightInfo>
          </TrafficLightContainer>
        </Section>

        <Section borderColor="#FFD93D">
          <SectionTitle color="#FFD93D">
            <span>🦓</span> El Paso de Cebra
          </SectionTitle>
          <CrosswalkInfo>
            <p>Es la forma más segura de cruzar la calle. ¡Siempre úsalo!</p>
            <div className="zebra-pattern" />
            <SafetyTips>
              <li>Mira a ambos lados antes de cruzar</li>
              <li>Camina, no corras</li>
              <li>Presta atención a los semáforos</li>
              <li>Evita distracciones como el teléfono</li>
            </SafetyTips>
          </CrosswalkInfo>
        </Section>

        <Button onClick={() => navigate('/menu')}>
          🏠 Volver al Menú
        </Button>
      </ContentCard>
    </InfoContainer>
  );
};

export default Information;
