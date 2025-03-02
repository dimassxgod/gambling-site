import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Games from "./pages/games";
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">🏠 Главная</Link> | 
        <Link to="/games">🎰 Игры</Link> | 
        <Link to="/profile">👤 Профиль</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
