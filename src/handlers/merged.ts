import { getRandomStarWarsFilm } from "../services/swapiService";
import { getWikipediaSummary } from "../services/mediaWikiService";
import * as uuid from "uuid";
import { DynamoDB } from "aws-sdk";
const dynamoDb = new DynamoDB.DocumentClient();
import { httpResponse } from "../utils/httpResponse";
import middy = require("middy");
import { errorHandler } from "../middlewares/errorHandler";

export const merged = async () => {
  try {
    const film = await getRandomStarWarsFilm();
    const summary = await getWikipediaSummary(film?.title);

    const response = {
      title: film?.title || "Unknown Title",
      opening_crawl: film?.opening_crawl || "No opening crawl available.",
      director: film?.director || "Unknown Director",
      producer: film?.producer || "Unknown Producer",
      release_date: film?.release_date || "Unknown Release Date",
      summary: summary,
    };

    const timestamp = new Date().getTime();

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: uuid.v1(),
        response,
        createdAt: timestamp,
        updatedAt: timestamp,
        type: "history"
      },
    };

    await dynamoDb.put(params).promise();

    return httpResponse(200, response);
  } catch (error) {
    console.error(error);
    return httpResponse(500, { error: "Error in merged handler" });
  }
};

export const mergedHandler = middy(merged).use(errorHandler());
