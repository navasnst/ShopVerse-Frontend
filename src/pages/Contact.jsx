
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("❌ Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("⚠️ Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col mtbg-lightCard dark:bg-darkCard shadow">
      {/* 🔹 Hero Section */}
      <section className="bg-gradient-to-r from-rose-500 to-gray-700 text-white py-16 text-center px-6 mt-20 ">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
        >
          Contact <span className="text-yellow-300">ShopVerse</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto text-blue-100 text-base sm:text-lg"
        >
          We’d love to hear from you! Whether you have a question, feedback, or
          partnership idea — reach out to us below.
        </motion.p>
      </section>

      {/* 🔹 Contact Section */}
      <section className="max-w-6xl mx-auto w-full py-12 sm:py-16 px-6 grid md:grid-cols-2 gap-10 md:gap-16 flex-grow">
        {/* 📬 Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-lightCard dark:bg-darkCard">
            Get in Touch
          </h2>
          <p className=" text-base sm:text-lg leading-relaxed bg-lightCard dark:bg-darkCard">
            Have questions about our services or need help with your order?
            Our team is here to help — we’ll get back to you within 24 hours.
          </p>

          <div className="space-y-4 ">
            <div className="flex items-center gap-3 ">
              <MapPin className="text-blue-600" />
              <p className="text-gray-700">
                Manjeri, Malappuram, Kerala, India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <p className="text-gray-700">support@shopverse.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <p className="text-gray-700">+91 98765 43210</p>
            </div>
          </div>

          {/* 📍 Google Map — Manjeri Location */}
          <div className="mt-8">
            <iframe
              title="ShopVerse Location - Manjeri"
              className="w-full h-56 rounded-2xl shadow-md border-0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.501191038779!2d76.11771377579053!3d11.118419053591746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba63a09f75813ed%3A0x6e7492905f12c7e2!2sManjeri%2C%20Kerala%20676321!5e0!3m2!1sen!2sin!4v1730338888888!5m2!1sen!2sin"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        {/* 📝 Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 mb-6 text-center">
            Send Us a Message
          </h2>

          {submitted && (
            <div className="mb-4 text-green-600 text-center font-medium">
              ✅ Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your message here..."
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}


