import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
// Placeholder views
import { Dashboard } from "./views/Dashboard";
import { MySkills } from "./views/MySkills";
import { InstallSkills } from "./views/InstallSkills";
import { Settings } from "./views/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-skills" element={<MySkills />} />
          <Route path="/install" element={<InstallSkills />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
