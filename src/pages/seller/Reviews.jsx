
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Star } from "lucide-react";

export default function SellerReviews() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/seller/reviews");
        if (data.success) setProducts(data.data || []);
      } catch (err) {
        console.error("Seller Reviews Error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <p className="text-gray-500">Loading reviews...</p>;

  if (products.length === 0)
    return <p className="text-gray-500">No products or reviews yet.</p>;

  return (
    <div className="space-y-6">
      {products.map((product) => {
        const reviews = product.reviews || [];

        return (
          <div
            key={product.productId}
            className="bg-white p-6 rounded-2xl shadow"
          >
            {/* Product Name + Average Rating */}
            <h2 className="text-xl font-semibold mb-2">
              {product.productName}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">
                {product.averageRating || 0}
              </span>
              <span className="text-gray-600">/ 5</span>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews for this product.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rv) => (
                  <div key={rv._id} className="border-b py-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">
                        {rv.user?.name || "Customer"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{rv.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mt-1">{rv.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
