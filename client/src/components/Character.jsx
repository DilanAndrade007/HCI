import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const CharacterWrapper = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  transition: all 0.1s ease;
  animation: ${bounce} 1s infinite ease-in-out;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 10px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
  }
`;

const Character = ({ position = { x: 0, y: 0 } }) => {
  const [avatarEmoji, setAvatarEmoji] = useState('👦');

  useEffect(() => {
    const selectedAvatar = localStorage.getItem('playerAvatar');
    
    // Asignar el emoji según el avatar seleccionado
    switch(selectedAvatar) {
      case 'boy':
        setAvatarEmoji('👦');
        break;
      case 'girl':
        setAvatarEmoji('👧');
        break;
      case 'student':
        setAvatarEmoji('🧑‍🎓');
        break;
      default:
        setAvatarEmoji('👦');
    }
  }, []);

  return (
    <CharacterWrapper
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {avatarEmoji}
    </CharacterWrapper>
  );
};

export default Character;