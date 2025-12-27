import React, { useRef } from "react";
import { useProjects } from "../context/ProjectContext";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectStats() {
  const { projects, activeProject } = useProjects();



  

  const chartRef = useRef(null);

  if (!activeProject) {
    return (
      <div className="text-center text-xl mt-10">
        Valitse projekti etusivulta.
      </div>
    );
  }

  const project = projects[activeProject];

  if (!project.testing) project.testing = [];

  const totalTasks =
    project.todo.length +
    project.inprogress.length +
    project.testing.length +
    project.done.length;

  const percent = (count) =>
    totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);

  const pieData = {
    labels: ["Tehtävälista", "Tekemässä", "Testauksessa", "Valmis"],
    datasets: [
      {
        data: [
          project.todo.length,
          project.inprogress.length,
          project.testing.length,
          project.done.length
        ],
        backgroundColor: ["#3b82f6", "#facc15", "#a855f7", "#22c55e"],
        borderWidth: 1
      }
    ]
  };

  const pieOptions = {
    plugins: {
      legend: { display: false }
    }
  };

  const toggleDataset = (index) => {
    const chart = chartRef.current;
    if (!chart) return;

    const meta = chart._metasets[index];
    meta.hidden = meta.hidden === null ? true : !meta.hidden;
    chart.update();
  };

  return (
    <div className="dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">{activeProject} – Tilastot</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6">
        <div className="flex justify-around mb-4">

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Yhteensä</p>
            <p className="text-xl font-bold">{totalTasks}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Tehtävälista</p>
            <p className="text-xl font-bold">{project.todo.length}</p>
            <p className="text-sm text-gray-400">{percent(project.todo.length)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Tekemässä</p>
            <p className="text-xl font-bold">{project.inprogress.length}</p>
            <p className="text-sm text-gray-400">{percent(project.inprogress.length)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Testauksessa</p>
            <p className="text-xl font-bold">{project.testing.length}</p>
            <p className="text-sm text-gray-400">{percent(project.testing.length)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Valmis</p>
            <p className="text-xl font-bold">{project.done.length}</p>
            <p className="text-sm text-gray-400">{percent(project.done.length)}%</p>
          </div>

        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
            Valmistumisaste
          </p>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded h-4">
            <div
              className="bg-green-500 h-4 rounded"
              style={{
                width: `${percent(project.done.length)}%`
              }}
            ></div>
          </div>
        </div>

        {/* Pie chart */}
        <div className="w-1/6 mx-auto mb-4">
          <Pie ref={chartRef} data={pieData} options={pieOptions} />
        </div>

        {/* Klikattava legenda */}
        <div className="flex justify-center space-x-6">
          <button onClick={() => toggleDataset(0)} className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-500 rounded"></span>
            <span>Tehtävälista</span>
          </button>

          <button onClick={() => toggleDataset(1)} className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-yellow-500 rounded"></span>
            <span>Tekemässä</span>
          </button>

          <button onClick={() => toggleDataset(2)} className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-purple-500 rounded"></span>
            <span>Testauksessa</span>
          </button>

          <button onClick={() => toggleDataset(3)} className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-green-500 rounded"></span>
            <span>Valmis</span>
          </button>
        </div>
      </div>
    </div>
  );
}

