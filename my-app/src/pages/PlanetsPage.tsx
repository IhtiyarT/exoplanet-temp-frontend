import { getImageUrl } from "../utils/imageUtils";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/planets.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../store';
import { setQuery } from '../store/filterSlice';
import { fetchPlanets } from '../store/planetSlice';
import { useEffect, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import { logout } from "../store/authSlice";

export const PlanetsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const token = useSelector((state: RootState) => state.auth.token);

  const query = useSelector((state: RootState) => state.filter.query);
  const { planets, loading, planetCount } = useSelector(
    (state: RootState) => state.planets
  );


  useEffect(() => {
    dispatch(fetchPlanets(undefined));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setQuery(""));                 
    dispatch(fetchPlanets(undefined));    
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    dispatch(fetchPlanets(query.trim() || undefined));
  };

  const onAdd = async (planetId: number) => {
    if (!isAuthenticated) {
      alert("Требуется авторизация");
      return;
    }

    try {
      console.log("Добавляем планету:", planetId);
      console.log("Токен в Redux:", token?.substring(0, 20) + "...");
      
      await api.api.planetAddCreate(planetId);
      dispatch(fetchPlanets(query.trim() || undefined));
    } catch (err) {
      console.error("Ошибка при добавлении планеты:", err);
    }
  };

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
            <span className="nav-link active">Планеты</span>
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
        <div className="search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="query"
              placeholder="Для поиска введите что-нибудь"
              value={query}
              onChange={(e) => dispatch(setQuery(e.target.value))}
            />
            <button className="find-button" type="submit" aria-label="Найти" />
          </form>
        </div>
      </div>

      <nav style={{ padding: "10px 20px" }} aria-label="breadcrumb">
        <div>
          <Link to="/">Главная</Link> &nbsp;/&nbsp; <span>Планеты</span>
        </div>
      </nav>

      <h1 className="title">Расчет температур экзопланет</h1>

      <div className="card-list">
        {planets.map((pl) => (
          <div className="card" key={pl.planet_id}>
            <Link to={`/planet/${pl.planet_id}`} className="card-image-link" title={pl.planet_title}>
              <div className="card-image">
                <img src={getImageUrl(pl.planet_image)} />
                <div className="card-title">{pl.planet_title}</div>
              </div>
            </Link>

            {isAuthenticated && (
              <div className="card-footer">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onAdd(pl.planet_id);
                  }}
                >
                  <button type="submit">Добавить</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
        </div>
      )}

      {planetCount > 0 ? (
        <Link to={`/temps-request`} className="planet-button">
          <span className="cart-badge">{planetCount}</span>
        </Link>
      ) : (
        <a className="planet-button disabled" />
      )}
    </div>
  );
};

export default PlanetsPage;
