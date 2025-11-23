
import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Star, Trash2, Edit } from "lucide-react";

export default function ProductReviews({ productId }) {
  const { token, user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReview, setEditingReview] = useState(null);

  // ✅ Fetch reviews safely
  useEffect(() => {
    if (!productId) return; // 🧠 Prevent undefined error
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/${productId}`);
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Error fetching reviews:", err.message);
      }
    };
    fetchReviews();
  }, [productId]);

  // ✅ Submit or update review

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) return alert("Please fill all fields");

    try {
      const { data } = await api.post(
        `/reviews/${productId}`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prev) => {
        return prev.map((r) => {
          // Handle cases where user is an object OR an ID string
          const rUserId = typeof r.user === "string" ? r.user : r.user?._id;
          const newUserId =
            typeof data.review.user === "string"
              ? data.review.user
              : data.review.user?._id;

          return rUserId === newUserId ? data.review : r;
        });
      });

      // If user did not have a review before, append it
      const reviewExists = reviews.some((r) => {
        const rUserId = typeof r.user === "string" ? r.user : r.user?._id;
        const newUserId =
          typeof data.review.user === "string"
            ? data.review.user
            : data.review.user?._id;

        return rUserId === newUserId;
      });

      if (!reviewExists) {
        setReviews((prev) => [data.review, ...prev]);
      }

      setRating(0);
      setComment("");
      setEditingReview(null);
    } catch (err) {
      alert("Failed to submit review");
      console.error("Submit review error:", err.message);
    }
  };


  // ✅ Delete review
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Error deleting review");
      console.error("Delete review error:", err.message);
    }
  };

  // ✅ Edit review
  const handleEdit = (review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReview(review._id);
  };

  return (
    <div className="mt-10 ">
      <h2 className="text-xl font-bold mb-3 pl-5">Customer Reviews</h2>

      {/* Review List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 pl-5">No reviews yet.</p>
      ) : (
        <div className="space-y-4 ">
          {reviews.map((r) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${i < r.rating ? "text-yellow-500" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 font-medium">{r.user?.name}</p>
                </div>

                {user && r.user?._id === user._id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mt-2">{r.comment}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Review */}
      {token && (
        <form onSubmit={handleSubmit} className="mt-8 bg-gray-50 p-4 rounded-xl ">
          <h3 className="font-semibold mb-2 pl-2">
            {editingReview ? "Edit your review" : "Write a review"}
          </h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className={`cursor-pointer ${i < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <textarea
            className="w-full border rounded-lg p-2"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
          ></textarea>
          <button
            type="submit"
            className="mt-3 bg-gradient-to-r from-red-800 to-red-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}










