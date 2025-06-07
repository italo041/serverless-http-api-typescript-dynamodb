import { DynamoDB } from "aws-sdk";

export const CACHE_TABLE = process.env.DYNAMODB_CACHE_TABLE!;
export const DEFAULT_CACHE_TTL_MINUTES = 30;

export function getCacheKey(query: any) {
  return `history:${JSON.stringify(query)}`;
}

export async function getFromCache(
  cacheKey: string,
  tableName: string,
  ttlMinutes: number,
  dynamoDb: DynamoDB.DocumentClient
) {
  const params = {
    TableName: tableName,
    Key: { id: cacheKey },
  };
  const result = await dynamoDb.get(params).promise();
  if (result.Item && result.Item.data && result.Item.cachedAt) {
    const cachedAt = result.Item.cachedAt;
    const now = Date.now();
    if (now - cachedAt < ttlMinutes * 60 * 1000) {
      return result.Item.data;
    }
  }
  return null;
}

export async function setCache(
  cacheKey: string,
  data: any,
  tableName: string,
  dynamoDb: DynamoDB.DocumentClient
) {
  const params = {
    TableName: tableName,
    Item: {
      id: cacheKey,
      data,
      cachedAt: Date.now(),
    },
  };
  await dynamoDb.put(params).promise();
}
