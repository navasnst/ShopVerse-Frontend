
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Load user data for any role (Admin, Seller, User)
    const storedUser =
      JSON.parse(localStorage.getItem("adminInfo")) ||
      JSON.parse(localStorage.getItem("sellerInfo")) ||
      JSON.parse(localStorage.getItem("shopverseUser"));

    const storedToken =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("sellerToken") ||
      localStorage.getItem("shopverseToken");

    if (storedUser && storedToken) {
      if (storedUser.profileImage) {
        storedUser.profileImage = normalizeImage(storedUser.profileImage);
      }

      setUser(storedUser);
      setToken(storedToken);

      // Detect current role
      if (localStorage.getItem("adminInfo")) setRole("admin");
      else if (localStorage.getItem("sellerInfo")) setRole("seller");
      else setRole("user");

      // ✅ Set default Axios header (auto include token in every request)
      api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Helper: Normalize backend profile image URL
  const normalizeImage = (imagePath) => {
    if (!imagePath) return "";
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5000/${imagePath.replace(/\\/g, "/")}`;
  };

  // ✅ Login & persist data by role
  const login = (userData, token, role = "user") => {
    if (userData.profileImage) {
      userData.profileImage = normalizeImage(userData.profileImage);
    }

    setUser(userData);
    setToken(token);
    setRole(role);

    // ✅ Set default token for all future axios requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    if (role === "admin") {
      userData.role = "admin";
      localStorage.setItem("adminInfo", JSON.stringify(userData));
      localStorage.setItem("adminToken", token);
    } else if (role === "seller") {
      localStorage.setItem("sellerInfo", JSON.stringify(userData));
      localStorage.setItem("sellerToken", token);
    } else {
      localStorage.setItem("shopverseUser", JSON.stringify(userData));
      localStorage.setItem("shopverseToken", token);
    }
  };

  // ✅ Logout — clears only the current role's data
  const logout = () => {
    if (role === "admin") {
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminToken");
    } else if (role === "seller") {
      localStorage.removeItem("sellerInfo");
      localStorage.removeItem("sellerToken");
    } else {
      localStorage.removeItem("shopverseUser");
      localStorage.removeItem("shopverseToken");
    }

    setUser(null);
    setToken(null);
    setRole("user");


    // ✅ Remove token from axios headers
    delete api.defaults.headers.common["Authorization"];
  };

  // ✅ Update user info (after profile edit)
  const updateUser = (updatedData) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };

    // Normalize image path if present
    if (updatedData.profileImage) {
      newUser.profileImage = normalizeImage(updatedData.profileImage);
    }

    setUser(newUser);

    if (role === "admin") {
      localStorage.setItem("adminInfo", JSON.stringify(newUser));
    } else if (role === "seller") {
      localStorage.setItem("sellerInfo", JSON.stringify(newUser));
    } else {
      localStorage.setItem("shopverseUser", JSON.stringify(newUser));
    }
  };

  // ✅ Refresh user from backend (real-time sync)
  const refreshUser = async () => {
    if (!token || !role) return;

    try {
      const endpoint =
        role === "admin"
          ? "/profile/admin"
          : role === "seller"
            ? "/profile/seller"
            : "/users/profile";

      const res = await api.get(endpoint);

      const updatedUser = {
        ...res.data,
        profileImage: normalizeImage(res.data.profileImage),
      };

      setUser(updatedUser);
      updateUser(updatedUser); // update localStorage too
    } catch (err) {
      console.error("Error refreshing user:", err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        role,
        login,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
