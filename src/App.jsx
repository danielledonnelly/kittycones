import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Game from "./Game";
import About from "./About";
import GameOver from "./GameOver";
import Leaderboard from "./Leaderboard";

function App() {
  return (
    <div className="app-container">
      <img
        src="/assets/background.png"
        alt="Background"
        className="home-background"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/about" element={<About />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </div>
  );
}

export default App;