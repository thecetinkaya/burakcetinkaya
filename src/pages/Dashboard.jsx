import React from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaCode, FaRocket, FaCheckCircle, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import photo from "../assets/profil-foto.jpeg";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const text = "Hello, I am Computer Engineer!";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-white pt-24 pb-16 transition-colors duration-300 flex flex-col items-center">
      
      {/* HERO SECTION */}
      <div className="w-[85%] lg:w-[80%] max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[75vh]">

        {/* SOL KISIM - TANITIM */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <span className="px-3.5 py-1 bg-emerald-500/10 text-[#13d179] border border-emerald-500/20 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            Computer Engineer & Software Specialist
          </span>

          <Motion.h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight tracking-tight text-slate-950 dark:text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {text.split("").map((char, index) => (
              <Motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.035, duration: 0.05 }}
              >
                {char}
              </Motion.span>
            ))}
          </Motion.h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-6 max-w-lg leading-relaxed font-semibold">
            Özel web çözümleri, modern ön yüz arayüzleri ve performanslı arka plan servisleri geliştiriyorum. Projelerinizi mühendislik yaklaşımıyla ölçeklenebilir ve güvenli olarak hayata geçiriyorum.
          </p>

          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <button
              onClick={handleContactClick}
              className="cursor-pointer bg-[#13d179] text-[#0b0f19] px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition-all font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0 duration-200 flex items-center gap-2"
            >
              <FaEnvelope size={14} /> Proje Başlat / İletişim
            </button>

            <a
              href="https://wa.me/?text=Merhaba%20Burak%20Bey,%20bir%20yaz%C4%B1l%C4%B1m%20projesi%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum."
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-6 py-3.5 rounded-xl hover:bg-emerald-600/20 transition-all font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <FaWhatsapp size={16} /> WhatsApp Hızlı Mesaj
            </a>
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
            alt="Burak Çetinkaya - Bilgisayar Mühendisi"
            className="rounded-3xl w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover shadow-2xl border-4 border-white dark:border-[#121826]"
          />

          {/* Sosyal Medya Kutusu */}
          <div className="bg-white dark:bg-[#121826] text-slate-800 dark:text-white rounded-2xl p-4 flex flex-col items-center shadow-lg w-full max-w-sm border border-slate-200 dark:border-slate-800/80 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Sosyal Medya & Bağlantılar</h3>
            <div className="flex gap-6 text-2xl">
              <a href="https://github.com/thecetinkaya" target="_blank" rel="noopener noreferrer" title="GitHub" className="hover:text-[#13d179] hover:scale-110 transition duration-150">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/thecetinkaya" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:text-[#13d179] hover:scale-110 transition duration-150">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com/xburakcetinkaya" target="_blank" rel="noopener noreferrer" title="Twitter / X" className="hover:text-[#13d179] hover:scale-110 transition duration-150">
                <FaTwitter />
              </a>
              <a href="https://instagram.com/thecetinkaya" target="_blank" rel="noopener noreferrer" title="Instagram" className="hover:text-[#13d179] hover:scale-110 transition duration-150">
                <FaInstagram />
              </a>
            </div>
          </div>
        </Motion.div>
      </div>

      {/* CALL TO ACTION / HİZMETLER BÖLÜMÜ (MÜŞTERİ KAZANIMI) */}
      <div className="w-[85%] lg:w-[80%] max-w-6xl mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/70">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-3">
            Bir Projeniz Mi Var? <span className="text-[#13d179]">Birlikte Çalışalım</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl mx-auto font-medium">
            Fikirlerinizi modern web teknolojileri, hızlı kullanıcı arayüzleri ve yüksek arama motoru görünürlüğü (SEO) ile gerçek projelere dönüştürelim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KART 1 */}
          <div className="bg-white dark:bg-[#121826] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#13d179] flex items-center justify-center text-xl mb-4 font-black">
                <FaCode />
              </div>
              <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">Özel Web Sitesi & Uygulama</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4">
                React, Next.js ve Tailwind CSS kullanarak mobil uyumlu, estetik ve ışık hızında açılan özel web siteleri geliştiriyorum.
              </p>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Responsive (Mobil Uyumlu)</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Modern UI/UX Tasarımı</li>
            </ul>
          </div>

          {/* KART 2 */}
          <div className="bg-white dark:bg-[#121826] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#13d179] flex items-center justify-center text-xl mb-4 font-black">
                <FaRocket />
              </div>
              <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">SEO & Arama Motoru Optimizasyonu</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4">
                Google aramalarında üst sıralara çıkmanız için profesyonel SEO etiketleri, hızlı yüklenme süreleri ve şema altyapısı kuruyorum.
              </p>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Google İndeksleme & Schema.org</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Yüksek Sayfa Hızı (PageSpeed)</li>
            </ul>
          </div>

          {/* KART 3 */}
          <div className="bg-white dark:bg-[#121826] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-lg hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#13d179] flex items-center justify-center text-xl mb-4 font-black">
                <FaEnvelope />
              </div>
              <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">Arka Plan & Veritabanı (Backend)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-4">
                Node.js, Express, Supabase ve SQL mimarileriyle güvenli API servisleri, kullanıcı yönetimi ve veritabanı sistemleri oluşturuyorum.
              </p>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Güvenli RESTful API Servisleri</li>
              <li className="flex items-center gap-2"><FaCheckCircle className="text-[#13d179]" size={12} /> Supabase & SQL Mimarisi</li>
            </ul>
          </div>
        </div>

        {/* ALT CTA BARI */}
        <div className="mt-10 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-slate-900 p-8 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-black text-white mb-1">Hemen Proje Teklifi Alın</h3>
            <p className="text-xs text-emerald-200/80 font-medium">Hayalinizdeki yazılımı detaylandırmak ve zaman planını belirlemek için mesaj gönderin.</p>
          </div>
          <button
            onClick={handleContactClick}
            className="cursor-pointer bg-[#13d179] text-[#0b0f19] px-8 py-3.5 rounded-xl hover:bg-emerald-400 transition font-black text-xs uppercase tracking-wider shrink-0 shadow-lg"
          >
            İletişime Geçin →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;