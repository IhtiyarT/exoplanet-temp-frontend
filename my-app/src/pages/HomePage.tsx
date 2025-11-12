import React from "react";
import { Link } from "react-router-dom";
import "../styles/home_style.css";


const HomePage: React.FC = () => {
  return (
    <div>
      <header>
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <img src="/exoplanet-temp-frontend/logo.png" alt="Logo" />
            </Link>
          </div>
          
          <div className="nav-links">
            <span className="nav-link active">Главная</span>
            <Link to="/planets" className="nav-link">Планеты</Link>
          </div>
        </div>
      </header>
      
      <div className="navigation-bar">
      </div>

      <main className="home-container">
        <h1 className="home-title">Добро пожаловать!</h1>
        <p className="home-subtitle">
          Здесь вы можете просмотреть коллекцию экзопланет и рассчитать их температуры.
        </p>
        <Link to="/planets" className="home-button">
          Просмотреть планеты
        </Link>
      </main>
    </div>
  );
};

export default HomePage;
