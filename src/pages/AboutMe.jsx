import React from "react";
import photo from "../assets/profil-foto.jpg";
import { motion as Motion } from "framer-motion";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin,
  FaCertificate, FaBriefcase, FaGraduationCap, FaCode, FaCheck, FaLanguage
} from "react-icons/fa";

const educationData = [
  {
    school: "Çankırı Karatekin University",
    department: "Computer Engineering",
    degree: "Bachelor's Degree",
    date: "2021 - 2025",
    gpa: "2.82",
  },
  {
    school: "Burdur Mehmet Akif Ersoy University",
    department: "Computer Programming",
    degree: "Associate's Degree",
    date: "2018 - 2020",
    gpa: "3.45",
  }
];

const certificateData = [
  { title: "Siber Güvenlik Okulu", issuer: "Coderspace", date: "12/2024" },
  { title: "Beyaz Şapkalı Hacker ve Linux Eğitimi", issuer: "SiberVatan", date: "03/2024" }
];

const experienceData = [
  {
    type: "Intern",
    title: "Brisa Bridgestone Sabancı",
    location: "Kocaeli",
    date: "08/2025 - 09/2025",
    bullets: [
      "Participated in the development of a Next.js-based chatbot project",
      "Gained hands-on experience with Agile methodologies and Scrum practices",
      "Experienced corporate software development culture and team collaboration"
    ]
  },
  {
    type: "Intern",
    title: "CoCRM",
    location: "İzmir",
    date: "10/2024 - 11/2024",
    bullets: [
      "Completed an online internship focusing on data mining with Python",
      "Developed a project to extract company information from global datasets",
      "Gained experience in data analysis and information retrieval"
    ]
  },
  {
    type: "Intern",
    title: "Efe Eroğlu Yazılım",
    location: "Eskişehir",
    date: "08/2024 - 09/2024",
    bullets: [
      "Developed an internship application using Angular and Java Spring Boot",
      "Collaborated in a team to write clean and organized code with modern practices",
      "Improved knowledge in frontend-backend integration"
    ]
  },
  {
    type: "Project",
    title: "TÜBİTAK 2209-A Project: SmartVet",
    location: "Academic",
    date: "2024",
    bullets: [
      "Developed a modular, team-oriented frontend using React and Redux Toolkit",
      "Implemented responsive UI with Tailwind CSS",
      "Ensured secure JWT-based authentication"
    ]
  }
];

const technicalSkills = {
  Frontend: ["React", "Next.js", "Angular", "JavaScript", "TypeScript", "Redux"],
  Backend: ["Node.js", "Express.js", "Java", "Spring Boot", "Rest API"],
  Database: ["MySQL", "PostgreSQL"],
  "DevOps & Control": ["Docker", "CI/CD", "Git", "GitHub"]
};

const interpersonalSkills = [
  "Collaborative & interactive in the team environment",
  "Strong communication & leadership skills",
  "Highly adaptive to change",
  "Eager to face innovation challenges"
];

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white pt-28 pb-16 transition-colors duration-300">
      <div className="w-[90%] lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* SOL PANEL */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-colors duration-300">
            <img src={photo} alt="Burak Çetinkaya" className="w-32 h-32 rounded-2xl object-cover shadow-md" />
            <h1 className="mt-4 text-lg font-black tracking-tight text-slate-900 dark:text-white">Burak Çetinkaya</h1>
            <p className="text-[#13d179] text-xs font-bold uppercase tracking-wider mt-1">Full Stack Developer</p>
            <div className="w-full mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3.5 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <FaEnvelope className="text-[#13d179]" size={13} />
                <span>burakcetinkaya26@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-800 flex items-center gap-2">
              <FaGraduationCap className="text-[#13d179]" /> Education
            </h3>
            <div className="mt-4 space-y-4">
              {educationData.map((edu, idx) => (
                <div key={idx}>
                  <h4 className="text-xs font-extrabold">{edu.school}</h4>
                  <p className="text-[10px] uppercase font-bold text-slate-400">{edu.degree} • {edu.department}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 mb-3">Summary</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Full Stack Developer skilled in React, Next.js, and Node.js. Experienced in building scalable applications.
            </p>
          </div>

          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-800 flex items-center gap-2 mb-6">
              <FaBriefcase className="text-[#13d179]" /> Experience
            </h3>
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-8 ml-2">
              {experienceData.map((exp, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[33px] top-1.5 w-3 h-3 rounded-full bg-[#13d179]"></div>
                  <h4 className="text-sm font-black">{exp.title}</h4>
                  <span className="text-[10px] font-black uppercase text-slate-500">{exp.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;