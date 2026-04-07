import { createContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await api.post("/api/cart/add", { itemId });
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const newCount = prev[itemId] - 1;
      if (newCount <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      }
      return { ...prev, [itemId]: newCount };
    });

    if (token) {
      try {
        await api.post("/api/cart/remove", { itemId });
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  // Clear entire cart (used after successful order placement)
  const clearCart = async () => {
    setCartItems({});
    if (token) {
      try {
        await api.post("/api/cart/clear");
      } catch (error) {
        // Non-critical — server already cleared cart after order placement
        console.error("Error clearing cart:", error);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = foodList.find((food) => food._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/food/list");
      setFoodList(response.data.food);
    } catch (error) {
      console.error("Error fetching food list:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCartData = async () => {
    try {
      const response = await api.get("/api/cart/get");
      if (response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData();
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    token,
    setToken,
    category,
    setCategory,
    searchQuery,
    setSearchQuery,
    loading,
    theme,
    toggleTheme,
    fetchFoodList,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
