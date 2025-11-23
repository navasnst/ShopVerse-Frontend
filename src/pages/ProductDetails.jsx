
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import ProductReviews from "../Components/ProductReviews";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);



  // ✅ ADD THIS — FIX IMAGE URL
  const getImageUrl = (img) => {
    if (!img) return "/images/default-product.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/uploads/"))
      return `http://localhost:5000${img}`;
    return `http://localhost:5000/uploads/${img}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product ? res.data.product : res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !product.offerEndDate) return;

    const interval = setInterval(() => {
      const end = new Date(product.offerEndDate).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("expired");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [product]);

  const handleAddToCart = () => {
    if (!token) return navigate("/login");
    addToCart(product, 1);
    alert("🛒 Added to cart!");
  };

  const handleBuyNow = () => {
    if (!token) return navigate("/login");
    navigate(`/checkout/${product._id}`, {
      state: {
        buyNow: true,
        product: {
          _id: product._id,
          title: product.title,
          price: !isOfferExpired && product.offerPrice ? product.offerPrice : product.price,

          quantity: 1,
          image: product.images?.[0],
        },
      },
    });

  };

  const handleRatingUpdate = (newRating, newCount) => {
    setProduct((prev) => ({
      ...prev,
      rating: newRating,
      numReviews: newCount,
    }));
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!product) return <p className="text-center py-10">Product not found</p>;

  const isOfferExpired =
    product.offerEndDate &&
    new Date(product.offerEndDate).getTime() < Date.now();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="container mx-auto px-6 py-10 mt-10">
      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT IMAGES */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex gap-4">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-2">
              {product.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(img)}
                  alt={`Thumbnail ${idx}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-gray-300"
                  onClick={() => setMainImage(getImageUrl(img))}
                />
              ))}
            </div>

            {/* MAIN IMAGE */}
            <div className="flex-1">
              <img
                src={mainImage || getImageUrl(product.images?.[0])}
                alt="Product"
                className="w-full h-[400px] object-contain rounded-2xl border border-gray-200 p-2"
              />
            </div>
          </div>

        </motion.div>

        {/* RIGHT INFO */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold">{product.title}</h2>

          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-lg">
              ⭐ {product.rating ? product.rating.toFixed(1) : "0.0"}
            </span>
            <span className="text-gray-600 text-sm">
              ({product.numReviews || 0} reviews)
            </span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {product.offerPrice && !isOfferExpired ? (
            <div>
              <p className="text-2xl font-semibold text-red-600">
                ₹{product.offerPrice}
              </p>
              <p className="text-gray-500 line-through">₹{product.price}</p>

              <p className="text-green-600 font-medium">
                {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
              </p>

              {timeLeft && timeLeft !== "expired" && (
                <p className="text-orange-600 text-sm mt-1">Offer ends in: {timeLeft}</p>
              )}

              {isOfferExpired && (
                <p className="text-red-600 text-sm">Offer expired</p>
              )}
            </div>
          ) : (
            <p className="text-2xl font-semibold text-blue-600">₹{product.price}</p>
          )}


          <p className="text-sm text-gray-500">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 
    ${product.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-yellow-300 hover:to-orange-300"
              }`}
          >
            <ShoppingCart size={18} /> Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className={`px-5 py-2 rounded-lg 
    ${product.stock <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-500 to-yellow-400 text-white hover:bg-blue-500"
              }`}
          >
            Buy Now
          </button>


        </motion.div>
      </div>

      {/* REVIEWS */}
      <ProductReviews
        productId={product._id}
        onRatingUpdate={handleRatingUpdate}
      />
    </div>
  );
}
