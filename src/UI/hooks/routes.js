export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    refresh: "/api/auth/refresh",     // для автоматического обновления access_token
    logout: "/api/auth/logout",       //  для выхода и удаления refresh_token
  },
  main: {
    submit: "/api/main/submit",
  },
  user: {
    byId: (id) => `/api/profile/${id}`,
  },
  record: {
    submit: "/api/main/submit",
    rank: "/api/leaderboard/", // Можно будет использовать как .rank(id)
  },
  profile: {
    get: (id) => `/api/profile/${id}`,
    updateName: (id) => `/api/profile/${id}/update-name`,
    uploadAvatar: (id) => `/api/profile/${id}/upload-avatar`,
  },
  leaderboard: {
    all: "/api/leaderboard/",
    byId: (id) => `/api/leaderboard/${id}`,
    delete: (id) => `/api/leaderboard/delete-record/${id}`,
  },
};
