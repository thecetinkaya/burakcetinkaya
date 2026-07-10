import React from "react";
import photo from "../assets/profil-foto.jpg";
<<<<<<< HEAD
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
  {
    title: "Siber Güvenlik Okulu",
    issuer: "Coderspace",
    date: "12/2024"
  },
  {
    title: "Beyaz Şapkalı Hacker ve Linux Eğitimi",
    issuer: "SiberVatan",
    date: "03/2024"
  }
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
    type: "Intern",
    title: "Mergentech",
    location: "Eskişehir",
    date: "02/2020 - 06/2020",
    bullets: [
      "Worked on real-life projects using Java and SQL",
      "Gained foundational experience in backend development and database design"
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
  "DevOps & Control": ["Docker", "CI/CD", "Git", "GitHub"],
  "Utilities & Auth": ["HTML", "CSS", "JWT"]
};

const interpersonalSkills = [
  "Collaborative & interactive in the team environment",
  "Strong communication & leadership skills",
  "Good presentation skills",
  "Highly adaptive to change",
  "Willing to self-develop",
  "Eager to face innovation challenges"
];

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white pt-28 pb-16 transition-colors duration-300">
      <div className="w-[90%] lg:w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* SOL PANEL (SIDEBAR) */}
        <div className="space-y-6">
          
          {/* 1. Profil & İletişim Kartı */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center shadow-lg transition-colors duration-300">
            <img
              src={photo}
              alt="Burak Çetinkaya"
              className="w-32 h-32 rounded-2xl object-cover shadow-md cursor-pointer"
            />
            <h1 className="mt-4 text-lg font-black tracking-tight text-slate-900 dark:text-white">Burak Çetinkaya</h1>
            <p className="text-[#13d179] text-xs font-bold uppercase tracking-wider mt-1">Full Stack Developer</p>
            
            {/* İletişim Detayları */}
            <div className="w-full mt-6 pt-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3.5 text-left">
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <FaEnvelope className="text-[#13d179] shrink-0" size={13} />
                <span className="truncate" title="burakcetinkaya26@gmail.com">burakcetinkaya26@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                <FaMapMarkerAlt className="text-[#13d179] shrink-0" size={13} />
                <span>Ankara, Türkiye</span>
              </div>
            </div>
          </div>

          {/* 2. Eğitim & Sertifikalar */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <FaGraduationCap className="text-[#13d179]" /> Education
            </h3>
            <div className="mt-4 space-y-4 text-left">
              {educationData.map((edu, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{edu.school}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-5xs font-bold uppercase">{edu.degree} • {edu.department}</p>
                  <p className="text-[#13d179] text-5xs font-black uppercase tracking-wide">
                    {edu.date} • GPA: {edu.gpa}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mt-8">
              <FaCertificate className="text-[#13d179]" /> Certificates
            </h3>
            <div className="mt-4 space-y-4 text-left">
              {certificateData.map((cert, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight">{cert.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-5xs font-bold uppercase">{cert.issuer}</p>
                  <p className="text-slate-450 dark:text-slate-500 text-5xs font-black uppercase tracking-wider">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Bağlantılar & Diller */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg space-y-6 text-left transition-colors duration-300">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-3">
                <FaLanguage className="text-[#13d179]" /> Languages
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Turkish</span>
                  <span className="text-[#13d179] font-black uppercase text-5xs tracking-wider">Native</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">English</span>
                  <span className="text-[#13d179] font-black uppercase text-5xs tracking-wider">Intermediate</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-3">
                <FaCode className="text-[#13d179]" /> Links
              </h3>
              <div className="space-y-3.5">
                <a 
                  href="https://github.com/thecetinkaya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 hover:text-[#13d179] dark:hover:text-[#13d179] transition duration-150"
                >
                  <FaGithub size={14} />
                  <span className="font-semibold">github.com/thecetinkaya</span>
                </a>
                <a 
                  href="https://linkedin.com/in/thecetinkaya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 hover:text-[#13d179] dark:hover:text-[#13d179] transition duration-150"
                >
                  <FaLinkedin size={14} />
                  <span className="font-semibold">linkedin.com/in/thecetinkaya</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* SAĞ PANEL (MAIN CONTENT) */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* Summary / Özet */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#13d179]"></div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-455 dark:text-slate-500 mb-3">Summary</h3>
            <p className="text-slate-700 dark:text-slate-305 text-sm sm:text-base leading-relaxed font-medium">
              Full Stack Developer skilled in React, Next.js, and Node.js. Experienced in building scalable and user-friendly web applications using modern technologies. Adept in Agile and Scrum environments with strong teamwork and problem-solving abilities. Currently focused on designing and implementing end-to-end Full-Stack projects.
            </p>
          </div>

          {/* Deneyimler ve Projeler (Timeline) */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-6">
              <FaBriefcase className="text-[#13d179]" /> Experience & Projects
            </h3>
            
            <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-8 ml-2">
              {experienceData.map((exp, idx) => (
                <div key={idx} className="relative">
                  
                  {/* Timeline Dot Indicator */}
                  <div className="absolute -left-[33px] top-1.5 w-3 h-3 rounded-full bg-[#13d179] border-2 border-white dark:border-[#121826] shadow-sm shadow-[#13d179]/50 animate-pulse"></div>
                  
                  {/* Card Content */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-baseline gap-2 justify-between">
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">{exp.title}</h4>
                      <span className="text-slate-450 dark:text-slate-500 text-5xs font-black uppercase tracking-wider">{exp.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 text-5xs font-black tracking-wide uppercase">
                      <span className="bg-emerald-500/10 text-[#13d179] px-2 py-0.5 rounded border border-emerald-500/15">
                        {exp.type}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">• {exp.location}</span>
                    </div>

                    <ul className="list-none space-y-1.5 pt-1">
                      {exp.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-2">
                          <span className="text-[#13d179] mt-1 shrink-0">•</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Teknik Yetenekler (Grid Tag Style) */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-5">
              <FaCode className="text-[#13d179]" /> Technical Skills
            </h3>
            
            <div className="space-y-4">
              {Object.entries(technicalSkills).map(([category, list]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-600 dark:text-slate-355">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {list.map((skill) => (
                      <span 
                        key={skill}
                        className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-lg text-slate-600 dark:text-slate-303 hover:border-emerald-500/30 hover:text-slate-900 dark:hover:text-white transition duration-150 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpersonal Skills Checklist */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 mb-5">
              <FaCheck className="text-[#13d179]" /> Interpersonal Skills
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interpersonalSkills.map((skill, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <FaCheck className="text-[#13d179] mt-0.5 shrink-0" size={12} />
                  <span className="text-xs text-slate-650 dark:text-slate-300 font-semibold leading-normal">{skill}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

=======
import { AnimatePresence, motion as Motion } from "framer-motion";

const educationData = {
  bachelors: {
    school: "Çankırı Karatekin University",
    department: "Computer Engineering",
    degree: "Bachelor's Degree",
    graduationDate: "2021-2025",
    gpa: "2.82",
  },
  associate: {
    school: "Burdur Mehmet Akif Ersoy University",
    department: "Computer Programming",
    degree: "Associate's Degree",
    graduationDate: "2018-2020",
    gpa: "3.45",
  },
};
const ExperienceCard = ({ company, city, date, description }) => {
  return (
    <div className="flex flex-col md:flex-row bg-white border border-gray-300 rounded-2xl shadow-md overflow-hidden mb-6 w-full max-w-full">
      {/* Sol Kısım - Şirket Bilgileri */}
      <div className="bg-[#030526] text-white p-4 w-full md:w-1/3 flex flex-col justify-center items-start gap-1">
        <h4 className="text-lg font-bold">{company}</h4>
        <p className="text-sm">{city}</p>
        <p className="text-sm">{date}</p>
      </div>

      {/* Sağ Kısım - Açıklama */}
      <div className="p-4 w-full md:w-2/3 text-left text-gray-700">
        <p>{description}</p>
      </div>
    </div>
  );
};

const AboutMe = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-[#030526] pt-26">
      <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Sol Kısım */}
        <div className="p-6 flex flex-col items-center border-gray-300">
          <img
            src={photo}
            alt="Profil Foto"
            className="w-32 h-32 rounded-xl object-cover shadow-lg"
          />

          <h1 className="mt-5 text-lg font-semibold mb-4 text-center bg-[#aa0f69] hover:bg-[#030526] text-white px-4 py-2 rounded-lg shadow-md">
            Full Stack Developer
          </h1>

          {/* Yetenekler */}
          <div className="w-full text-base space-y-4 text-center">
            <div className="bg-[#030526] text-white rounded-lg text-lg">
              Skills
            </div>
            {[
              {
                title: "Frontend",
                skills: "React, HTML, CSS, Tailwind, JavaScript",
              },
              { title: "Backend", skills: "Node.js, Express, MongoDB" },
              { title: "Utilities", skills: "Git, GitHub, Vite, Figma" },
            ].map((item, index) => (
              <Motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="border border-[#030526] bg-white rounded-lg shadow hover:shadow-md"
              >
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.skills}</p>
              </Motion.div>
            ))}
          </div>
          <div className="mt-3 w-full text-center">
            <div className="bg-[#030526] text-white p-1 rounded-lg">
              Education
            </div>
            {Object.values(educationData).map((item, index) => (
              <Motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="border border-[#030526] bg-white rounded-lg shadow hover:shadow-md mt-2"
              >
                <p className="text-[#030526] font-bold mb-1">{item.school}</p>
                <h3 className="text-gray-600">{item.degree}</h3>
                <p className="text-gray-600">{item.department}</p>
                <p className="text-gray-600">
                  {item.graduationDate} - GPA: {item.gpa}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>

        {/* Sağ Kısım */}
        <div className="md:col-span-2 flex flex-col items-center justify-start p-8">
          <div className="text-center bg-[#030526] rounded-2xl text-2xl w-full text-white p-2 shadow-md border border-gray-300 mb-5">
            About Me
          </div>
          <div className="text-center bg-white rounded-2xl text-[#030526] p-6 shadow-md border border-gray-300 mb-8">
            <p className="mt-2">
              As a web developer, I specialise in React, JavaScript, Tailwind
              CSS and Bootstrap for dynamic frontend projects. My backend skills
              include Java Spring Boot and Node.js. I thrive in collaborative
              environments and am constantly honing my web development skills.
            </p>
          </div>
          <div className="text-center bg-[#030526] rounded-2xl text-2xl w-full text-white p-2 shadow-md border border-gray-300 mb-5">
            Work Experience
          </div>
          <ExperienceCard
            company="CoCRM"
            city="İzmir"
            date="10/2024 - 11/2024"
            description="I did an online internship at CoCRM and learned about data mining with Python. We developed a project to extract company information by working with data sets of companies around the world."
          />

          <ExperienceCard
            company="Efe Eroglu Yazılım"
            city="Eskişehir"
            date="08/2024 - 09/2024"
            description="We developed an internship application using Angular and Java Spring Boot. Working as a team, we focused on writing clean and organised code using modern technologies."
          />

          <ExperienceCard
            company="Mergentech"
            city="Eskişehir"
            date="02/2020 - 06/2020"
            description="I gained experience with real-life projects using Java and SQL."
          />
        </div>
>>>>>>> e611b2202d26675a6022579a8b130c59f7809f6b
      </div>
    </div>
  );
};

export default AboutMe;
