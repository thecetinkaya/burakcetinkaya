import "./App.css";
import Dashboard from "./pages/Dashboard";
import About from "./pages/AboutMe";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Navbar from "./pages/Navbar";
<<<<<<< HEAD
import Admin from "./pages/Admin";
=======
>>>>>>> e611b2202d26675a6022579a8b130c59f7809f6b
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
<<<<<<< HEAD
        <Route path="/admin" element={<Admin />} />
=======
>>>>>>> e611b2202d26675a6022579a8b130c59f7809f6b
      </Routes>
    </Router>
  );
}

export default App;
