import { httpResponse } from "../utils/httpResponse";

export const errorHandler = () => ({
  onError: async (request: any) => {
    const error = request.error;
    if (!request.response) {
      return httpResponse(error.statusCode || 500, {
        message: error.message || "Internal server error",
      });
    }
    console.error("Error:", error);
    return request.response;
  },
});
