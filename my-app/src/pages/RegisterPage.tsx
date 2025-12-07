import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import "../styles/register.css";

interface RegisterForm {
  login: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    login: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.login.trim()) {
      setError("Введите логин");
      return;
    }
    if (form.login.length < 3) {
      setError("Логин должен быть не менее 3 символов");
      return;
    }
    if (form.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      await api.api.userRegisterCreate({
        login: form.login.trim(),
        password: form.password,
      });

      alert("Регистрация успешна! Теперь вы можете войти.");
      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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
           </div>
        </div>
      </header>

      <div className="navigation-bar"></div>

      <nav className="breadcrumb">
        <Link to="/">Главная</Link> → <span>Регистрация</span>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <h2 className="auth-title">Создание аккаунта</h2>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Логин</label>
              <input
                type="text"
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
                placeholder="Введите логин"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label>Пароль</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Минимум 6 символов"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Подтверждение пароля</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Повторите пароль"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
            </button>
          </form>

          <p className="auth-footer">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;