import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import "../styles/requests_list.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { logout } from "../store/authSlice";

interface PlanetSystem {
  system_id: number;
  star_name: string;
  star_type: string;
  star_luminosity: number;
  planet_count: number;
  status: "draft" | "formed" | "in_progress" | "completed" | "rejected";
  created_at: string;
}

const statusLabels: Record<PlanetSystem["status"], string> = {
  draft: "Черновик",
  formed: "Сформирована",
  in_progress: "В обработке",
  completed: "Завершена",
  rejected: "Отклонена",
};

const statusColors: Record<PlanetSystem["status"], string> = {
  draft: "#6c757d",
  formed: "#007bff",
  in_progress: "#ffc107",
  completed: "#28a745",
  rejected: "#dc3545",
};

const normalizeStatus = (status: string): PlanetSystem["status"] => {
  const s = status.trim().toLowerCase();

  if (s.includes("чер")) return "draft";
  if (s.includes("сформ")) return "formed";
  if (s.includes("обраб")) return "in_progress";
  if (s.includes("заверш")) return "completed";
  if (s.includes("отклон")) return "rejected";

  return "draft";
};

const RequestsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  

  const [systems, setSystems] = useState<PlanetSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof PlanetSystem | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadSystems = async () => {
      try {
        const resp = await api.api.planetSystemListList();

        const data = resp.data;

        console.log("RAW RESPONSE:", data);

        let list: PlanetSystem[] = [];

        if (data && Array.isArray(data.planet_systems)) {
          list = data.planet_systems.map((item) => ({
            system_id: item.id,
            star_name: item.star_name ?? "—",
            star_type: item.star_type ?? "—",
            star_luminosity: item.star_luminosity ?? 0,
            planet_count: Array.isArray(item.planets) ? item.planets.length : 2,
            status: normalizeStatus(item.status),
            created_at: item.date_created ?? "",
          }));
        }

        console.log("PARSED SYSTEMS:", list);

        setSystems(list);
      } catch (err) {
        console.error(err);
        alert("Не удалось загрузить список заявок");
        setSystems([]);
      } finally {
        setLoading(false);
      }
    };

    loadSystems();
  }, [isAuthenticated, navigate]);

  const handleSort = (field: keyof PlanetSystem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedSystems = React.useMemo(() => {
    if (!sortField) return systems;

    return [...systems].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === "asc" ? result : -result;
    });
  }, [systems, sortField, sortOrder]);

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div className="req-loading">Загрузка заявок...</div>;

  return (
    <div className="requests-list-page">
      <header>
        <div className="header-container">
          <div className="logo">
            <Link to="/"><img src="/logo.png" alt="Logo" /></Link>
          </div>
          <div className="nav-links">
                <Link to="/" className="nav-link">Главная</Link>
                <Link to="/planets" className="nav-link">Планеты</Link>
                <span className="nav-link active">Заявки</span>
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

      <div className="navigation-bar" />

        <nav style={{ padding: "10px 20px" }} aria-label="breadcrumb">
            <Link to="/">Главная</Link> &nbsp;/&nbsp;
            <Link to="/planets">Планеты</Link> &nbsp;/&nbsp;
            <span>Заявки</span>
        </nav>

      <main className="req-main">
        <h1 className="req-title">Мои заявки на расчёт температур</h1>

        {systems.length === 0 ? (
          <div className="req-empty">
            У вас пока нет заявок.{" "}
            <Link to="/planets">Создать первую заявку</Link>
          </div>
        ) : (
          <div className="req-table-wrapper">
            <table className="req-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("star_name")}>
                    Звезда {sortField === "star_name" && (sortOrder === "asc" ? "Up" : "Down")}
                  </th>
                  <th>Тип</th>
                  <th>Светимость</th>
                  <th onClick={() => handleSort("planet_count")}>
                    Планет {sortField === "planet_count" && (sortOrder === "asc" ? "Up" : "Down")}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Статус {sortField === "status" && (sortOrder === "asc" ? "Up" : "Down")}
                  </th>
                  <th onClick={() => handleSort("created_at")}>
                    Создано {sortField === "created_at" && (sortOrder === "asc" ? "Up" : "Down")}
                  </th>
                  <th>Действия</th>
                </tr>
              </thead>

              <tbody>
                {sortedSystems.map((sys) => (
                  <tr key={sys.system_id}>
                    <td><strong>{sys.star_name}</strong></td>
                    <td>{sys.star_type}</td>
                    <td>{sys.star_luminosity}</td>
                    <td><strong>{sys.planet_count}</strong></td>
                    <td>
                      <span
                        className="req-status"
                        style={{ backgroundColor: statusColors[sys.status] }}
                      >
                        {statusLabels[sys.status]}
                      </span>
                    </td>
                    <td>{formatDate(sys.created_at)}</td>
                    <td>
                      {sys.status === "draft" ? (
                        <Link to="/temps-request" className="req-action-btn">
                          Редактировать
                        </Link>
                      ) : sys.status === "completed" ? (
                        <Link
                          to={`/request/${sys.system_id}`}
                          className="req-action-btn success"
                        >
                          Результаты
                        </Link>
                      ) : (
                        <span className="req-action-disabled">Ожидание</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestsListPage;
