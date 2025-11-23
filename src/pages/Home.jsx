
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import mobileImg from "../assets/categories/mobile.webp";
import tvImg from "../assets/categories/tv.webp";
import electronicsImg from "../assets/categories/electronics.webp";
import fashionImg from "../assets/categories/fashion.webp";
import homeImg from "../assets/categories/kitchen.webp";
import beautyImg from "../assets/categories/toys.webp";
import furnitureImg from "../assets/categories/furniture.webp";
import HeroBanner from "../specific/HeroBanner";

const categories = [
  { name: "Mobiles & Tablets", slug: "mobiles", img: mobileImg },
  { name: "TVs & Appliances", slug: "tv-appliances", img: tvImg },
  { name: "Electronics", slug: "electronics", img: electronicsImg },
  { name: "Fashion", slug: "fashion", img: fashionImg },
  { name: "Home & Kitchen", slug: "home-kitchen", img: homeImg },
  { name: "Beauty & Toys", slug: "beauty-toys", img: beautyImg },
  { name: "Furniture", slug: "furniture", img: furnitureImg },
];

const Home = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState([]);
  const [trending, setTrending] = useState([]);

  const goToProducts = () => {
    navigate("/products")
  }

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  // Load deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get("/products?limit=10&sort=price_low_to_high");
        setDeals(res.data.products);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTrending = async () => {
      try {
        const res = await api.get("/products?limit=10&sort=popular");
        setTrending(res.data.products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeals();
    fetchTrending();
  }, []);

  return (
    <>
      {/* ===================== CATEGORY SCROLLER ===================== */}
      <section className="bg-lightCard dark:bg-darkCard rounded-lg p-6 shadow-sm mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 md:justify-center w-full">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex-shrink-0 snap-center w-24 sm:w-28 md:w-32 lg:w-36 text-center cursor-pointer"
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition duration-300 flex flex-col items-center p-2">
                    <img
                      src={category.img}
                      alt={category.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto"
                    />
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium mt-2 mb-1 text-gray-800 leading-tight break-words">
                      {category.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HeroBanner />

     <div className="flex flex-col items-center justify-center bg-lightCard dark:bg-darkCard p-6 transition-colors duration-300">

        <h1 className="text-3xl font-bold mb-6 text-3xl font-bold mb-6 bg-lightCard dark:bg-darkCard">Welcome to Our Store</h1>
        <button
          onClick={goToProducts}
          className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
        >
          Browse Products
        </button>
      </div>

      {/* ===================== DEALS OF THE DAY ===================== */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl font-semibold mb-3">🔥 Deals of the Day</h2>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3">
          {deals.map((item) => (
            <div
              key={item._id}
              className="min-w-[180px] bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-md"
              onClick={() => navigate(`/products/${item._id}`)}
            >
              <img
                src={item.thumbnail || item.images?.[0]}
                className="w-full h-32 object-contain"
                alt={item.title}
              />
              <p className="text-sm font-medium mt-2 line-clamp-1">
                {item.title}
              </p>
              <p className="text-red-500 font-bold">₹{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== TRENDING PRODUCTS ===================== */}
      <section className="max-w-7xl mx-auto px-4 mt-10 mb-10">
        <h2 className="text-xl font-semibold mb-3">🔥 Trending Now</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {trending.map((item) => (
            <div
              key={item._id}
              className="bg-white shadow rounded-lg p-3 cursor-pointer hover:shadow-md"
              onClick={() => navigate(`/products/${item._id}`)}
            >
              <img
                src={item.thumbnail || item.images?.[0]}
                className="w-full h-32 object-contain"
                alt={item.title}
              />
              <p className="text-sm font-medium mt-2 line-clamp-1">
                {item.title}
              </p>
              <p className="text-blue-600 font-bold">₹{item.price}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;





