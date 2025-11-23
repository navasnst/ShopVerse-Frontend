
import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { updateUser, logout, user: authUser } = useContext(AuthContext);
  const [user, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem("shopverseToken");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    shippingAddress: "",
    password: "",
    newPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // -------------------- Fetch Profile --------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.user || res.data;
        setLocalUser(data);
        localStorage.setItem("shopverseUser", JSON.stringify(data));
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          shippingAddress: data.shippingAddress || "",
          password: "",
          newPassword: "",
        });
        if (data.profileImage) setPreview(data.profileImage);
      } catch (err) {
        console.error("❌ Fetch profile error:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please log in again.");
          logout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, logout]);

  // -------------------- Input Handlers --------------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // -------------------- Upload Profile Image --------------------
  const handleUploadImage = async () => {
    if (!profileImage) return alert("Please select an image first!");
    const formDataImg = new FormData();
    formDataImg.append("profileImage", profileImage);

    setUploading(true);
    try {
      const res = await api.put("/users/profile/upload-image", formDataImg, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Use correct path from backend response
      const updatedUser = res.data.user;
      setLocalUser(updatedUser);
      updateUser(updatedUser); // update navbar/global state
      localStorage.setItem("shopverseUser", JSON.stringify(updatedUser));

      // ✅ Update preview to the saved image from server
      setPreview(updatedUser.profileImage);

      alert("✅ Profile image updated!");
    } catch (err) {
      console.error("❌ Image upload error:", err);
      alert("Image upload failed!");
    } finally {
      setUploading(false);
    }
  };

  // -------------------- Update Profile Info --------------------
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = res.data.user;
      setLocalUser(updatedUser);
      updateUser(updatedUser); // update navbar/global state
      localStorage.setItem("shopverseUser", JSON.stringify(updatedUser));

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Update profile error:", error);
      alert("Failed to update profile!");
    } finally {
      setSaving(false);
    }
  };

  // -------------------- Logout --------------------
  const handleLogout = () => {
    logout();
    alert("Logged out successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="bg-lightCard dark:bg-darkCard min-h-screen flex justify-center items-start p-6 mt-10">
      <div className="max-w-2xl w-full bg-lightCard dark:bg-darkCard rounded-2xl shadow-xl p-8 relative">
        <h2 className="text-3xl font-bold text-center mb-8">My Profile</h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={preview || "/default-avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-300 object-cover shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
          </div>
          {profileImage && (
            <button
              onClick={handleUploadImage}
              disabled={uploading}
              className="mt-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-4 rounded-lg font-medium shadow-md hover:opacity-90 transition"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border rounded-lg p-2"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full border rounded-lg p-2"
          />
          <textarea
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleChange}
            rows={3}
            placeholder="Shipping Address"
            className="w-full border rounded-lg p-2"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 rounded-lg"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white w-full py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
