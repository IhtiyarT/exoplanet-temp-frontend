import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/planet_style.css";
import { logout } from "../store/authSlice";
import { useAuth } from "../hooks/useAuth";
import type { AppDispatch } from "../store";
import { useDispatch } from "react-redux";

export interface Planet {
  planet_id: number;
  planet_title: string;
  planet_description?: string;
  planet_image?: string | null;
  albedo?: number;
}

const PlanetPage: React.FC = () => {
  const { planet_id } = useParams<{ planet_id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();

  const [planet, setPlanet] = useState<Planet | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPlanet = async () => {
      if (!planet_id) {
        setError(true);
        return;
      }

      try {
        setError(false);

        const response = await api.api.planetDetail(Number(planet_id));

        const data = response.data;
        const planetData = "planet" in data ? data.planet : data;

        setPlanet(planetData as Planet);
      } catch (err) {
        console.error("Ошибка загрузки планеты:", err);
        setError(true);
      }
    };

    loadPlanet();
  }, [planet_id]);

  if (error || !planet) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2>Планета не найдена</h2>
        <img
          src="/DefaultImage.jpg"
          alt="Планета не найдена"
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "10px",
            marginTop: "20px",
            objectFit: "cover",
          }}
        />
      </div>
    );
  }

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
            <Link to="/" className="nav-link">Главная</Link>
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

      <div className="navigation-bar"></div>

      <nav style={{ padding: "10px 20px" }} aria-label="breadcrumb">
        <Link to="/">Главная</Link> &nbsp;/&nbsp;
        <Link to="/planets">Планеты</Link> &nbsp;/&nbsp;
        <span>{planet.planet_title}</span>
      </nav>

      <div className="planet-container">
        <div className="planet-image">
          <img
            src={getImageUrl(planet.planet_image)}
            alt={planet.planet_title}
          />
        </div>
        <div className="planet-details">
          <h1 className="title">{planet.planet_title}</h1>
          <p>{planet.planet_description || "Описание отсутствует"}</p>
          <p>
            Среднее значение альбедо —{" "}
            <strong>{planet.albedo !== undefined ? planet.albedo : "неизвестно"}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanetPage;