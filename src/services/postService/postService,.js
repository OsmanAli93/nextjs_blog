import axiosInstance from "../axiosInstance";

const postService = {
  create: async (data) => {
    try {
      const response = await axiosInstance.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      return error;
    }
  },
};

export default postService;
