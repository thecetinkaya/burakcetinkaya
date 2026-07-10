import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";
import "../App.css"; // Tailwind burada kullanılıyor

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  if (location.pathname === "/admin" || location.pathname.startsWith("/admin/")) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `navbar-link font-extrabold text-sm transition-all cursor-pointer ${
      isActive ? "text-[#13d179]" : "text-slate-500 dark:text-slate-400 hover:text-[#13d179]"
    }`;
  };

  const getMobileLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `navbar-link font-black text-base transition-all cursor-pointer ${
      isActive ? "text-[#13d179]" : "text-slate-600 dark:text-slate-300 hover:text-[#13d179]"
    }`;
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/60 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Sol Kısım - Site Adı */}
        <Link to="/" className="text-lg font-black tracking-tight text-slate-950 dark:text-white hover:text-[#13d179] transition">
          Burak Çetinkaya
        </Link>

        {/* Hamburger Menüsü - Mobilde görünür */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-1"
          aria-label="Menü"
        >
          <div className="w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></div>
          <div className="w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></div>
          <div className="w-5 h-0.5 bg-slate-600 dark:bg-slate-300"></div>
        </button>

        {/* Menü - Desktop */}
        <div className="hidden lg:flex flex-grow items-center justify-end space-x-6">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link to="/about" className={getLinkClass("/about")}>
            About
          </Link>
          <Link to="/projects" className={getLinkClass("/projects")}>
            Projects
          </Link>
          <Link to="/contact" className={getLinkClass("/contact")}>
            Contact
          </Link>
          
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-xl transition cursor-pointer text-slate-500 hover:text-[#13d179] dark:text-slate-400 dark:hover:text-[#13d179] hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center shrink-0"
            title={theme === "dark" ? "Açık Tema" : "Koyu Tema"}
          >
            {theme === "dark" ? <FaSun size={15} className="text-amber-400" /> : <FaMoon size={14} className="text-slate-650" />}
          </button>

          <Link to="/admin" className="navbar-link text-sm px-3.5 py-1.5 bg-emerald-500/10 text-[#13d179] border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/35 transition-all font-bold">
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile menu with slide down */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="lg:hidden flex flex-col items-center space-y-4 bg-white dark:bg-[#0d1220] py-4 border-b border-slate-200 dark:border-slate-800/60 shadow-xl overflow-hidden"
          >
            <Link to="/" className={getMobileLinkClass("/")} onClick={closeMenu}>
              Home
            </Link>
            <Link to="/about" className={getMobileLinkClass("/about")} onClick={closeMenu}>
              About
            </Link>
            <Link to="/projects" className={getMobileLinkClass("/projects")} onClick={closeMenu}>
              Projects
            </Link>
            <Link to="/contact" className={getMobileLinkClass("/contact")} onClick={closeMenu}>
              Contact
            </Link>
            
            {/* Mobile Theme Toggle Button */}
            <button 
              onClick={() => { toggleTheme(); closeMenu(); }}
              className="flex items-center gap-2 font-black text-base text-slate-600 dark:text-slate-305 hover:text-[#13d179] dark:hover:text-[#13d179] transition py-1 cursor-pointer"
            >
              {theme === "dark" ? (
                <>
                  <FaSun size={15} className="text-amber-400" />
                  <span>Açık Tema</span>
                </>
              ) : (
                <>
                  <FaMoon size={14} className="text-slate-600" />
                  <span>Koyu Tema</span>
                </>
              )}
            </button>

            <Link to="/admin" className="navbar-link text-[#13d179] font-black text-sm" onClick={closeMenu}>
              Admin
            </Link>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
