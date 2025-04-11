import React from "react";
import photo from "../assets/profil-foto.jpg";
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
      </div>
    </div>
  );
};

export default AboutMe;
