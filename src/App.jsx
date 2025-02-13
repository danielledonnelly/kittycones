import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Game from "./Game";
import GameOver from "./GameOver";

function App() {
  return (
    <div className="app-container">
      <img
        src="/assets/background.png"
        alt="Background"
        className="home-background"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-over" element={<GameOver />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
