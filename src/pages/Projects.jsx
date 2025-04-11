import React, { useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";

const projects = {
  portfolio: {
    title: "Eventeaze",
    description: "Event discovery application built with React and Tailwind.",
    link: "https://eventeaze.netlify.app/",
  },
  blog: {
    title: "Petty Online Veterinary",
    description:
      "TÜBİTAK 2209 approved project, AI-powered Online Veterinary Consultation and Appointment System",
    link: "https://github.com/thecetinkaya/pettyproject",
  },
  ecommerce: {
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
    <div className="flex flex-col items-center w-[90%] sm:w-[80%] mx-auto h-screen p-4 sm:pt-32">
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
      </div>
    </div>
  );
};

export default Projects;
