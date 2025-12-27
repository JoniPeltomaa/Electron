import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState({});
  const [activeProject, setActiveProject] = useState("");

  // Lataa localStoragesta
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      const parsed = JSON.parse(saved);

      // 🔥 MIGRAATIO: lisää puuttuvat kentät kaikkiin projekteihin
      Object.keys(parsed).forEach((key) => {
        const p = parsed[key];

        if (!p.todo) p.todo = [];
        if (!p.inprogress) p.inprogress = [];
        if (!p.testing) p.testing = [];   // ← tärkeä
        if (!p.done) p.done = [];
      });

      setProjects(parsed);
    }
  }, []);

  // Tallenna localStorageen
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // Luo uusi projekti
  const addProject = (name) => {
    if (!name || projects[name]) return;

    setProjects({
      ...projects,
      [name]: {
        todo: [],
        inprogress: [],
        testing: [],   // ← uusi sarake mukana
        done: []
      }
    });
  };

  // Poista projekti
  const deleteProject = (name) => {
    const updated = { ...projects };
    delete updated[name];

    setProjects(updated);

    if (activeProject === name) {
      setActiveProject("");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        setProjects,
        activeProject,
        setActiveProject,
        addProject,
        deleteProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

