import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchPlanetSystems, moderatePlanetSystem } from "../store/systemSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
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
  planet_temp_count: number;
  status: string;
  created_at: string;
  user_login: string;
}

interface ListParams {
  start_date?: string;
  end_date?: string;
  system_status?: string;
}

const statusLabels: Record<string, string> = {
  Черновик: "Черновик",
  Сформирована: "Сформирована",
  Завершена: "Завершена",
  Отклонена: "Отклонена",
  Удалена: "Удалена",
};

const statusColors: Record<string, string> = {
  Черновик: "#6c757d",
  Сформирована: "#007bff",
  Завершена: "#28a745",
  Отклонена: "#dc3545",
  Удалена: "#343a40",
};

const RequestsListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const systems = useSelector((s: RootState) => s.systems.systems);
  const loading = useSelector((s: RootState) => s.systems.loading);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");

  const [sortField, setSortField] = useState<keyof PlanetSystem | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const isModerator = user?.role === 2 || user?.role === 3;

  const loadSystems = useCallback(() => {
    if (!isAuthenticated) return;

    const params: ListParams = {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    };

    dispatch(fetchPlanetSystems(params));
  }, [isAuthenticated, startDate, endDate, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(fetchPlanetSystems({}));
  }, [isAuthenticated, navigate, dispatch]);

  const filteredSystems = useMemo(() => {
    let result = systems;

    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (creatorFilter) {
      result = result.filter((s) =>
        s.user_login.toLowerCase().includes(creatorFilter.toLowerCase())
      );
    }

    return result;
  }, [systems, statusFilter, creatorFilter]);

  const sortedSystems = useMemo(() => {
    if (!sortField) return filteredSystems;

    return [...filteredSystems].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal == null || aVal === "") return 1;
      if (bVal == null || bVal === "") return -1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredSystems, sortField, sortOrder]);

  const handleSort = (field: keyof PlanetSystem) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleRowClick = (systemId: number, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).tagName === 'BUTTON') {
      return;
    }
    
    navigate(`/request/${systemId}`);
  };

  const handleModerAction = async (systemId: number, newStatus: "Завершена" | "Отклонена", event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const result = await dispatch(moderatePlanetSystem({ systemId, newStatus }));
      
      if (result.meta.requestStatus === "fulfilled") {
        setTimeout(() => loadSystems(), 300);
      }
    } catch (err) {
      console.error("Ошибка при изменении статуса заявки:", err);
    }
  };

  const formatDate = (dateStr?: string | number) => {
    if (!dateStr) return "—";
    const d = typeof dateStr === "number" ? new Date(dateStr) : new Date(String(dateStr));
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("ru-RU", {
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
                <button className="nav-link" onClick={() => dispatch(logout())}>Выйти</button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Войти</Link>
            )}
          </div>
        </div>
      </header>

      <div className="navigation-bar" />

      <nav style={{ padding: "10px 20px" }} aria-label="breadcrumb">
        <Link to="/">Главная</Link> → <Link to="/planets">Планеты</Link> → <span>Заявки</span>
      </nav>

      <main className="req-main">
        <h1 className="req-title">
          {isModerator ? "Все заявки (модератор)" : "Мои заявки на расчёт температур"}
        </h1>

        <div className="filters" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Все статусы</option>
            <option value="Сформирована">Сформирована</option>
            <option value="Завершена">Завершена</option>
            {/* <option value="Отклонена">Отклонена</option> */}
          </select>

          <button
            onClick={() => loadSystems()}
            style={{
              padding: "6px 12px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Применить
          </button>

          {isModerator && (
            <input
              type="text"
              placeholder="Фильтр по создателю"
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              style={{ minWidth: "200px" }}
            />
          )}
        </div>

        {systems.length === 0 ? (
          <div className="req-empty">
            У вас пока нет заявок. <Link to="/planets">Создать первую заявку</Link>
          </div>
        ) : (
          <div className="req-table-wrapper">
            <table className="req-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("star_name")}>
                    Звезда {sortField === "star_name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Тип звезды</th>
                  <th>Светимость</th>
                  <th onClick={() => handleSort("planet_count")}>
                    Планет {sortField === "planet_count" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Заполнено расчётов</th>
                  <th onClick={() => handleSort("status")}>
                    Статус {sortField === "status" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("created_at")}>
                    Создано {sortField === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  {isModerator && <th>Создатель</th>}
                  {isModerator && <th>Управление</th>}
                </tr>
              </thead>
              <tbody>
                {sortedSystems.map((sys) => (
                  <tr 
                    key={sys.system_id}
                    onClick={(e) => handleRowClick(sys.system_id, e)}
                    className="clickable-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td><strong>{sys.star_name}</strong></td>
                    <td>{sys.star_type}</td>
                    <td>{sys.star_luminosity}</td>
                    <td><strong>{sys.planet_count}</strong></td>
                    <td><strong>{sys.planet_temp_count}</strong></td>
                    <td>
                      <span
                        className="req-status"
                        style={{ backgroundColor: statusColors[sys.status] || "#6c757d" }}
                      >
                        {statusLabels[sys.status] || sys.status}
                      </span>
                    </td>
                    <td>{formatDate(sys.created_at)}</td>
                    {isModerator && <td>{sys.user_login}</td>}
                    {isModerator && sys.status === "Сформирована" && (
                      <td>
                        <button
                          onClick={(e) => handleModerAction(sys.system_id, "Завершена", e)}
                          style={{ width: 100, height: 32, marginBottom: 6, marginRight: "8px", background: "#28a745", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Завершить
                        </button>
                        <button
                          onClick={(e) => handleModerAction(sys.system_id, "Отклонена", e)}
                          style={{ width: 100, height: 32, background: "#dc3545", color: "white", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}
                        >
                          Отклонить
                        </button>
                      </td>
                    )}
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