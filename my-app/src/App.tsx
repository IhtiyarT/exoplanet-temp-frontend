import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanetsPage from "./pages/PlanetsPage";
import PlanetPage from "./pages/PlanetPage";
import HomePage from "./pages/HomePage";
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename="/exoplanet-temp-frontend"> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="/planet/:planet_id" element={<PlanetPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;