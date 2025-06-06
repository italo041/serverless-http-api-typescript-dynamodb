import { getRandomStarWarsFilm } from "./services/swapiService";
import { getWikipediaSummary } from "./services/mediaWikiService";

export const test = async () => {
  const film = await getRandomStarWarsFilm();
  const summary = await getWikipediaSummary(film?.title);

  return {
    statusCode: 200,
    body: JSON.stringify({ ...film, summary }),
  };
};
