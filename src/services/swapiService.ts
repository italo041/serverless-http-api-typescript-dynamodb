import { DynamoDB } from "aws-sdk";
import {
  CACHE_TABLE,
  DEFAULT_CACHE_TTL_MINUTES,
  getCacheKey,
  getFromCache,
  setCache,
} from "../utils/cacheUtils";

const dynamoDb = new DynamoDB.DocumentClient();

export async function getRandomStarWarsFilm() {
  const cacheKey = getCacheKey({ resource: "swapi-films" });

  const cached = await getFromCache(
    cacheKey,
    CACHE_TABLE,
    DEFAULT_CACHE_TTL_MINUTES,
    dynamoDb
  );
  
  if (cached) {
    console.log("Devolviendo película de Star Wars desde el cache");
    const films = cached;
    const randomIndex = Math.floor(Math.random() * films.length);
    return films[randomIndex];
  }

  try {
    const response = await fetch("https://swapi.dev/api/films/");
    const data = await response.json();

    const films = data.results;
   
    console.log("Guardando películas de Star Wars en el cache");
    await setCache(cacheKey, films, CACHE_TABLE, dynamoDb);

    const randomIndex = Math.floor(Math.random() * films.length);
    const film = films[randomIndex];

    return film;
  } catch (error) {
    console.error("Error in getRandomStarWarsFilm", error);
  }
}
