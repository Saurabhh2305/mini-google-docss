import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // initial load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (data) => {
    // assume backend returns: { user, accessToken, refreshToken }
    setUser(data.user);
    setAccessToken(data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    handleAuthSuccess(res.data);
    navigate("/dashboard");
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    handleAuthSuccess(res.data);
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const value = {
    user,
    accessToken,
    login,
    signup,
    logout,
    loading,
    setAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
