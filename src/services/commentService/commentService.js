import axiosInstance from "../axiosInstance";

const commentService = {
  create: async (slug, data) => {
    try {
      const response = await axiosInstance.post(
        `/posts/${slug}/comments`,
        data
      );

      return response;
    } catch (error) {
      return error;
    }
  },
};

export default commentService;
