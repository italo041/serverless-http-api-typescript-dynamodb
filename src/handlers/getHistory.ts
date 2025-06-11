import { DynamoDB } from "aws-sdk";
import {
  getHistoryQuerySchema,
  GetHistoryQueryDTO,
} from "../dtos/getHistoryQuery.dto";
const dynamoDb = new DynamoDB.DocumentClient();
import { httpResponse } from "../utils/httpResponse";
import middy = require("middy");
import { verifyJWTMiddleware } from "../middlewares/validateCognito";
import { errorHandler } from "../middlewares/errorHandler";
import moment = require("moment-timezone");

export const getHistory = async (event: any) => {
  try {
    const query = event.queryStringParameters || {};

    if (query.lastEvaluatedKey && typeof query.lastEvaluatedKey === "string") {
      try {
        query.lastEvaluatedKey = JSON.parse(query.lastEvaluatedKey);
      } catch (e) {
        return httpResponse(400, {
          message: "Invalid lastEvaluatedKey format. Must be a valid JSON object.",
        });
      }
    }

    const { error, value } = getHistoryQuerySchema.validate(query);

    if (error) {
      return httpResponse(400, {
        message: "Invalid query parameters",
        details: error.details,
      });
    }
    const { limit, lastEvaluatedKey, order } = value as GetHistoryQueryDTO;

    const params: DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.DYNAMODB_TABLE!,
      IndexName: "createdAtIndex",
      KeyConditionExpression: "#type = :type",
      ExpressionAttributeNames: {
        "#type": "type",
        "#id": "id",
        "#createdAt": "createdAt",
        "#updatedAt": "updatedAt",
        "#response": "response",
      },
      ExpressionAttributeValues: {
        ":type": "history",
      },
      ProjectionExpression: "#id, #createdAt, #updatedAt, #response",
      ScanIndexForward: order == 'asc' ? true : false,
      Limit: limit,
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }

    const data = await dynamoDb.query(params).promise();

    if (data.Items) {
      data.Items = data.Items.map(item => {
        if (item.createdAt) {
          item.createdAt = moment(item.createdAt).tz("America/Lima").format("YYYY/MM/DD HH:mm:ss");
        }
        return item;
      });
    }

    const response = {
      data,
      pagination: {
        lastKey: data.LastEvaluatedKey || null,
        limit: limit,
      },
    };

    return httpResponse(200, response);
  } catch (error) {
    return httpResponse(400, {
      message: "Error fetching history",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getHistoryHandler = middy(getHistory)
  .use(verifyJWTMiddleware())
  .use(errorHandler());
