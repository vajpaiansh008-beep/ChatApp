import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const getErrorMessage = (error, defaultMsg) => {
    return error.response?.data?.msg || error.response?.data?.message || error.message || defaultMsg;
  };

  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        toast.error(getErrorMessage(error, "Failed to authenticate session"));
      }
    }
  };

  const login = async (state, credentials) => {
    try {
      const endpoint = state.toLowerCase().replace(/\s+/g, "").trim();
      const { data } = await axios.post(`/api/auth/${endpoint}`, credentials);
      
      if (data.success) {
        const activeUser = data.user || data.userData;
        setAuthUser(activeUser);
        setToken(data.token);
        localStorage.setItem("token", data.token);

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        connectSocket(activeUser);

        toast.success(data.msg || data.message || "Welcome back!");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Authentication failed"));
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out Successfully");
    socket?.disconnect();
    setSocket(null);
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.msg || data.message || "Profile updated Successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, { query: { userId: userData._id } });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    checkAuth();
  }, [token]);

  // FIXED: Consolidated into a safe cleanup tracking loop on component unmount
  useEffect(() => {
    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <AuthContext.Provider value={{ axios, authUser, onlineUsers, socket, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
