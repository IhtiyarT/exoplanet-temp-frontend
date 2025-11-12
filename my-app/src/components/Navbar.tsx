import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav__wrapper">
        <div className="nav__links">
          <Link to="/" className={`nav__link ${location.pathname === '/' ? 'active' : ''}`}>Главная</Link>
          <Link to="/planets" className={`nav__link ${location.pathname === '/planets' ? 'active' : ''}`}>Планеты</Link>
        </div>

        <div
          className="nav__mobile-wrapper"
          onClick={(e) => e.currentTarget.classList.toggle('active')}
        >
          <div className="nav__mobile-target" />
          <div className="nav__mobile-menu" onClick={(e) => e.stopPropagation()}>
            <Link to="/" className="nav__link">Главная</Link>
            <Link to="/planets" className="nav__link">Планеты</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};