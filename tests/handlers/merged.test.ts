import { merged } from "../../src/handlers/merged";
import * as swapiService from "../../src/services/swapiService";
import * as mediaWikiService from "../../src/services/mediaWikiService";
import * as uuid from "uuid";
import * as httpResponseModule from "../../src/utils/httpResponse";

jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValue({}),
    })),
  },
}));

jest.mock("uuid");
jest.mock("../../src/services/swapiService");
jest.mock("../../src/services/mediaWikiService");
jest.mock("../../src/utils/httpResponse");

const OLD_ENV = process.env;

describe("merged handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, DYNAMODB_TABLE: "StarWarsRequests" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("retorna 200 y response si todo es correcto", async () => {
    (swapiService.getRandomStarWarsFilm as jest.Mock).mockResolvedValue({
      title: "A New Hope",
      opening_crawl: "It is a period of civil war...",
      director: "George Lucas",
      producer: "Gary Kurtz",
      release_date: "1977-05-25",
    });
    (mediaWikiService.getWikipediaSummary as jest.Mock).mockResolvedValue("Resumen de prueba");
    (uuid.v1 as jest.Mock).mockReturnValue("mock-uuid");
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValue("success-response");

    const result = await merged();

    expect(result).toBe("success-response");
    expect(swapiService.getRandomStarWarsFilm).toHaveBeenCalled();
    expect(mediaWikiService.getWikipediaSummary).toHaveBeenCalledWith("A New Hope");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(200, expect.objectContaining({
      title: "A New Hope",
      summary: "Resumen de prueba",
    }));
  });

  it("retorna 500 si ocurre un error", async () => {
    (swapiService.getRandomStarWarsFilm as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValueOnce("error-response");

    const result = await merged();

    expect(result).toBe("error-response");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(500, { error: "Error in merged handler" });
  });
});
