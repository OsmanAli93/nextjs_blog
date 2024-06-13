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
};

export default authService;
