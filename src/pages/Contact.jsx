import { useState } from "react";
import emailjs from "emailjs-com";

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
        alert("Thanks! Your message has been sent successfully");
        setForm({ firstName: "", lastName: "", email: "", message: "" });
        setTouched({});
      })
      .catch(() => {
        alert("Gönderim sırasında bir hata oluştu.");
      })
      .finally(() => setSending(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0b0f19] px-4 py-8 sm:py-10 pt-26 transition-colors duration-300">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800/85 bg-white dark:bg-[#121826] transition-colors duration-300">
        {/* SOL TARAF */}
        <div className="w-full md:w-1/2 bg-slate-100 dark:bg-[#121826] text-slate-800 dark:text-white p-6 sm:p-10 flex flex-col justify-center border-r border-slate-200 dark:border-slate-800/50 transition-colors duration-300">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 uppercase tracking-wide text-[#13d179]">Contact Info</h2>
          <p className="mb-2 text-sm font-bold">✉️ E-mail: burakcetinkaya26@gmail.com </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            Feel free to contact us anytime. We’ll respond to your message as
            soon as possible.
          </p>
        </div>

        {/* SAĞ TARAF - FORM */}
        <div className="w-full md:w-1/2 bg-white dark:bg-[#121826] p-6 sm:p-10 transition-colors duration-300">
          <h2 className="text-xl sm:text-2xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-wider">
            Contact Me
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["firstName", "lastName", "email", "message"].map((field) => (
              <div key={field}>
                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {field === "firstName" ? "Name" : field === "lastName" ? "Surname" : field === "email" ? "E-mail" : "Message"}
                </label>
                {field !== "message" ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field)}
                    className={`mt-1 block w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors[field] && touched[field]
                      ? "border-red-500"
                      : touched[field]
                        ? "border-emerald-500/40"
                        : "border-slate-200 dark:border-slate-800"
                      }`}
                  />
                ) : (
                  <textarea
                    name={field}
                    rows="4"
                    value={form[field]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field)}
                    className={`mt-1 block w-full p-2.5 bg-slate-50 dark:bg-slate-900 border-2 rounded-xl transition-colors text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50 ${errors[field] && touched[field]
                      ? "border-red-500"
                      : touched[field]
                        ? "border-emerald-500/40"
                        : "border-slate-200 dark:border-slate-800"
                      }`}
                  />
                )}
                {errors[field] && touched[field] && (
                  <p className="text-xs text-red-500 font-bold mt-1.5">{errors[field]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#13d179] text-[#0b0f19] p-3.5 rounded-xl hover:bg-emerald-400 transition font-black text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer shadow"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;