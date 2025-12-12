
import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Save, Camera } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const { token, updateUser } = useContext(AuthContext);
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", bio: "" });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Admin Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAdmin(res.data.admin);
          setFormData({
            name: res.data.admin.name || "",
            email: res.data.admin.email || "",
            phone: res.data.admin.phone || "",
            bio: res.data.admin.bio || "",
          });
          setImagePreview(res.data.admin.profileImage);
        }
      } catch (err) {
        console.error("❌ Error fetching admin profile:", err);
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [token]);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload profile image
  const handleUploadImage = async () => {
    if (!selectedFile) return toast.warn("Select an image first!");
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      setLoading(true);
      const res = await api.post("/admin/profile/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const imageUrl = res.data.imageUrl;

        // ✅ Update both local state and AuthContext
        setImagePreview(imageUrl);
        updateUser({ profileImage: imageUrl });

        setSelectedFile(null);
        toast.success("Profile image updated!");
      }
    } catch (err) {
      console.error("❌ Image upload error:", err);
      toast.error("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await api.put("/admin/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setAdmin(res.data.admin);
      }
    } catch (err) {
      console.error("❌ Profile update error:", err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-[80vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
        Admin Profile
      </h2>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          {/* <img
            src={imagePreview || "/default-avatar.png"}
            alt="Admin"
            className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-md"
          /> */}
          <img
         src={
          imagePreview?.startsWith("http")
            ? imagePreview
            : `${import.meta.env.VITE_API_URL.replace("/api", "")}${imagePreview}`
          }
          alt="Admin"
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

        {selectedFile && (
          <button
            onClick={handleUploadImage}
            disabled={loading}
            className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
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
