import React from "react";
import { Carousel } from "react-bootstrap";
import "../styles/home_style.css";
import Navbar from "../components/Navbar"
// import { useDispatch } from "react-redux";
// import { useAuth } from "../hooks/useAuth";
// import type { AppDispatch } from "../store";
// import { logout } from "../store/authSlice";


const HomePage: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
  // const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <header>
        <div className="header-container">          
          <Navbar />
        </div>
      </header>
      
      <div className="navigation-bar">
      </div>

      <main className="home-container">
        <h1 className="home-title">Добро пожаловать!</h1>

        <Carousel className="home-carousel">
          <Carousel.Item>
            <div className="carousel-slide description-slide">
              <h2>О проекте</h2>
              <p>
                Сайт предназначен для астрономических расчетов и позволяет вычислить 
                температуру экзопланеты на основе типа ее звезды и типа экзопланеты.
              </p>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carousel-slide instructions-slide">
              <h2>Инструкция по использованию</h2>
              <ol>
                <li>Перейти в раздел "Планеты"</li>
                <li>Выберите интересующие вас экзопланеты</li>
                <li>Изучите информацию о них</li>
                <li>Создайте заявку на расчет температуры на них, введя информацию о звезде системы</li>
              </ol>
            </div>
          </Carousel.Item>
        </Carousel>
      </main>
    </div>
  );
};

export default HomePage;
