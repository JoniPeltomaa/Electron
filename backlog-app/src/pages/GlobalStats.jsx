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

export default function GlobalStats() {
  const { projects } = useProjects();
  const chartRef = useRef(null);

  Object.values(projects).forEach((p) => {
    if (!p.testing) p.testing = [];
  });


  const totals = Object.values(projects).reduce(
    (acc, p) => {
      acc.todo += p.todo.length;
      acc.inprogress += p.inprogress.length;
      acc.testing += p.testing.length;
      acc.done += p.done.length;
      return acc;
    },
    { todo: 0, inprogress: 0, testing: 0, done: 0 }
  );

  const totalTasks =
    totals.todo + totals.inprogress + totals.testing + totals.done;

  const percent = (count) =>
    totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);

  const pieData = {
    labels: ["Tehtävälista", "Tekemässä", "Testauksessa", "Valmis"],
    datasets: [
      {
        data: [
          totals.todo,
          totals.inprogress,
          totals.testing,
          totals.done
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
    <div className="dark:bg-gray-900 dark:text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Kaikkien projektien tilastot</h1>

      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-6">
        <div className="flex justify-around mb-4">

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Yhteensä</p>
            <p className="text-xl font-bold">{totalTasks}</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Tehtävälista</p>
            <p className="text-xl font-bold">{totals.todo}</p>
            <p className="text-sm text-gray-400">{percent(totals.todo)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Tekemässä</p>
            <p className="text-xl font-bold">{totals.inprogress}</p>
            <p className="text-sm text-gray-400">{percent(totals.inprogress)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Testauksessa</p>
            <p className="text-xl font-bold">{totals.testing}</p>
            <p className="text-sm text-gray-400">{percent(totals.testing)}%</p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-300 text-sm">Valmis</p>
            <p className="text-xl font-bold">{totals.done}</p>
            <p className="text-sm text-gray-400">{percent(totals.done)}%</p>
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
                width: `${percent(totals.done)}%`
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

