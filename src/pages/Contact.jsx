import { useState } from "react";
import emailjs from "emailjs-com";
import { FaWhatsapp, FaEnvelope, FaClock, FaCheckCircle } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Name required";
    if (!form.lastName.trim()) newErrors.lastName = "Surname required";
    if (!form.email.trim()) newErrors.email = "E-mail required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Geçerli e-posta girin";
    if (!form.message.trim()) newErrors.message = "Message required";
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) setErrors(validate());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setSending(true);

    emailjs
      .send("service_sn9avfy", "template_t7x7fc7", form, "_-KqqNx9CnRSES9xj")
      .then(() => {
        alert("Teşekkürler! Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğim.");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        setTouched({});
      })
      .catch(() => {
        alert("Gönderim sırasında bir hata oluştu. Lütfen doğrudan e-posta veya WhatsApp üzerinden ulaşın.");
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b0f19] px-4 py-8 sm:py-10 pt-28 transition-colors duration-300">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-[#121826] transition-colors duration-300">
        
        {/* SOL TARAF - BİLGİ & CTA */}
        <div className="w-full md:w-5/12 bg-slate-100 dark:bg-[#0e1422] text-slate-800 dark:text-white p-6 sm:p-10 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
          <div>
            <span className="px-3 py-1 bg-emerald-500/10 text-[#13d179] border border-emerald-500/20 rounded-full text-[11px] font-black uppercase tracking-wider mb-4 inline-block">
              Proje & İş Birliği
            </span>

            <h2 className="text-2xl sm:text-3xl font-black mb-4 uppercase tracking-wide text-slate-900 dark:text-white">
              Birlikte Çalışalım
            </h2>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed mb-6">
              Yeni bir web projesi, yazılım danışmanlığı veya freelance geliştirme talepleriniz için bana ulaşabilirsiniz.
            </p>

            <div className="space-y-4 mb-6">
              <a
                href="mailto:burakcetinkaya26@gmail.com"
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#13d179] flex items-center justify-center shrink-0">
                  <FaEnvelope size={14} />
                </div>
                <div className="text-xs">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">E-Posta</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">burakcetinkaya26@gmail.com</span>
                </div>
              </a>

              <a
                href="https://wa.me/?text=Merhaba%20Burak%20Bey,%20bir%20yaz%C4%B1l%C4%B1m%20projesi%20hakk%C4%B1nda%20g%C3%B6r%C3%BC%C5%9Fmek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#13d179] flex items-center justify-center shrink-0">
                  <FaWhatsapp size={16} />
                </div>
                <div className="text-xs">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Hızlı Mesaj</span>
                  <span className="font-extrabold text-[#13d179]">WhatsApp İle İletişime Geç →</span>
                </div>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <FaClock className="text-[#13d179]" /> 24 Saat İçinde Geri Dönüş Garantisi
          </div>
        </div>

        {/* SAĞ TARAF - FORM */}
        <div className="w-full md:w-7/12 bg-white dark:bg-[#121826] p-6 sm:p-10 transition-colors duration-300">
          <h2 className="text-xl sm:text-2xl font-black mb-2 text-slate-900 dark:text-white uppercase tracking-wider">
            Mesaj Gönderin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold">
            Projenizin detaylarını yazın, kısa sürede analiz edip dönüş yapayım.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Adınız
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("firstName")}
                  placeholder="Ahmet"
                  className={`block w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors.firstName && touched.firstName
                    ? "border-red-500"
                    : touched.firstName
                      ? "border-emerald-500/40"
                      : "border-slate-200 dark:border-slate-800"
                    }`}
                />
                {errors.firstName && touched.firstName && (
                  <p className="text-xs text-red-500 font-bold mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Soyadınız
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={() => handleBlur("lastName")}
                  placeholder="Yılmaz"
                  className={`block w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors.lastName && touched.lastName
                    ? "border-red-500"
                    : touched.lastName
                      ? "border-emerald-500/40"
                      : "border-slate-200 dark:border-slate-800"
                    }`}
                />
                {errors.lastName && touched.lastName && (
                  <p className="text-xs text-red-500 font-bold mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                E-Posta Adresiniz
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                placeholder="ahmet@ornek.com"
                className={`block w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors.email && touched.email
                  ? "border-red-500"
                  : touched.email
                    ? "border-emerald-500/40"
                    : "border-slate-200 dark:border-slate-800"
                  }`}
              />
              {errors.email && touched.email && (
                <p className="text-xs text-red-500 font-bold mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Proje Detayı / Mesajınız
              </label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                onBlur={() => handleBlur("message")}
                placeholder="Yaptırmak istediğiniz proje, web sitesi veya ihtiyaçlarınızı kısaca açıklayın..."
                className={`block w-full p-3 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors.message && touched.message
                  ? "border-red-500"
                  : touched.message
                    ? "border-emerald-500/40"
                    : "border-slate-200 dark:border-slate-800"
                  }`}
              />
              {errors.message && touched.message && (
                <p className="text-xs text-red-500 font-bold mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#13d179] text-[#0b0f19] p-4 rounded-xl hover:bg-emerald-400 transition font-black text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-emerald-500/20"
            >
              {sending ? "Gönderiliyor..." : "Mesajı Gönder"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;