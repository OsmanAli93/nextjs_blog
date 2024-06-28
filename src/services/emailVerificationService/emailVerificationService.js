import axiosInstance from "../axiosInstance";

const emailVerificationService = {
  resend: async () => {
    try {
      const response = await axiosInstance.post(
        "/email/verification-notification"
      );

      return response;
    } catch (error) {
      return error;
    }
  },
};

export default emailVerificationService;
