
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product, showWishlistActions, onMoveToCart, onRemove }) {
  const { token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  // ✅ Make heart red if wishlist item exists, gray otherwise
  useEffect(() => {
    setLiked(!!product.inWishlist);
  }, [product.inWishlist]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");

    addToCart(product, 1);
    alert("🛒 Added to cart!");
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) return navigate("/login");

    try {
      if (liked) {
        await api.delete(`/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(
          `/wishlist`,
          { productId: product._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setLiked(!liked); // dynamically update heart color
    } catch (err) {
      alert("Failed to update wishlist");
    }
  };

  const getImgUrl = (img) => {
    if (!img) return "/images/default-product.jpg";
    if (img.startsWith("http")) return img;
    return "/images/default-product.jpg";
  };

  const imgSrc =
    product?.images?.length > 0 ? getImgUrl(product.images[0]) : "/images/default-product.jpg";

  return (
    <div className="border rounded p-3 flex flex-col hover:shadow-md transition relative
                    sm:p-4 md:p-5 lg:p-6
                    sm:w-full md:w-full lg:w-full">
      {/* Wishlist Heart */}
      <button
        onClick={toggleWishlist}
        className="absolute top-2 right-2 z-10"
        title={liked ? "Remove from Wishlist" : "Add to Wishlist"}
      >
        <Heart className={liked ? "text-red-500" : "text-gray-300"} size={20} />
      </button>

      <Link to={`/products/${product._id}`}>
        <div className="w-full h-44 sm:h-48 md:h-52 lg:h-56 bg-gray-100 mb-3 overflow-hidden rounded">
          <img
            src={imgSrc}
            alt={product.title}
            className="w-full h-full object-contain p-2 bg-white"
          />
        </div>

      </Link>

      <div className="flex-1">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-medium text-sm sm:text-base md:text-base lg:text-base mb-1">
            {product.title}
          </h3>
        </Link>

        <p className="text-lg sm:text-lg md:text-xl lg:text-xl font-semibold mb-2">
          ₹{product.price}
        </p>

        <div className="text-sm sm:text-sm md:text-base lg:text-base text-gray-600 mb-2">
          {product.vendor?.shopName || product.vendor?.name || "Unknown vendor"}
        </div>

        <div className="flex items-center justify-between text-sm sm:text-sm md:text-base lg:text-base">
          <div className="text-yellow-600">
            ⭐ {(product.rating || 0).toFixed(1)} ({product.numReviews || 0})
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-emerald-500 text-white text-sm sm:text-sm md:text-base lg:text-base px-3 py-1 rounded hover:bg-emerald-600 transition"
          >
            Add to Cart
          </button>
        </div>

        {showWishlistActions && (
          <div className="mt-3 flex flex-col sm:flex-row sm:justify-between gap-2">

            <button
              onClick={() => onRemove && onRemove()}
              className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 w-full sm:w-auto"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
