
import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token } = useContext(AuthContext);

  // ✅ Load cart (backend or localStorage)
  useEffect(() => {
    const fetchCart = async () => {
      if (token) {
        try {
          const res = await api.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCart(res.data.cart || []); // ✅ SAFE UPDATE
        } catch (err) {
          console.error("Error fetching cart from backend:", err);
          setCart([]); // fallback
        }
      } else {
        const storedCart = localStorage.getItem("shopverseCart");
        if (storedCart) setCart(JSON.parse(storedCart));
      }
    };

    fetchCart();
  }, [token]);

  // ✅ Sync localStorage only for guests
  useEffect(() => {
    if (!token) {
      localStorage.setItem("shopverseCart", JSON.stringify(cart));
    }
  }, [cart, token]);

// ✅ Add To Cart
const addToCart = async (product, quantity) => {
  try {
    // 1️⃣ Update UI instantly
    setCart((prev) => {
      const exists = prev.find((i) => i.product._id === product._id);
      if (exists) {
        return prev.map((i) =>
          i.product._id === product._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }

      return [
        ...prev,
        {
          product,
          // vendor: product.vendor?._id || product.vendor, 
          vendorId: product.vendor?._id || product.vendor,
          quantity,
        },
      ];
    });

    // 2️⃣ Sync with backend (vendorId included)
    const response = await api.post(
      "/cart/add",
      {
        productId: product._id,
        vendorId: product.vendor?._id || product.vendor,
        quantity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // 3️⃣ Replace cart with backend version
    setCart(response.data.cart || []);

    console.log("Added to backend cart:", response.data);
  } catch (err) {
    console.error("Error adding to backend cart:", err);
  }
};

  // ✅ Remove item from cart
  const removeFromCart = async (productId) => {
    if (token) {
      try {
        const res = await api.delete(`/cart/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.cart || []); // ✅ SAFE UPDATE
      } catch (err) {
        console.error("Error removing item from backend cart:", err);
      }
    } else {
      setCart((prevCart) =>
        prevCart.filter(
          (item) =>
            item.product._id !== productId &&
            item.product.id !== productId
        )
      );
    }
  };

  // ✅ Update quantity (auto-remove if quantity = 0)
  const updateQuantity = async (product, quantity) => {
    // ⚠️ If user reduces quantity to 0 → remove item instead
    if (quantity <= 0) {
      return removeFromCart(product._id);
    }

    try {
      const response = await api.put(
        `/cart/${product._id}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update UI instantly
      setCart((prev) =>
        prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity }
            : item
        )
      );

      console.log("Quantity updated:", response.data);
    } catch (err) {
      console.error("Error updating backend cart:", err);
    }
  };

  // ✅ Clear entire cart
  const clearCart = async () => {
    if (token) {
      try {
        await api.delete("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart([]); // reset UI
      } catch (err) {
        console.error("Error clearing backend cart:", err);
      }
    } else {
      setCart([]);
      localStorage.removeItem("shopverseCart");
    }
  };

  // Totals
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart]
  );

  const totalPrice = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.product.price || 0) * (item.quantity || 1),
        0
      ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
