
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Save, Camera } from "lucide-react";
import { toast } from "react-toastify";

export default function SellerProfile() {
  const { token, user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shopName: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize formData from context user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        shopName: user.shopName || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      setLoading(true);
      let res;

      if (selectedFile) {
        const form = new FormData();
        Object.keys(formData).forEach((key) => form.append(key, formData[key]));
        form.append("profileImage", selectedFile);

        res = await api.put("/seller/profile", form, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        res = await api.put("/seller/profile", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        const updatedSeller = res.data.seller;

        // ✅ Update context and localStorage
        if (updateUser) updateUser(updatedSeller);

        setSelectedFile(null);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  const imagePreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : user.profileImage
      ? user.profileImage
      : "/default-avatar.png";

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        Seller Profile
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <img
            src={imagePreview}
            alt="Seller"
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-md"
          />
          <label
            htmlFor="profileImage"
            className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
          >
            <Camera size={18} color="#fff" />
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Shop Name</label>
          <input
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>
    </motion.div>
  );
}
