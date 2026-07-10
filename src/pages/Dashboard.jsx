import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import photo from "../assets/profil-foto.jpeg";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const text = "Hello, I'm a Full Stack Developer!";

const Dashboard = () => {
  const Navigate = useNavigate();
  const handleClick = () => {
    Navigate("/contact");
  };
  return (
    <div className="h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white flex items-center justify-center pt-16 sm:pt-[130px] md:pt-0 transition-colors duration-300">
      <div className="w-[80%] sm:w-[80%] grid grid-cols-1 sm:grid-cols-2 gap-8">
        
        {/* SOL KISIM - TANITIM */}
        <div className="flex flex-col justify-center items-center text-center">
          <Motion.p
            className="text-4xl sm:text-6xl font-black mb-4 leading-tight tracking-tight text-slate-950 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {text.split("").map((char, index) => (
              <Motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: index * 0.035, duration: 0.05 }, // Harfler arası hızlı geçiş
                }}
              >
                {char}
              </Motion.span>
            ))}
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <button
              onClick={handleClick}
              className="cursor-pointer mt-4 bg-[#13d179] text-[#0b0f19] px-8 py-3 rounded-xl hover:bg-emerald-400 transition-all font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
            >
              Contact Me
            </button>
          </Motion.div>
        </div>

        {/* SAĞ KISIM - GÖRSEL VE SOSYAL MEDYA */}
        <Motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center items-center gap-6"
        >
          <img
            src={photo}
            alt="Burak Çetinkaya"
            className="rounded-2xl w-64 h-64 sm:w-96 sm:h-96 object-cover shadow-xl"
          />

          {/* Sosyal Medya Kutusu */}
          <div className="bg-white dark:bg-[#121826] text-slate-850 dark:text-white rounded-2xl p-4 flex flex-col items-center shadow-lg w-full max-w-sm border border-slate-200 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300">
            <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Follow Me</h3>
            <div className="flex gap-6 text-2xl">
              <a
                href="https://github.com/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] hover:scale-110 transition duration-150"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] hover:scale-110 transition duration-150"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com/xburakcetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] hover:scale-110 transition duration-150"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] hover:scale-110 transition duration-150"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
