import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsPolicies() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center px-6 py-10 bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow"
    >
      <div className="w-full max-w-4xl space-y-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
          Terms & Policies
        </h1>

        {/* Privacy Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Privacy Policy
          </h2>
          <p className="leading-relaxed text-justify">
            At <strong>ShopVerse</strong>, we value your privacy and are committed
            to protecting your personal information. We collect data only to
            provide better service, such as processing your orders and
            improving our platform. We do not sell, trade, or share your data
            with any third parties without your consent. Your information is
            stored securely and used strictly for business purposes.
          </p>
        </section>

        {/* Terms of Service */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Terms of Service
          </h2>
          <p className="leading-relaxed text-justify">
            By accessing or using <strong>ShopVerse</strong>, you agree to follow
            all applicable laws and our platform rules. You must not misuse our
            services for fraudulent or illegal activities. We reserve the right
            to suspend or terminate accounts that violate our policies. All
            products, prices, and offers are subject to change without prior
            notice.
          </p>
        </section>

        {/* Return Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Return Policy
          </h2>
          <p className="leading-relaxed text-justify">
            We want you to be completely satisfied with your purchase. If you
            receive a defective or incorrect item, please contact us within 7
            days of delivery. Eligible items may be returned or replaced in
            accordance with our return guidelines. Items must be unused and in
            their original packaging to qualify for a refund or exchange.
          </p>
        </section>

        {/* Shipping Policy */}
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Shipping Policy
          </h2>
          <p className="leading-relaxed text-justify">
            <strong>ShopVerse</strong> provides reliable and timely shipping
            across multiple locations. Orders are typically processed within
            24–48 hours and shipped using trusted carriers. Delivery times may
            vary based on your location and product availability. You will
            receive a confirmation email with tracking details once your order
            has been shipped.
          </p>
        </section>

        {/* Back to Home Button */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-200 hover:bg-blue-600 text-white rounded-full shadow-md transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
