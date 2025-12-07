import React from "react";
import { Link } from "react-router-dom";
import "../styles/home_style.css";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import type { AppDispatch } from "../store";
import { logout } from "../store/authSlice";


const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <header>
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Logo" />
            </Link>
          </div>
          
          <div className="nav-links">
            <span className="nav-link active">Главная</span>
            <Link to="/planets" className="nav-link">Планеты</Link>
            <Link to="/requests" className="nav-link">Заявки</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">{user?.login}</Link>
                <button className="nav-link" onClick={() => dispatch(logout())}>
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Войти</Link>
            )}
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
