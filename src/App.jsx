import React, { Suspense, lazy } from "react";
import "./App.css";
import Navbar from "./pages/Navbar";
import SEO from "./components/SEO";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Code Splitting (Lazy Load Routes)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/AboutMe"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const KpssPage = lazy(() => import("./pages/KpssPage"));
const StudentWorkspacePage = lazy(() => import("./pages/StudentWorkspacePage"));

// Fast Skeleton Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#090e1a] text-slate-400">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold tracking-wider uppercase">Yükleniyor...</span>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <SEO />
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/kpss" element={<KpssPage />} />
          <Route path="/student" element={<StudentWorkspacePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
