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
      console.log(user);
      const response = await axiosInstance.post("/login", user);

      return response;
    } catch (error) {
      return error;
    }
  },
  forgotPassword: async (email) => {
    try {
    } catch (error) {}
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
