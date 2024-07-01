import axiosInstance from "../axiosInstance";

const authService = {
  register: async (data) => {
    try {
      const response = await axiosInstance.post("/register", data);

      return response;
    } catch (error) {
      return error;
    }
  },
  login: async (user) => {
    try {
      const response = await axiosInstance.post("/login", user);

      return response;
    } catch (error) {
      return error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/forgot-password", email);

      return response;
    } catch (error) {
      return error;
    }
  },
  resetPassword: async (data) => {
    try {
      const response = await axiosInstance.patch("/reset-password", data);

      return response;
    } catch (error) {
      return error;
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post("/logout", null);

      return response;
    } catch (error) {
      return error;
    }
  },
};

export default authService;
