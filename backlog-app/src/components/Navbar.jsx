import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-full h-10">

      {/* Vasen tyhjä tila */}
      <div className="flex-1"></div>

      {/* Keskitetyt linkit */}
      <div className="flex space-x-6 justify-center flex-1">
        <NavLink to="/" className="hover:underline">Etusivu</NavLink>
        <NavLink to="/todo" className="hover:underline">Tehtävät</NavLink>
        <NavLink to="/stats" className="hover:underline">Tilastot</NavLink>
        <NavLink to="/global-stats" className="hover:underline">Kaikki projektit</NavLink>
      </div>

      {/* Dark mode oikeassa reunassa */}
      <div className="flex-1 flex justify-end">
        <ThemeToggle />
      </div>

    </nav>
  );


}

