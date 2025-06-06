import { getRandomStarWarsFilm } from "../services/swapiService";
import { getWikipediaSummary } from "../services/mediaWikiService";

export const merged = async () => {
  const film = await getRandomStarWarsFilm();
  const summary = await getWikipediaSummary(film?.title);

  const response = {
    title: film?.title || "Unknown Title",
    opening_crawl: film?.opening_crawl || "No opening crawl available.",
    director: film?.director || "Unknown Director",
    producer: film?.producer || "Unknown Producer",
    release_date: film?.release_date || "Unknown Release Date",
    summary: summary,
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};