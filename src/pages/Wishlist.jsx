import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../Components/ProductCard";

export default function Wishlist() {
  const { token } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get("/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Add `inWishlist` flag for ProductCard
        const products = data.products?.map((p) => ({ ...p.product, inWishlist: true })) || [];
        setWishlist(products);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      }
    };
    fetchWishlist();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to remove item");
    }
  };

  const handleMoveToCart = async (product) => {
    try {
      await api.post(
        "/cart",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await handleRemove(product._id);
      alert("Moved to cart");
    } catch {
      alert("Failed to move item");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          <p>No favorite items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              showWishlistActions
              onMoveToCart={() => handleMoveToCart(product)}
              onRemove={() => handleRemove(product._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
