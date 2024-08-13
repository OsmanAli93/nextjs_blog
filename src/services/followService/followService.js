import axiosInstance from "../axiosInstance";

const followService = {
  follow: async (id) => {
    try {
      const response = await axiosInstance.post("/follow", id);
      return response;
    } catch (error) {
      return error;
    }
  },
  unfollow: async (id) => {
    try {
      console.log(id);
      const response = await axiosInstance.post("/unfollow", id);
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default followService;
