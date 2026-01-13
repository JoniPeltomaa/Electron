import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ProjectProvider } from "./context/ProjectContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Stats from "./pages/Stats";
import GlobalStats from "./pages/GlobalStats";

export default function App() {
  return (
    <ProjectProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/global-stats" element={<GlobalStats />} />
        </Routes>
      </Router>
    </ProjectProvider>
  );
}

