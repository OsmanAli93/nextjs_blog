import axiosInstance from "../axiosInstance";

const userService = {
  getUser: () => {
    try {
      const response = axiosInstance.get("/user");
      return response;
    } catch (error) {
      return error;
    }
  },
  getUserPosts: async (id) => {
    try {
      const response = axiosInstance.get(`/users/${id}/posts`);
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default userService;
