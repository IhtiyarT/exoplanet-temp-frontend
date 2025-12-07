import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanetsPage from "./pages/PlanetsPage";
import PlanetPage from "./pages/PlanetPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TempsRequestPage from "./pages/TempsRequestPage";
import RegisterPage from "./pages/RegisterPage";
import RequestsListPage from "./pages/RequestListPage";
import ProfilePage from "./pages/ProfilePage";
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="/planet/:planet_id" element={<PlanetPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/temps-request" element={<TempsRequestPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/requests" element={<RequestsListPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;