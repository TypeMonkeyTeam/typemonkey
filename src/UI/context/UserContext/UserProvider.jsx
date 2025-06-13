import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import Avatar from "../../assets/avatar.png";
import { post } from "../../hooks/requests";
import {API_ROUTES} from "../../hooks/routes";
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    saved ? setUser(JSON.parse(saved)) : navigate("/");
  }, []);

  const login = async (userData) => {
    const response = await post(API_ROUTES.auth.login, {
      email: userData.email,
      password: userData.password,
    });
  
    if (response.success) {
      const userObj = {
        id: response.data.id,
        name: response.data.name,
        avatar: response.data.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
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
      avatar: Avatar,
    });
    if (response.success) {
      const userObj = {
        id: response.data.id,
        name: response.data.name,
        avatar: response.data.avatar,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate("/main");
    } else {
      console.error("Ошибка регистрации:", response.error);
    }
    return response.status;
  };

  const logout = () => {
    localStorage.removeItem("user");
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
