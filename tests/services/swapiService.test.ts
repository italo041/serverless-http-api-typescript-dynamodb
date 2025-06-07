import { getRandomStarWarsFilm } from "../../src/services/swapiService";
import * as cacheUtils from "../../src/utils/cacheUtils";
import { jest } from "@jest/globals";

jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({})),
  },
}));

import fetchMock from "jest-fetch-mock";

describe("getRandomStarWarsFilm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.resetMocks();
  });

  it("devuelve una película desde el cache si existe", async () => {
    const fakeFilms = [
      { title: "A New Hope" },
      { title: "The Empire Strikes Back" },
    ];
    jest.spyOn(cacheUtils, "getFromCache").mockResolvedValue(fakeFilms);

    const film = await getRandomStarWarsFilm();

    expect(film).toBeDefined();
    expect(fakeFilms).toContainEqual(film);
    expect(cacheUtils.getFromCache).toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("obtiene películas de la API y las guarda en cache si no hay cache", async () => {
    jest.spyOn(cacheUtils, "getFromCache").mockResolvedValue(null);
    jest.spyOn(cacheUtils, "setCache").mockResolvedValue(null);

    const apiFilms = [
      { title: "Return of the Jedi" },
      { title: "The Phantom Menace" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify({ results: apiFilms }));

    const film = await getRandomStarWarsFilm();

    expect(film).toBeDefined();
    expect(apiFilms).toContainEqual(film);
    expect(fetchMock).toHaveBeenCalledWith("https://swapi.dev/api/films/");
    expect(cacheUtils.setCache).toHaveBeenCalled();
  });

  it("maneja errores de la API", async () => {
    jest.spyOn(cacheUtils, "getFromCache").mockResolvedValue(undefined);
    fetchMock.mockRejectOnce(new Error("API error"));
    const film = await getRandomStarWarsFilm();
    expect(film).toBeUndefined();
  });
});
