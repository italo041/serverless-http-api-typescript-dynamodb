import { httpResponse } from "../utils/httpResponse";

export const errorHandler = () => ({
  onError: async (request: any) => {
    const error = request.error;
    console.error("Error:", error);

    if (error && typeof error.statusCode === "number" && error.body) {
      return error;
    }

    if (!request.response) {
      return httpResponse(error.statusCode || 500, {
        message: error.message || "Internal server error",
      });
    }
    return request.response;
  },
});
