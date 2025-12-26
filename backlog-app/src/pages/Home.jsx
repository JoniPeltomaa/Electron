import { useProjects } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const { projects, addProject, setActiveProject, deleteProject } = useProjects();

  const [name, setName] = useState("");
  const navigate = useNavigate();

  const create = () => {
    if (!name.trim()) return;
    addProject(name);
    setName("");
  };

  const openProject = (p) => {
    setActiveProject(p);
    navigate("/todo");
  };

  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Projektit</h1>

      <div className="flex space-x-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Uusi projekti..."
          className="border px-3 py-2 rounded dark:bg-gray-800"
        />
        <button
          onClick={create}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Lisää
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Valitse projekti</h2>

      <div className="space-y-2">
        {Object.keys(projects).map((p) => (
            <div
            key={p}
            className="flex justify-between items-center 
                        px-4 py-2 bg-white dark:bg-gray-800 
                        rounded shadow"
            >
            <button
                onClick={() => openProject(p)}
                className="text-left flex-1 hover:underline"
            >
                {p}
            </button>

            <button
                onClick={() => {
                if (window.confirm(`Poistetaanko projekti "${p}"?`)) {
                    deleteProject(p);
                }
                }}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Poista
            </button>
            </div>
        ))}
      </div>
    </div>
  );
}

