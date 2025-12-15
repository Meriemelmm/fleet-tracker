import api from "../config/axios";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    // Stocker token et user localement
    if (response.data?.data?.jwt) {
      localStorage.setItem("token", response.data.data.jwt);
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { user: null, token: null };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
