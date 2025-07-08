import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext({
  user: "",
  isLoggedIn: false,
  login: (userData) => {},
  logout: () => {},
});
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser("");
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  const clearData = () => {
    localStorage.removeItem("token");
    // You can also clear localStorage keys related to resume, jobs etc if needed.
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          // Only call login if not already logged in
          if (!isLoggedIn) login(decoded);
        } else {
          logout();
          clearData();
        }
      } catch (err) {
        console.error("Token decode failed:", err);
        logout();
        clearData();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
