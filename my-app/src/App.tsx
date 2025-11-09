import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanetsPage from "./pages/PlanetsPage";
import PlanetPage from "./pages/PlanetPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/planets" element={<PlanetsPage />} />
        <Route path="/planet/:planet_id" element={<PlanetPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;