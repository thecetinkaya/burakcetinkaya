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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8 sm:py-10 pt-26">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl shadow-xl overflow-hidden">
        {/* SOL TARAF */}
        <div className="w-full md:w-1/2 bg-[#030526] text-white p-6 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Contact Info</h2>
          <p className="mb-2">✉️ E-mail: burakcetinkaya2699@gmail.com </p>
          <p className=" text-sm text-gray-300">
            Feel free to contact us anytime. We’ll respond to your message as
            soon as possible.
          </p>
        </div>

        {/* SAĞ TARAF - FORM */}
        <div className="w-full md:w-1/2 bg-white p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
            Contact Me
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["firstName", "lastName", "email", "message"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field === "firstName"
                    ? "Name"
                    : field === "lastName"
                    ? "Surname"
                    : field === "email"
                    ? "E-mail"
                    : "Message"}
                </label>
                {field !== "message" ? (
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field)}
                    className={`mt-1 block w-full p-2 border-2 rounded-md transition-colors text-sm sm:text-base ${
                      errors[field] && touched[field]
                        ? "border-red-500"
                        : touched[field]
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  />
                ) : (
                  <textarea
                    name={field}
                    rows="4"
                    value={form[field]}
                    onChange={handleChange}
                    onBlur={() => handleBlur(field)}
                    className={`mt-1 block w-full p-2 border-2 rounded-md transition-colors text-sm sm:text-base ${
                      errors[field] && touched[field]
                        ? "border-red-500"
                        : touched[field]
                        ? "border-green-500"
                        : "border-gray-300"
                    }`}
                  />
                )}
                {errors[field] && touched[field] && (
                  <p className="text-sm text-red-600 mt-1">{errors[field]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#030526] text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
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
