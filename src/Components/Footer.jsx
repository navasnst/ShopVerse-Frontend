
import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white mt-20">
            <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
                {/* About Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">About ShopVerse</h2>
                    <p className="text-gray-200 leading-relaxed text-sm">
                        ShopVerse is your ultimate universe of shopping. Explore electronics,
                        fashion, home essentials, and more. Quality, convenience, and style – all in one place!
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/products"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Support
                            </Link>
                        </li>
                    </ul>
                </div>


                {/* Terms & Policies */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Terms & Policies</h2>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/terms-policies#privacy-policy"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-policies#terms-of-service"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Terms of Service
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-policies#return-policy"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Return Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-policies#shipping-policy"
                                className="hover:text-emerald-300 cursor-pointer transition"
                            >
                                Shipping Policy
                            </Link>
                        </li>
                    </ul>
                </div>


                {/* Social Media & Contact */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Connect With Us</h2>
                    <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                            <Facebook size={24} />
                        </a>
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                            <Instagram size={24} />
                        </a>
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                            <Twitter size={24} />
                        </a>
                        <a href="#" className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition">
                            <Linkedin size={24} />
                        </a>
                    </div>

                    <div className="text-gray-200 space-y-1 text-sm">
                        <p>
                            Email:{" "}
                            <a
                                href="mailto:shopverseproject@gmail.com"
                                className="text-white font-medium hover:underline"
                            >
                                support@shopverse.com
                            </a>
                        </p>

                        <p>Phone: <span className="text-white font-medium">+91 9876543210</span></p>
                        <p>Address: <span className="text-white font-medium">Manjeri, Malappuram, Kerala, India</span></p>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/20 mt-8 py-4 text-center text-gray-200">
                © 2025 ShopVerse. All rights reserved.
            </div>
        </footer>
    );
}
