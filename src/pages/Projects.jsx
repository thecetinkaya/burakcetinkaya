<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { db } from "../lib/supabase";

// Fallback projects if Supabase has no records yet
const FALLBACK_PROJECTS = {
  portfolio: {
    id: "fb-1",
    title: "Zeytinbahçem",
    description: "E-commerce platform for organic olives, olive oil and natural farm products.",
    link: "https://zeytinbahcem.com",
  },
  blog: {
    id: "fb-2",
=======
import React, { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const projects = {
  portfolio: {
    title: "Eventeaze",
    description: "Event discovery application built with React and Tailwind.",
    link: "https://eventeaze.netlify.app/",
  },
  blog: {
>>>>>>> e611b2202d26675a6022579a8b130c59f7809f6b
    title: "Petty Online Veterinary",
    description:
      "TÜBİTAK 2209 approved project, AI-powered Online Veterinary Consultation and Appointment System",
    link: "https://github.com/thecetinkaya/pettyproject",
  },
  ecommerce: {
<<<<<<< HEAD
    id: "fb-3",
    title: "Yöreselhane",
    description:
      "Premium e-commerce platform offering local, natural, and traditional gourmet delicacies.",
    link: "https://yoreselhane.com",
  },
};

const tabs = ["portfolio", "blog", "ecommerce"];

const getTabTitle = (tab) => {
  switch (tab) {
    case "portfolio": return "Portfolio";
    case "blog": return "Blog / Academic";
    case "ecommerce": return "E-Commerce / Enterprise";
    default: return tab;
  }
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [projectsData, setProjectsData] = useState({
    portfolio: [FALLBACK_PROJECTS.portfolio],
    blog: [FALLBACK_PROJECTS.blog],
    ecommerce: [FALLBACK_PROJECTS.ecommerce]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const { data: fetchedData, error } = await db.projects.fetchAll();
      if (error) throw error;
      
      let data = fetchedData || [];

      // Automatic migration to replace Eventeaze and Customer Management with correct projects
      const hasEventeaze = data.some(p => p.title === "Eventeaze");
      const hasCustManager = data.some(p => p.title === "Customer Management Application");
      const hasZeytinbahcem = data.some(p => p.title === "Zeytinbahçem" || p.link.includes("zeytinbahcem.com"));
      const hasYoreselhane = data.some(p => p.title === "Yöreselhane" || p.link.includes("yoreselhane.com"));

      let needReFetch = false;

      if (hasEventeaze) {
        const ev = data.find(p => p.title === "Eventeaze");
        if (ev && ev.id) {
          await db.projects.delete(ev.id);
          needReFetch = true;
        }
      }
      if (hasCustManager) {
        const cm = data.find(p => p.title === "Customer Management Application");
        if (cm && cm.id) {
          await db.projects.delete(cm.id);
          needReFetch = true;
        }
      }
      if (!hasZeytinbahcem) {
        await db.projects.create({
          title: "Zeytinbahçem",
          description: "E-commerce platform for organic olives, olive oil and natural farm products.",
          link: "https://zeytinbahcem.com",
          category: "portfolio"
        });
        needReFetch = true;
      }
      if (!hasYoreselhane) {
        await db.projects.create({
          title: "Yöreselhane",
          description: "Premium e-commerce platform offering local, natural, and traditional gourmet delicacies.",
          link: "https://yoreselhane.com",
          category: "ecommerce"
        });
        needReFetch = true;
      }

      if (needReFetch) {
        const { data: refreshedData } = await db.projects.fetchAll();
        data = refreshedData || [];
      }

      if (data && data.length > 0) {
        // Group projects by category
        const grouped = {
          portfolio: data.filter(p => p.category === "portfolio"),
          blog: data.filter(p => p.category === "blog"),
          ecommerce: data.filter(p => p.category === "ecommerce")
        };
        
        // If any tab has no projects, add the fallback preset so it's not blank
        if (grouped.portfolio.length === 0) grouped.portfolio = [FALLBACK_PROJECTS.portfolio];
        if (grouped.blog.length === 0) grouped.blog = [FALLBACK_PROJECTS.blog];
        if (grouped.ecommerce.length === 0) grouped.ecommerce = [FALLBACK_PROJECTS.ecommerce];

        setProjectsData(grouped);
      } else {
        setProjectsData({
          portfolio: [FALLBACK_PROJECTS.portfolio],
          blog: [FALLBACK_PROJECTS.blog],
          ecommerce: [FALLBACK_PROJECTS.ecommerce]
        });
      }
    } catch (err) {
      console.warn("Supabase'den projeler yüklenemedi, varsayılan listeye dönülüyor:", err);
      setProjectsData({
        portfolio: [FALLBACK_PROJECTS.portfolio],
        blog: [FALLBACK_PROJECTS.blog],
        ecommerce: [FALLBACK_PROJECTS.ecommerce]
      });
    } finally {
      setLoading(false);
    }
  };

  const currentProjects = projectsData[activeTab] || [FALLBACK_PROJECTS[activeTab]];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white pt-32 pb-16 flex flex-col items-center transition-colors duration-300">
      <div className="w-[90%] sm:w-[80%] flex flex-col items-center">
        <div className="relative bg-white dark:bg-[#121826] p-2 rounded-2xl w-full mb-8 shadow-lg border border-slate-200 dark:border-slate-800/80 transition-colors duration-300">
          {/* Tab Bar */}
          <ul className="flex flex-wrap justify-center items-center gap-2 relative">
            {tabs.map((tab) => (
              <li key={tab} className="relative z-10">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold transition-all relative z-10 cursor-pointer text-xs uppercase tracking-wider
                      ${
                        activeTab === tab
                          ? "text-white dark:text-[#0b0f19] font-black"
                          : "text-slate-500 dark:text-slate-400 hover:text-[#13d179]"
                      }`}
                >
                  {getTabTitle(tab)}
                </button>

                {activeTab === tab && (
                  <Motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#0b0f19] dark:bg-[#13d179] rounded-xl z-0"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Tab Content Grid */}
        <div className="w-full max-w-full mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">Yükleniyor...</div>
            ) : (
              <Motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              >
                {currentProjects.map((proj, idx) => (
                  <div 
                    key={proj.id || idx} 
                    className="p-6 bg-white dark:bg-[#121826] text-slate-800 dark:text-slate-200 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between hover:border-emerald-500/30 transition duration-200"
                  >
                    <div>
                      <h3 className="text-base font-black mb-3 text-[#13d179] uppercase tracking-wide">
                        {proj.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs mb-4 leading-relaxed font-semibold">
                        {proj.description}
                      </p>
                    </div>
                    <button
                      onClick={() => window.open(proj.link, "_blank")}
                      className="w-full bg-[#13d179] text-[#0b0f19] py-2.5 rounded-xl hover:bg-emerald-400 transition font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-4 shadow"
                    >
                      Go to Project
                    </button>
                  </div>
                ))}
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
=======
    title: "Customer Management Application",
    description:
      "This project contains a customer management application built using Vite, React, React Router Dom, and Tailwind CSS. You can perform actions such as fetching, sorting, and adding customer data.",
    link: "https://customermanagerapp.netlify.app",
  },
};

const tabs = Object.keys(projects);

const Projects = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  return (
    <div className="flex flex-col items-center w-[90%] sm:w-[80%] mx-auto h-screen p-4 pt-32 sm:pt-32">
      <div className="relative bg-white p-2 rounded-xl w-full mb-8 shadow-md border border-gray-300">
        {/* Tab Bar */}
        <ul className="flex flex-wrap justify-center sm:justify-center items-center gap-2 relative">
          {tabs.map((tab) => (
            <li key={tab} className="relative z-10">
              <button
                onClick={() => setActiveTab(tab)}
                className={`w-full sm:w-auto py-2 px-4 rounded-lg font-medium transition-all relative z-10
                    ${
                      activeTab === tab
                        ? "text-white"
                        : "text-gray-800 hover:text-[#aa0f69]"
                    }`}
              >
                {projects[tab].title}
              </button>

              {activeTab === tab && (
                <Motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#aa0f69] rounded-lg z-0"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-full mx-auto">
        <AnimatePresence mode="wait">
          <Motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-white text-[#030526] rounded-xl shadow-md border border-gray-300"
          >
            <h3 className="text-2xl font-bold mb-3 text-[#aa0f69]">
              {projects[activeTab].title}
            </h3>
            <p className="text-gray-700 text-lg">
              {projects[activeTab].description}
            </p>
            <button
              onClick={() => window.open(projects[activeTab].link, "_blank")}
              className="text-blue-500"
            >
              Go to Project
            </button>
          </Motion.div>
        </AnimatePresence>
>>>>>>> e611b2202d26675a6022579a8b130c59f7809f6b
      </div>
    </div>
  );
};

export default Projects;
