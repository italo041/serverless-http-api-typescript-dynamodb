import { DynamoDB } from "aws-sdk";
import { getHistoryQuerySchema, GetHistoryQueryDTO } from "../dtos/getHistoryQuery.dto";
const dynamoDb = new DynamoDB.DocumentClient();
import { httpResponse } from "../utils/httpResponse";

export const getHistory = async (
  event: any
) => {
  try {
    const query = event.queryStringParameters || {};

    const { error, value } = getHistoryQuerySchema.validate(query);
    if (error) {
      return httpResponse(400, { message: "Invalid query parameters", details: error.details });
    }
    const { limit, lastKey } = value as GetHistoryQueryDTO;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName: process.env.DYNAMODB_TABLE!,
      ProjectionExpression: "#id, #createdAt, #updatedAt, #response",
      ExpressionAttributeNames: {
        "#id": "id",
        "#createdAt": "createdAt",
        "#updatedAt": "updatedAt",
        "#response": "response",
      },
      Limit: limit,
    };

    if (lastKey) {
      params.ExclusiveStartKey = { id: lastKey };
    }

    const data = await dynamoDb.scan(params).promise();

    return httpResponse(200, {
      data,
      pagination: {
        lastKey: data.LastEvaluatedKey || null,
        limit: limit,
      }
    });
  } catch (error) {
    return httpResponse(400, {
      message: "Error fetching history",
      error: error instanceof Error ? error.message : error,
    });
  }
};
