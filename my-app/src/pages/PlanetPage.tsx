import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPlanetById, getImageUrl } from "../../public/api";
import "../styles/planet_style.css";

type Planet = {
  planet_title: string;
  planet_description: string;
  planet_image?: string | null;
  albedo: number;
};

const PlanetPage: React.FC = () => {
  const { planet_id } = useParams<{ planet_id: string }>();
  const [planet, setPlanet] = useState<Planet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const loadPlanet = async () => {
      try {
        if (!planet_id) return;
        const data = await fetchPlanetById(Number(planet_id));
        setPlanet(data);
      } catch (err) {
        console.error("Error loading planet:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadPlanet();
  }, [planet_id]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Загрузка...</div>;
  }

  if (error || !planet) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Планета не найдена</h2>
        <img
          src="/exoplanet-temp-frontend/DefaultImage.jpg"
          alt="not found"
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
              <img src="/exoplanet-temp-frontend/logo.png" alt="Logo" />
            </Link>
          </div>
          
          <div className="nav-links">
              <Link to="/" className="nav-link">Главная</Link>
              <Link to="/planets" className="nav-link">Планеты</Link>
          </div>
        </div>
      </header>

      <div className="navigation-bar"></div>

      {/* Хлебные крошки */}
      <nav style={{ padding: "10px 20px" }} aria-label="breadcrumb">
        <Link to="/">Главная</Link> &nbsp;/&nbsp;
        <Link to="/planets">Планеты</Link> &nbsp;/&nbsp;
        <span>{planet.planet_title}</span>
      </nav>

      <div className="planet-container">
        <div className="planet-image">
          <img src={getImageUrl(planet.planet_image)} />
        </div>
        <div className="planet-details">
          <h1 className="title">{planet.planet_title}</h1>
          <p>{planet.planet_description}</p>
          <p>Среднее значение Альбедо - {planet.albedo}</p>
        </div>
      </div>
    </div>
  );
};

export default PlanetPage;
