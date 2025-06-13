export const API_ROUTES = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
  },
  main: {
    submit: "/api/main/submit",
  },
  user: {
    byId: (id) => `/api/profile/${id}`,
  },
  record: {
    submit: "/api/main/submit",
    rank: "/api/leaderboard/" // + `/:id`
  },
  profile: {
    get: (id) => `/api/profile/${id}`,
    updateName: (id) => `/api/profile/${id}/update-name`,
    updateAvatar: (id) => `/api/profile/${id}/update-avatar`,
  },
  leaderboard: {
    all: "/api/leaderboard/",
    byId: (id) => `/api/leaderboard/${id}`,
    delete: (id) => `/api/leaderboard/delete-record/${id}`,
  },
};
