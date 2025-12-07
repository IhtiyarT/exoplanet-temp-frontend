import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  albedo?: number;
}

interface SystemDraft {
  system_id: number;
  star_name: string;
  star_type: string;
  star_luminosity: number;
  planet_count: number;
  planets: PlanetInSystem[];
}

const TempsRequestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [system, setSystem] = useState<SystemDraft | null>(null);

  const [star, setStar] = useState({
    name: "",
    type: "",
    luminosity: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadDraft = async () => {
      try {
        const resp = await api.api.planetSystemDraftIdList();
        const data = resp.data as SystemDraft;

        if (data.system_id === 0) {
          setSystem(null);
        } else {
          setSystem(data);

          setStar({
            name: data.star_name,
            type: data.star_type,
            luminosity: data.star_luminosity,
          });
        }
      } catch {
        alert("Ошибка загрузки черновика");
        navigate("/planets");
      }
    };

    loadDraft();
  }, [isAuthenticated, navigate]);

  const updateDistance = async (planetId: number, value: string) => {
    if (!system) return;
    const distance = parseFloat(value) || 0;

    try {
      await api.api.temperatureReqPlanetUpdate(system.system_id, planetId, {
        planet_distance: distance,
      });

      setSystem(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          planets: prev.planets.map(p =>
            p.planet_id === planetId ? { ...p, distance } : p
          ),
        };
      });
    } catch (err) {
      console.log(err);
    }
  };

  const removePlanet = async (planetId: number) => {
    if (!system) return;

    try {
      await api.api.temperatureReqPlanetDelete(system.system_id, planetId);

      setSystem(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          planets: prev.planets.filter(p => p.planet_id !== planetId),
          planet_count: prev.planet_count - 1,
        };
      });
    } catch (err) {
      alert(err);
    }
  };

  const submitRequest = async () => {
    if (!system || system.planets.length === 0) return;

    try {
      await api.api.planetSystemUpdate(system.system_id, {
        star_name: star.name,
        star_type: star.type,
        star_luminosity: star.luminosity,
      });

      await api.api.planetSystemFormUpdate(system.system_id)

      navigate("/planets");
    } catch {
      alert("Ошибка при отправке");
    }
  };

  if (!system) {
    return (
      <div className="temps-empty">
        Черновик пуст. <Link to="/planets">Добавить планеты</Link>
      </div>
    );
  }

  return (
    <div className="temps-request-page">
      <header>
        <div className="header-container">
          <div className="logo">
            <Link to="/"><img src="/logo.png" alt="Logo" /></Link>
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
        <span>Черновик заявки</span>
      </nav>

      <main className="temps-main">

        <div className="temps-star-info">
          <div className="temps-field-group">
            <span className="temps-label">Название звезды –</span>
            <input
              type="text"
              className="temps-input"
              value={star.name}
              onChange={(e) => setStar(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div className="temps-field-group">
            <span className="temps-label">Тип звезды –</span>
            <input
              type="text"
              className="temps-input"
              value={star.type}
              onChange={(e) => setStar(prev => ({ ...prev, type: e.target.value }))}
            />
          </div>

          <div className="temps-field-group">
            <span className="temps-label">Светимость звезды –</span>
            <input
              type="number"
              className="temps-input"
              value={star.luminosity}
              onChange={(e) =>
                setStar(prev => ({
                  ...prev,
                  luminosity: parseFloat(e.target.value) || 0,
                }))
              }
            />
            <span className="temps-unit"></span>
          </div>
        </div>

        <h2 className="temps-title">Составление заявки</h2>
        <p className="temps-subtitle">Выбрано планет – {system.planet_count}</p>

        <div className="temps-cards">
          {system.planets.map(pl => (
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
                    <span className="temps-value">{pl.albedo ?? "—"}</span>
                  </div>

                  <div className="temps-field">
                    <span className="temps-label">Расстояние до звезды –</span>
                    <input
                      type="number"
                      step="10"
                      value={pl.distance}
                      onChange={(e) => updateDistance(pl.planet_id, e.target.value)}
                      className="temps-distance-input"
                    />
                    <span className="temps-unit">млн км</span>
                  </div>

                  <div className="temps-field">
                    <span className="temps-label">Температура –</span>
                    <span className="temps-value">0</span>
                    <span className="temps-unit">К</span>
                  </div>
                </div>

                <button
                  onClick={() => removePlanet(pl.planet_id)}
                  className="temps-delete-btn"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        {system.planets.length > 0 && (
          <div className="temps-submit-wrapper">
            <button onClick={submitRequest} className="temps-submit-btn">
              Сформировать заявку
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default TempsRequestPage;
