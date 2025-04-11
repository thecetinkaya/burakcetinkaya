import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Tailwind burada kullanılıyor

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sol Kısım - Site Adı */}
        <div className="text-xl font-bold text-gray-800">Burak Çetinkaya</div>

        {/* Hamburger Menüsü - Mobilde görünür */}
        <div className="lg:hidden" onClick={toggleMenu}>
          <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-800"></div>
        </div>

        {/* Menü - Desktop */}
        <div className="hidden lg:flex flex-grow items-center justify-end space-x-6">
          <Link to="/" className="navbar-link text-gray-800">
            Home
          </Link>
          <Link to="/about" className="navbar-link text-gray-800">
            About
          </Link>
          <Link to="/projects" className="navbar-link text-gray-800">
            Projects
          </Link>
          <Link to="/contact" className="navbar-link text-gray-800">
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden ${
          isMenuOpen ? "block" : "hidden"
        } flex flex-col items-center space-y-4 bg-gray-50 py-4 shadow-md`}
      >
        <Link to="/" className="navbar-link " onClick={closeMenu}>
          Home
        </Link>
        <Link to="/about" className="navbar-link" onClick={closeMenu}>
          About
        </Link>
        <Link to="/projects" className="navbar-link" onClick={closeMenu}>
          Projects
        </Link>
        <Link to="/contact" className="navbar-link" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
