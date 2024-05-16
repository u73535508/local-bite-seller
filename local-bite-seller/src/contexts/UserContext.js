import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const login = async (accessToken, refreshToken) => {
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("accessToken", accessToken);
  };
  const logout = async () => {
    const hideLoadingMessage = message.loading("Çıkış yapılıyor...", 0);
    try {
      const token = sessionStorage.getItem("accessToken");
      const refresh_token = sessionStorage.getItem("refreshToken");
      await axios.post(
        "http://127.0.0.1:8000/auth/logout/",
        { refresh_token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      sessionStorage.clear();
      hideLoadingMessage();
      message.success("Çıkış yapıldı");
    } catch {
      hideLoadingMessage();
      message.error("Tekrar dene");
    }
  };
  const currentUser = async () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      try {
        const res = await axios.get("http://127.0.0.1:8000/auth/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
