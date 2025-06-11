import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();
import * as uuid from "uuid";
import { createOrderSchema } from "../dtos/createOrder.dto";
import { httpResponse } from "../utils/httpResponse";
import middy = require("middy");
import { verifyJWTMiddleware } from "../middlewares/validateCognito";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { errorHandler } from "../middlewares/errorHandler";

const createOrder = async (event: any) => {
  try {
    const { error, value } = createOrderSchema.validate(event.body);

    if (error) {
      return httpResponse(400, {
        message: "Validation error",
        details: error.details,
      });
    }

    const timestamp = new Date().getTime();

    const params: DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.DYNAMODB_TABLE2!,
      Item: {
        id: uuid.v1(),
        ...value,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    await dynamoDb.put(params).promise();

    return httpResponse(200, {
      message: "Item stored successfully",
      item: value,
    });
  } catch (error) {
    return httpResponse(400, {
      message: "Error storing item",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createOrderHandler = middy(createOrder)
  .use(httpJsonBodyParser())
  .use(verifyJWTMiddleware())
  .use(errorHandler());
