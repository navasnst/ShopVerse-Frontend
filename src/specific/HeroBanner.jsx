
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ Added

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import banner5 from "../assets/banners/banner5.webp";
import banner6 from "../assets/banners/banner6.webp";
import banner4 from "../assets/banners/banner4.webp";

const HeroBanner = () => {
  const navigate = useNavigate(); // ✅ Initialize navigation

  const banners = [
    {
      img: banner6,
      title: "Big Festive Sale",
      desc: "New Arrivals in Mobiles & Gadgets.",
      link: "/products/6921f628f53b0c75230058b4",
    },
    {
      img: banner5,
      title: "Trending Now",
      desc: "Up to 20% off on Electronics.",
      link: "/products/6921fd09f53b0c7523005b7b",
    },
    {
      img: banner4,
      title: "Wonder Deals",
      desc: "Best Offers on mattress.",
      link: "/products/691e009632e4df74073e5e44",
    },
  ];

  return (
    <section className="relative w-full bg-gray-100 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="w-full h-[200px] sm:h-[200px] md:h-[200px] lg:h-[250px]"
      >
        {banners.map((b, i) => (
          <SwiperSlide key={i}>
            <motion.div
              className="relative w-full h-full cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              onClick={() => navigate(b.link)} // ✅ Redirect when clicking the banner
            >
              <img
                src={b.img}
                alt={b.title}
                className="w-full h-full object-cover"
              />
              {/* Overlay content */}
              <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-start text-white px-6 md:px-12">
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {b.title}
                </h2>
                <p className="text-sm sm:text-lg mt-2 drop-shadow-md">
                  {b.desc}
                </p>
                <button
                  className="mt-4 bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ Prevent triggering banner click
                    navigate(b.link);
                  }}
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;


