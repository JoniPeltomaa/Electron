import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Backlog() {
  const { projects, setProjects, activeProject } = useProjects();

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [filter, setFilter] = useState("all");

  if (!activeProject) {
    return (
      <div className="text-center text-xl mt-10">
        Valitse projekti etusivulta.
      </div>
    );
  }

  const project = projects[activeProject];

  const addTask = () => {
    if (!newTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      priority
    };

    setProjects({
      ...projects,
      [activeProject]: {
        ...project,
        todo: [...project.todo, newTask]
      }
    });

    setNewTitle("");
    setNewDescription("");
    setPriority("low");
  };

  const removeTask = (state, id) => {
    setProjects({
      ...projects,
      [activeProject]: {
        ...project,
        [state]: project[state].filter((t) => t.id !== id)
      }
    });
  };

  const editTask = (state, id, newTitle, newDescription) => {
    setProjects({
      ...projects,
      [activeProject]: {
        ...project,
        [state]: project[state].map((t) =>
          t.id === id
            ? { ...t, title: newTitle, description: newDescription }
            : t
        )
      }
    });
  };

  const moveTask = (from, to, id) => {
    const task = project[from].find((t) => t.id === id);
    if (!task) return;

    setProjects({
      ...projects,
      [activeProject]: {
        ...project,
        [from]: project[from].filter((t) => t.id !== id),
        [to]: [...project[to], task]
      }
    });
  };

  const filteredTasks = (state) => {
    const tasks = project[state] || [];
    if (filter === "all") return tasks;
    return tasks.filter((t) => t.priority === filter);
  };

  const priorityColor = (p) => {
    switch (p) {
      case "low":
        return "bg-green-200 dark:bg-green-700";
      case "medium":
        return "bg-yellow-200 dark:bg-yellow-700";
      case "high":
        return "bg-red-200 dark:bg-red-700";
      default:
        return "bg-gray-200 dark:bg-gray-700";
    }
  };

  const renderColumn = (state, title) => (
    <div
      className="bg-white dark:bg-gray-800 p-4 rounded shadow"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        moveTask(data.state, state, data.id);
      }}
    >
      <h2 className="text-xl font-bold mb-3">{title}</h2>

      {filteredTasks(state).map((task) => (
        <div
          key={task.id}
          className={`p-3 mb-2 rounded cursor-grab ${priorityColor(task.priority)}`}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData(
              "text/plain",
              JSON.stringify({ state, id: task.id })
            )
          }
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold">{task.title}</h3>

            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-1 rounded bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border">
                {task.priority}
              </span>

              <button
                onClick={() => {
                  const newTitle = prompt("Muokkaa otsikkoa:", task.title);
                  const newDescription = prompt(
                    "Muokkaa kuvausta:",
                    task.description
                  );
                  if (newTitle || newDescription) {
                    editTask(
                      state,
                      task.id,
                      newTitle || task.title,
                      newDescription || task.description
                    );
                  }
                }}
              >
                <FaEdit className="text-blue-600 hover:text-blue-800" />
              </button>

              <button onClick={() => removeTask(state, task.id)}>
                <FaTrash className="text-red-600 hover:text-red-800" />
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            {task.description}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{activeProject}</h1>

      {/* Suodatus */}
      <div className="flex space-x-2 mb-4">
        {["all", "low", "medium", "high"].map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-3 py-1 rounded border ${
              filter === p
                ? "bg-blue-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Uusi tehtävä */}
      <div className="flex flex-col mb-4 space-y-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Tehtävän otsikko..."
          className="border rounded px-3 py-2 dark:bg-gray-800"
        />

        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Tehtävän kuvaus..."
          className="border rounded px-3 py-2 dark:bg-gray-800"
        />

        <div className="flex space-x-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded px-2 py-2 dark:bg-gray-800"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Lisää
          </button>
        </div>
      </div>

      {/* Kolumnit */}
      <div className="grid grid-cols-3 gap-4">
        {renderColumn("todo", "To Do")}
        {renderColumn("inprogress", "In Progress")}
        {renderColumn("done", "Done")}
      </div>
    </div>
  );
}

