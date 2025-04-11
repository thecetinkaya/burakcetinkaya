import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import photo from "../assets/profil-foto.jpg";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const text = "Hello, I'm a Full Stack Developer!";

const Dashboard = () => {
  const Navigate = useNavigate();
  const handleClick = () => {
    Navigate("/contact");
  };
  return (
    <div className="h-screen bg-gray-50 text-[#030526] flex items-center justify-center pt-16 sm:pt-[130px] md:pt-0">
      <div className="w-[80%] sm:w-[80%] grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* SOL KISIM */}
        <div className="flex flex-col justify-center items-center text-center sm:text-center">
          <Motion.p
            className="text-4xl sm:text-6xl font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5, // Yazının görünme süresi
              duration: 1,
            }}
          >
            {text.split("").map((char, index) => (
              <Motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: index * 0.1, duration: 0.05 }, // Harfler arasında gecikme
                }}
              >
                {char}
              </Motion.span>
            ))}
          </Motion.p>

          <button
            onClick={handleClick}
            className="cursor-crosshair mt-4 bg-[#030526] text-white px-6 py-2 rounded-lg hover:bg-gray-200 hover:text-[#030526] transition"
          >
            Contact Me
          </button>
        </div>

        {/* SAĞ KISIM */}
        <div className="flex flex-col justify-center items-center gap-6 sm:items-center">
          <img
            src={photo}
            alt="Burak Çetinkaya"
            className="rounded-lg w-64 h-64 sm:w-96 sm:h-96 object-cover shadow-lg"
          />

          {/* Sosyal Medya Kutusu */}
          <div className="bg-white text-[#1e293b] rounded-xl p-4 flex flex-col items-center shadow-lg w-full max-w-sm">
            <h3 className="text-lg sm:text-xl font-bold mb-3">Follow Me</h3>
            <div className="flex gap-4 sm:gap-6 text-2xl">
              <a
                href="https://github.com/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] transition"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com/in/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] transition"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://twitter.com/xburakcetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/thecetinkaya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#aa0f69] transition"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
