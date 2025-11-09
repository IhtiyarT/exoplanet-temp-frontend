import React, { useEffect, useState, useRef, type FormEvent } from "react";
import { fetchPlanets } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/planets.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../store';
import { setQuery } from '../store/filterSlice';

type Planet = {
  planet_id: number;
  planet_title: string;
  planet_image?: string | null;
  planet_description?: string;
  albedo?: number;
};

const LIMIT = 8;

export const PlanetsPage: React.FC = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [systemId, setSystemId] = useState<number>(0);

  const query = useSelector((state: RootState) => state.filter.query);
  const dispatch = useDispatch();

  useEffect(() => {
    resetAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (loading || !hasMore) return;
      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.offsetHeight;
      if (docHeight - scrollPos < 300) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore, planets]);

  async function resetAndLoad() {
    setPage(1);
    setHasMore(true);
    setPlanets([]);
    await loadPage(1, true);
  }

  async function loadMore() {
    if (!hasMore) return;
    await loadPage(page + 1, false);
  }

  async function loadPage(loadPageNum: number, replace: boolean) {
    setLoading(true);
    try {
      const resp = await fetchPlanets({
        page: loadPageNum,
        limit: LIMIT,
        name: query || undefined,
      });
      const items = resp.items || [];
      if (replace) {
        setPlanets(items);
        setCartCount(resp.planetCount ?? 0);
        setSystemId(resp.systemID ?? 0);
      }
      else setPlanets((p) => [...p, ...items]);

      if (items.length < LIMIT) setHasMore(false);
      else setHasMore(true);

      setPage(loadPageNum);
    } catch (e) {
      console.error("Load planets failed", e);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  const onSearch = async (e: FormEvent) => {
    e.preventDefault();
    await resetAndLoad();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };  

  // handler for "Добавить" button — per template it's a <form> POST,
  // but here we only show a placeholder action (no backend write implemented)
  // const onAdd = (planetId: number) => {
  //   // placeholder — you can replace with real POST or navigation
  //   alert(`Добавить планету id=${planetId}`);
  // };

  const onImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    img.src = "src/assets/DefaultImage.jpg";
  };

  return (
    <div>
      <header>
        <div className="header-container">
          <div className="logo">
            <Link to="/">
              <img src="src/assets/logo.png" alt="Logo" />
            </Link>
          </div>
          
          <div className="nav-links">
              <Link to="/" className="nav-link">Главная</Link>
              <span className="nav-link active">Планеты</span>
          </div>
        </div>
      </header>

      <div className="navigation-bar">
            <div className="search">
              <form onSubmit={onSearch}>
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

      <div className="card-list" ref={scrollRef}>
        {planets.map((pl) => (
          <div className="card" key={pl.planet_id}>
            <Link to={`/planet/${pl.planet_id}`} className="card-image-link" title={pl.planet_title}>
              <div className="card-image">
                <img
                  src={pl.planet_image && pl.planet_image.length > 0 ? pl.planet_image : "/src/assets/DefaultImage.jpg"}
                  alt={pl.planet_title}
                  onError={onImageError}
                />
                <div className="card-title">{pl.planet_title}</div>
              </div>
            </Link>
            <div className="card-footer">
              {/* <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAdd(pl.planet_id);
                }}
              >
                <button type="submit">Добавить</button>
              </form> */}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
        </div>
      )}

      {cartCount > 0 ? (
        <Link to={`/temps-request/${systemId}`} className="planet-button">
          <span className="cart-badge">{cartCount}</span>
        </Link>
      ) : (
        <a className="planet-button disabled" />
      )}
    </div>
  );
};

export default PlanetsPage;
