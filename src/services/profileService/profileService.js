import axiosInstance from "../axiosInstance";

const profileService = {
  update: async (id, data) => {
    console.log("service", data);
    try {
      const response = await axiosInstance.post(`/profile/${id}}`, data, {
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

export default profileService;
