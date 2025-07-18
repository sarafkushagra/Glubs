import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("glubsUser");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch (err) {
      console.error("Failed to parse glubsUser from localStorage:", err);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("glubsToken");
    return storedToken && storedToken !== "undefined" ? storedToken : null;
  });

  // Function to set both user and token in state and localStorage
  const setAuth = ({ user, token }) => {
    if (user && typeof user === "object") {
      setUser(user);
      localStorage.setItem("glubsUser", user ? JSON.stringify(user) : null);
    }

    if (typeof token === "string" && token.trim() !== "") {
      setToken(token);
      localStorage.setItem("glubsToken", token);
    } else {
      console.warn("Token not saved – not a valid string:", token);
    }
  };

  // Function to update user data and persist it in localStorage
  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("glubsUser", JSON.stringify(updated));
      return updated;
    });
  };

  // Function to clear user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("glubsUser");
    localStorage.removeItem("glubsToken");
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
