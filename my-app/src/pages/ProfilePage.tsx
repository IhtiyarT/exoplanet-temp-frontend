import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import "../styles/profile.css";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";

interface UserProfile {
  user_id: number;
  login: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

//   const [currentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        if (!user?.user_id) throw new Error("Не удалось определить ID пользователя");

        const resp = await api.api.userDetail(user.user_id);
        setProfile(resp.data as UserProfile);
      } catch (err) {
        setError("Не удалось загрузить профиль " + err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate, user?.user_id]);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 6) {
      setError("Новый пароль должен быть не менее 6 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setSaving(true);
    try {
      await api.api.userMeUpdate({
        new_password: newPassword,
      });

      alert("Пароль успешно изменён!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-loading">Загрузка профиля...</div>;

  let role = "Астрофизик";
  console.log(user)
  if (profile && profile.role != '0' ) {
    role = "Астроном-верификатор";
  }

  return (
    <div className="profile-page">
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
                    <span className="nav-link active">{user?.login}</span>
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

      <nav className="profile-breadcrumb">
        <Link to="/">Главная</Link> → <span>Профиль</span>
      </nav>

      <main className="profile-main">
        <div className="profile-card">
          <h1 className="profile-title">Мой профиль</h1>

          {profile && (
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Логин:</span>
                <span className="profile-value">{profile.login}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Роль:</span>
                <span className="profile-value">{role}</span>
              </div>
            </div>
          )}

          <hr className="profile-divider" />

          <h2 className="profile-subtitle">Смена пароля</h2>

          {error && <div className="profile-error">{error}</div>}

          <form onSubmit={handleSavePassword} className="profile-form">
            <div className="profile-field">
              <label>Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
                minLength={6}
                disabled={saving}
              />
            </div>

            <div className="profile-field">
              <label>Подтверждение пароля</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите новый пароль"
                required
                disabled={saving}
              />
            </div>

            <button type="submit" disabled={saving} className="profile-save-btn">
              {saving ? "Сохранение..." : "Изменить пароль"}
            </button>
          </form>

          <div className="profile-footer">
            <Link to="/requests" className="profile-link">
              Мои заявки
            </Link>
            {" • "}
            <Link to="/planets" className="profile-link">
              Планеты
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;