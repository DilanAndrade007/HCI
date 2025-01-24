// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Information from './pages/Information';
import HowToPlay from './pages/HowToPlay';
import Game from './pages/Game';
import GameOver from './pages/GameOver';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/informacion" element={<Information />} />
          <Route path="/como-jugar" element={<HowToPlay />} />
          <Route path="/juego" element={<Game />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;