import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import MainLayout from "./layout";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Authorization from "./pages/Authorization";

import { UserProvider, useUser } from "./context/UserContext/UserProvider.jsx";
import { PopupProvider } from "./context/PopupContext/PopupProvider.jsx";

import "./index.scss";

// Обёртка защищённого маршрута
const ProtectedRoute = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/authorization" replace />;
};

// Обёртка публичного маршрута
const PublicRoute = () => {
  const { user } = useUser();
  return user ? <Navigate to="/main" replace /> : <Outlet />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Публичные страницы */}
            <Route element={<PublicRoute />}>
              <Route index element={<Authorization />} />
              <Route path="authorization" element={<Authorization />} />
            </Route>

            {/* Защищённые страницы */}
            <Route element={<ProtectedRoute />}>
              <Route path="main" element={<Main />} />
              <Route path="profile" element={<Profile />} />
              <Route path="leaderboard" element={<Leaderboard />} />
            </Route>
          </Route>
        </Routes>
      </PopupProvider>
    </UserProvider>
  </BrowserRouter>
);
