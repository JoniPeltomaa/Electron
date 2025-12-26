import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState({});
  const [activeProject, setActiveProject] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = (name) => {
    if (!name || projects[name]) return;
    setProjects({
      ...projects,
      [name]: { todo: [], inprogress: [], done: [] }
    });
  };

  const deleteProject = (name) => {
    const updated = { ...projects };
    delete updated[name];

    setProjects(updated);

    // jos poistettu projekti oli aktiivinen, nollataan valinta
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

