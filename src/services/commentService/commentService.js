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
  fetch: async (slug) => {
    try {
      const response = await axiosInstance.get(`/posts/${slug}/comments`);

      return response;
    } catch (error) {
      return error;
    }
  },
};

export default commentService;
