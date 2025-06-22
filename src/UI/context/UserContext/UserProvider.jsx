import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";

import { post } from "../../hooks/requests";
import {API_ROUTES} from "../../hooks/routes";
import { setLogoutHandler } from "../../helpers/authHelper";

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else if (!user) {
      navigate("/");
    }
    setLogoutHandler(logout);
  }, []);

  const login = async (userData) => {
    
    const response = await post(API_ROUTES.auth.login, {
      email: userData.email,
      password: userData.password,
    });
    
  
    if (response.success) {
      const userObj = {
        id: response.data.user.id,
        name: response.data.user.name,
        avatar: response.data.user.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("access_token", response.data.access_token);
      setUser(userObj);
      navigate("/main");
    } else {
      console.error("Ошибка логина:", response.error);
    }
  
    return response;
  };

  const register = async (userData) => {
    const name = userData.email.split("@")[0];
    const response = await post(API_ROUTES.auth.register, {
      name,
      email: userData.email,
      password: userData.password,
    });
    
    
    if (response.success) {
      const userObj = {
        id: response.data.user.id,
        name: response.data.user.name,
        avatar: response.data.user.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("access_token", response.data.access_token);
      setUser(userObj);
      navigate("/main");
    } else {
      console.error("Ошибка регистрации:", response.error);
    }
    return response.status;
  };

  const logout = async () => {
    try {
      await post(API_ROUTES.auth.logout);
    } catch (err) {
      console.error("Ошибка при logout:", err);
    }
  
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
