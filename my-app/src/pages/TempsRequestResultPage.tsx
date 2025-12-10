import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import { getImageUrl } from "../utils/imageUtils";
import "../styles/temps_request_style.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { logout } from "../store/authSlice";

interface PlanetInSystem {
  planet_id: number;
  planet_title: string;
  planet_image?: string | null;
  distance: number;
  albedo?: number | null;
  temperature: number;
}

interface SystemData {
  star_name: string;
  star_type: string;
  star_luminocity: number;
  planet_count: number;
  planets: PlanetInSystem[];
}

const RequestViewPage: React.FC = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [system, setSystem] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!systemId) {
      setError("ID заявки не указан");
      setLoading(false);
      return;
    }

    const loadSystem = async () => {
      try {
        const resp = await api.api.planetSystemPlanetsList(Number(systemId));
        const data = resp.data as SystemData;

        setSystem({
          star_name: data.star_name,
          star_type: data.star_type,
          star_luminocity: data.star_luminocity,
          planet_count: data.planet_count,
          planets: data.planets || [],
        });
      } catch (err) {
        console.error("Ошибка загрузки заявки:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSystem();
  }, [systemId, isAuthenticated, navigate]);

  if (loading) {
    return <div className="temps-loading">Загрузка заявки...</div>;
  }

  if (error || !system) {
    return <div className="temps-empty">{error || "Заявка не найдена"}</div>;
  }

  return (
    <div className="temps-request-page">
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
        <Link to="/requests">Заявки</Link> &nbsp;/&nbsp;
        <span>Просмотр заявки #{systemId}</span>
      </nav>

      <main className="temps-main">
        {/* Информация о звезде — только для чтения */}
        <div className="temps-star-info">
          <div className="temps-field-group">
            <span className="temps-label">Название звезды –</span>
            <span className="temps-value">{system.star_name || "—"}</span>
          </div>

          <div className="temps-field-group">
            <span className="temps-label">Тип звезды –</span>
            <span className="temps-value">{system.star_type || "—"}</span>
          </div>

          <div className="temps-field-group">
            <span className="temps-label">Светимость звезды –</span>
            <span className="temps-value">{system.star_luminocity}</span>
          </div>
        </div>

        <h2 className="temps-title">Заявка на расчёт температур</h2>
        <p className="temps-subtitle">Выбрано планет – {system.planet_count}</p>

        <div className="temps-cards">
          {system.planets.map((pl) => (
            <div key={pl.planet_id} className="temps-card">
              <img
                src={getImageUrl(pl.planet_image)}
                alt={pl.planet_title}
                className="temps-card-img"
              />

              <div className="temps-card-content">
                <h3 className="temps-card-title">{pl.planet_title}</h3>

                <div className="temps-card-fields">
                  <div className="temps-field">
                    <span className="temps-label">Альбедо –</span>
                    <span className="temps-value">{pl.albedo !== null && pl.albedo !== undefined ? pl.albedo : "—"}</span>
                  </div>

                  <div className="temps-field">
                    <span className="temps-label">Расстояние до звезды –</span>
                    <span className="temps-value">{pl.distance}</span>
                    <span className="temps-unit">млн км</span>
                  </div>

                  <div className="temps-field">
                    <span className="temps-label">Температура –</span>
                    <span className="temps-value">{pl.temperature}</span>
                    <span className="temps-unit">К</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="temps-submit-wrapper">
          <Link to="/requests" className="temps-submit-btn" style={{ textDecoration: "none" }}>
            ← Вернуться к списку заявок
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RequestViewPage;