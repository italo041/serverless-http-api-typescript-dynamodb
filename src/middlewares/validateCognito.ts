import { CognitoJwtVerifier } from "aws-jwt-verify";
import { httpResponse } from "../utils/httpResponse";

export const verifyJWTMiddleware = () => {
  return {
    before: async (request) => {
      try {
        const token = request.event.headers?.authorization?.split(" ")[1];

        if (!token) {
          return httpResponse(401, { message: "Missing Authorization Token" });
        }

        const verifier = CognitoJwtVerifier.create({
          userPoolId: process.env.COGNITO_USER_POOL_ID!,
          tokenUse: "id",
          clientId: process.env.COGNITO_CLIENT_ID!,
        });

        const payload = await verifier.verify(token);
        request.event.user = payload;

        console.log("JWT Verified:", payload);
      } catch (err) {
        console.error("JWT Verification Error:", err);
        return httpResponse(401, { message: "Unauthorized" });
      }
    },
  };
};
