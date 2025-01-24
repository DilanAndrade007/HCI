import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
   background: linear-gradient(
    135deg,
    rgba(70, 130, 180, 1),
    rgba(135, 206, 250, 0.9),
    rgba(176, 224, 230, 0.8),
    rgba(240, 248, 255, 1)
  );
  font-family: 'Poppins', sans-serif;
  position: relative;
  overflow: hidden;
`;

const Cloud = styled.div`
  position: absolute;
  font-size: ${props => props.size || '4rem'};
  color: rgba(255, 255, 255, 0.8);
  animation: ${float} ${props => props.duration || '3s'} ease-in-out infinite;
  z-index: 1;
  top: ${props => props.top};
  left: ${props => props.left};
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #FF6B6B;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: ${bounce} 2s infinite;
  position: relative;
  z-index: 2;

  span {
    display: block;
    font-size: 2.5rem;
    color: #FFD93D;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  position: relative;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 10px;
    background: linear-gradient(90deg, #ff6b6b, #ffd93d, #6c5ce7, #a8e6cf);
    border-radius: 30px 30px 0 0;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 30px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  font-size: 1.5rem;
  color: #333;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 1.8rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 1.3rem;
  border: 4px solid #6c5ce7;
  border-radius: 15px;
  background: #fff;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b6b;
    box-shadow: 0 0 20px rgba(108, 92, 231, 0.2);
    transform: scale(1.02);
  }
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 15px;
`;

const AvatarOption = styled.div`
  border: 4px solid ${props => props.selected ? '#FFD93D' : '#e0e0e0'};
  border-radius: 20px;
  padding: 15px;
  cursor: pointer;
  text-align: center;
  background: ${props => props.selected ? '#FFF3F3' : '#FFFFFF'};
  transition: all 0.3s ease;
  transform: ${props => props.selected ? 'scale(1.1)' : 'scale(1)'};
  box-shadow: ${props =>
    props.selected ? '0 8px 16px rgba(255, 215, 61, 0.4)' : 'none'};

  &:hover {
    transform: ${props => !props.selected && 'scale(1.05)'};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }

  .avatar-emoji {
    font-size: 4rem;
    margin-bottom: 8px;
    animation: ${float} 2s ease-in-out infinite;
  }

  .avatar-name {
    font-size: 1.3rem;
    color: #333;
    font-weight: bold;
  }
`;

const StartButton = styled.button`
  width: 100%;
  padding: 20px;
  font-size: 1.8rem;
  border: none;
  border-radius: 25px;
  background: linear-gradient(145deg, #FF6B6B, #FFD93D);
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(255, 107, 107, 0.6);
  }

  &::after {
    content: '🎮';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [error, setError] = useState('');

  const avatars = [
    { id: 'niño', emoji: '👦', name: 'Niño' },
    { id: 'niña', emoji: '👧', name: 'Niña' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || age < 3 || age > 12) {
      setError('¡Tu edad debe estar entre 3 y 12 años! 🎈');
      return;
    }
    if (!selectedAvatar) {
      setError('¡Elige tu personaje favorito! 🌟');
      return;
    }
    localStorage.setItem('playerAge', age);
    localStorage.setItem('playerAvatar', selectedAvatar);
    navigate('/menu');
  };

  return (
    <HomeContainer>
      <Cloud top="10%" left="10%" duration="3s">☁️</Cloud>
      <Cloud top="20%" left="80%" size="5rem" duration="4s">⛅</Cloud>
      <Cloud top="70%" left="15%" size="3rem" duration="3.5s">☁️</Cloud>
      <Cloud top="60%" left="75%" size="4rem" duration="4.5s">☁️</Cloud>

      <Title>
        ¡Crucemos la Calle
        <span>de Forma Segura! 🚦</span>
      </Title>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            <span>🎂</span> ¿Cuántos años tienes?
          </Label>
          <Input
            type="number"
            min="3"
            max="12"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setError('');
            }}
            placeholder="Tu edad"
          />
        </FormGroup>

        <FormGroup>
          <Label>
            <span>🌟</span> Elige tu personaje:
          </Label>
          <AvatarGrid>
            {avatars.map((avatar) => (
              <AvatarOption
                key={avatar.id}
                selected={selectedAvatar === avatar.id}
                onClick={() => {
                  setSelectedAvatar(avatar.id);
                  setError('');
                }}
              >
                <div className="avatar-emoji">{avatar.emoji}</div>
                <div className="avatar-name">{avatar.name}</div>
              </AvatarOption>
            ))}
          </AvatarGrid>
        </FormGroup>

        {error && <p style={{ color: '#FF6B6B', textAlign: 'center' }}>{error}</p>}

        <StartButton type="submit">
          ¡A Jugar!
        </StartButton>
      </Form>
    </HomeContainer>
  );
};

export default Home;
