import React from "react";
import { motion } from "framer-motion";
import ShopVerseIllustration from "../Components/ShopVerseIllustration";

export default function About() {
    return (
        <div className="min-h-screen mt-20 bg-lightCard dark:bg-darkCard rounded-lg shadow">
            {/* 🔹 Hero Section */}
            <section className="bg-gradient-to-r from-orange-400 to-indigo-700 text-white py-16 sm:py-20 px-4 sm:px-6 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
                >
                    About <span className="text-yellow-300">ShopVerse</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="max-w-2xl mx-auto text-base sm:text-lg text-blue-100 px-2"
                >
                    Discover the next generation of online shopping — simple, smart, and secure.
                </motion.p>
            </section>

            {/* 🔹 About Content */}
            <section className="max-w-6xl mx-auto py-12 sm:py-16 px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
                
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <ShopVerseIllustration className="rounded-2xl shadow-lg w-full h-auto" />
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 text-center md:text-left">
                        Who We Are
                    </h2>
                    <p className="text-base sm:text-lg mb-4 leading-relaxed text-justify">
                        <span className="font-semibold text-blue-600">ShopVerse</span> is a
                        modern eCommerce platform built to connect customers with the best
                        local and global sellers. Our mission is to create a seamless and
                        enjoyable shopping experience powered by trust, technology, and
                        transparency.
                    </p>
                    <p className="text-base sm:text-lg mb-4 leading-relaxed text-justify">
                        We aim to empower businesses of all sizes — from small local shops
                        to large online stores — by providing them with the tools to reach
                        their customers effortlessly.
                    </p>
                    <p className="text-base sm:text-lg leading-relaxed text-justify">
                        At ShopVerse, we believe that shopping should be more than a
                        transaction — it should be an experience.
                    </p>
                </motion.div>
            </section>

            {/* 🔹 Mission & Vision */}
            <section className="py-12 sm:py-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl font-bold text-blue-700 mb-8 sm:mb-10"
                    >
                        Our Mission & Vision
                    </motion.h2>

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="p-6 sm:p-8 bg-blue-50 rounded-2xl shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-700">
                                🌍 Our Mission
                            </h3>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                To revolutionize the digital shopping landscape by offering a
                                platform that values quality, customer satisfaction, and
                                innovation.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="p-6 sm:p-8 bg-blue-50 rounded-2xl shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-blue-700">
                                🚀 Our Vision
                            </h3>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                To be the world’s most customer-centric marketplace — where
                                technology meets trust, and every purchase feels personal.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 🔹 Call to Action */}
            <section className="text-center py-16 sm:py-20 bg-gradient-to-r from-violet-600 to-pink-400 text-white px-4 sm:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6"
                >
                    Join the Future of Shopping
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="text-base sm:text-lg mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto"
                >
                    Experience smarter, faster, and more reliable shopping — powered by
                    ShopVerse.
                </motion.p>
                <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-400 text-blue-800 font-semibold px-5 sm:px-6 py-3 rounded-full shadow-lg hover:bg-yellow-300 transition text-sm sm:text-base"
                >
                    Start Shopping
                </motion.a>
            </section>
        </div>
    );
}
