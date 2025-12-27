import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
      title={dark ? "Vaihda vaaleaan tilaan" : "Vaihda tummaan tilaan"}
    >
      {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  );
}



