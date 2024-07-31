import axiosInstance from "../axiosInstance";

const userService = {
  getUser: async (id) => {
    try {
      const response = axiosInstance.get(`/users/${id}`);
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default userService;
