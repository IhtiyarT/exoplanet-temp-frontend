import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import type { AppDispatch } from "../store";
import { logout } from "../store/authSlice";
import "../styles/navbar.css";

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleOutClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        btnRef.current &&
        !menuRef.current.contains(target) &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleOutClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // close when navigating (link clicked)
  const handleNavigate = () => setOpen(false);

  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={handleNavigate}>
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>

        <div className="nav-right">
          <div className="nav-links">
            <span className="nav-link active">Главная</span>
            <Link to="/planets" className="nav-link">Планеты</Link>
            <Link to="/requests" className="nav-link">Заявки</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">{user?.login}</Link>
                <button
                  className="nav-link nav-button"
                  onClick={() => { dispatch(logout()); }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Войти</Link>
            )}
          </div>

          <div className="nav-burger-wrapper" ref={menuRef}>
            <button
              ref={btnRef}
              className={`burger-btn ${open ? "open" : ""}`}
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setOpen((s) => !s)}
            >
              <span className="burger-line" />
              <span className="burger-line" />
              <span className="burger-line" />
            </button>

            <div className={`burger-menu ${open ? "show" : ""}`} role="menu">
              <Link to="/" className="burger-item" onClick={handleNavigate}>Главная</Link>
              <Link to="/planets" className="burger-item" onClick={handleNavigate}>Планеты</Link>
              <Link to="/requests" className="burger-item" onClick={handleNavigate}>Заявки</Link>

              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="burger-item" onClick={handleNavigate}>{user?.login}</Link>
                  <button
                    className="burger-item burger-logout"
                    onClick={() => { dispatch(logout()); setOpen(false); }}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link to="/login" className="burger-item" onClick={handleNavigate}>Войти</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
