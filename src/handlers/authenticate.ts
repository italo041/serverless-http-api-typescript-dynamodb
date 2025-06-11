import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { httpResponse } from "../utils/httpResponse";
import middy = require("middy");
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { errorHandler } from "../middlewares/errorHandler";
import { LoginDTO, loginSchema } from "../dtos/login.dto";

export const login = async (event: any) => {
  try {
    const { error, value } = loginSchema.validate(event.body);

    if (error) {
      return httpResponse(400, {
        message: "Validation error",
        details: error.details,
      });
    }
    const { username, password } = value as LoginDTO;

    const clientId = process.env.COGNITO_CLIENT_ID;
    const region = process.env.AWS_REGION;
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    const client = new CognitoIdentityProviderClient({ region });
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const response = await client.send(command);

    if (response.ChallengeName === "NEW_PASSWORD_REQUIRED") {
      const setPasswordCommand = new AdminSetUserPasswordCommand({
        UserPoolId: userPoolId,
        Username: username,
        Password: password,
        Permanent: true,
      });
      await client.send(setPasswordCommand);
      const response = await client.send(command);

      return httpResponse(200, {
        message: "Login successfully",
        data: {
          idToken: response.AuthenticationResult?.IdToken,
        },
      });
    }

    return httpResponse(200, {
      message: "Login successfully",
      data: {
        idToken: response.AuthenticationResult?.IdToken,
      },
    });
  } catch (err: any) {
    return httpResponse(401, { message: err.message || "Login failed" });
  }
};

export const loginHandler = middy(login)
  .use(httpJsonBodyParser())
  .use(errorHandler());
