import axiosInstance from "../axiosInstance";

const postService = {
  posts: async (page) => {
    try {
      const pathUrl = page ? `/posts/?page=${page}` : "/posts";
      const response = await axiosInstance.get(pathUrl);
      return response;
    } catch (error) {
      return error;
    }
  },
  post: async (slug) => {
    try {
      const response = await axiosInstance.get(`/posts/${slug}`);
      return response;
    } catch (error) {
      return error;
    }
  },
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
  update: async (id, data) => {
    try {
      const response = await axiosInstance.post(`/posts/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (error) {
      return error;
    }
  },
  like: async (slug) => {
    try {
      const response = await axiosInstance.post(`/posts/${slug}/likes`, null);
      return response;
    } catch (error) {
      return error;
    }
  },
  unlike: async (slug) => {
    try {
      const response = await axiosInstance.delete(`/posts/${slug}/likes`);
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default postService;
