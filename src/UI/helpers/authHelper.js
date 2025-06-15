// src/helpers/authHelper.js
let logoutFn = null;

// Сюда будет передана функция logout из UserProvider
export const setLogoutHandler = (fn) => {
  logoutFn = fn;
};

// Вызывается из axios, если refresh не сработал
export const logout = () => {
  if (logoutFn) logoutFn();
};
