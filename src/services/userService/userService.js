import axiosInstance from "../axiosInstance";

const userService = {
  getUser: async () => {
    try {
      const response = axiosInstance.get("/user");
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default userService;
