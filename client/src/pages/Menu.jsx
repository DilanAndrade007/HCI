import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Animación de las nubes para que se muevan lateralmente
const cloudFloat = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(20px); }
  100% { transform: translateX(0); }
`;

const MenuContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
  rgba(70, 130, 180, 1),   /* Azul acero más oscuro */
  rgba(135, 206, 250, 0.9), /* Azul cielo claro */
  rgba(176, 224, 230, 0.8), /* Azul pálido */
  rgba(240, 248, 255, 1)   /* Azul casi blanco */
);

  background-size: 300% 300%;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
`;

// Nubes que se mueven de forma independiente
const CloudDecoration = styled.div`
  position: absolute;
  font-size: ${props => props.size || '4rem'};
  color: rgba(255, 255, 255, 0.8);
  animation: ${cloudFloat} ${props => props.duration || '10s'} ease-in-out infinite;
  opacity: 0.7;

  &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
  &:nth-child(2) { top: 20%; right: 15%; animation-delay: 1s; }
  &:nth-child(3) { bottom: 10%; left: 20%; animation-delay: 2s; }
  &:nth-child(4) { top: 25%; left: 60%; animation-delay: 3s; font-size: 5rem; }
  &:nth-child(5) { bottom: 20%; right: 5%; animation-delay: 4s; font-size: 6rem; }
`;

const MenuTitle = styled.h1`
  font-size: 3.5rem;
  color: #fff;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
`;

const MenuCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  position: relative;
  z-index: 1;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 20px;
  margin: 15px 0;
  font-size: 1.5rem;
  border: none;
  border-radius: 15px;
  background: ${props => props.color || '#ffd93d'};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Menu = () => {
  const navigate = useNavigate();

  return (
    <MenuContainer>
      {/* Nubes animadas */}
      <CloudDecoration size="4rem" duration="12s">☁️</CloudDecoration>
      <CloudDecoration size="5rem" duration="14s">☁️</CloudDecoration>
      <CloudDecoration size="6rem" duration="16s">⛅</CloudDecoration>
      <CloudDecoration size="4rem" duration="10s">☁️</CloudDecoration>
      <CloudDecoration size="7rem" duration="18s">☁️</CloudDecoration>
      <CloudDecoration size="6rem" duration="20s">⛅</CloudDecoration>

      <MenuTitle>¡Menú Principal! 🎮</MenuTitle>

      <MenuCard>
        <MenuButton 
          onClick={() => navigate('/informacion')}
          color="#ff9f43"
        >
          <span>ℹ️</span> Información
        </MenuButton>
        
        <MenuButton 
          onClick={() => navigate('/como-jugar')}
          color="#ff6b6b"
        >
          <span>📖</span> Cómo Jugar
        </MenuButton>
        
        <MenuButton 
          onClick={() => navigate('/juego')}
          color="#4834d4"
        >
          <span>🎮</span> ¡Jugar!
        </MenuButton>
        
        <MenuButton 
          onClick={() => navigate('/')}
          color="#6c5ce7"
        >
          <span>🏠</span> Volver al Inicio
        </MenuButton>
      </MenuCard>
    </MenuContainer>
  );
};

export default Menu;
