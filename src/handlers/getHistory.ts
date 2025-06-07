import { DynamoDB } from "aws-sdk";
import { getQueryParams } from "../utils/getQueryParams";
const dynamoDb = new DynamoDB.DocumentClient();

export const getHistory = async (
  event: any // Cambiar la firma para recibir el evento de Lambda
) => {
  try {
    const query = event.queryStringParameters || {};
    const { limit, lastKey } = getQueryParams(query);

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

    if (lastKey && typeof lastKey === "object" && lastKey.id && typeof lastKey.id === "string") {
      params.ExclusiveStartKey = lastKey;
    } else if (lastKey) {
      console.error("lastKey dont match", lastKey);
    }

    const data = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
        lastKey: data.LastEvaluatedKey || null,
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Error fetching history",
        error: error instanceof Error ? error.message : error,
      }),
    };
  }
};
