import { getWikipediaSummary } from "../../src/services/mediaWikiService";
import fetchMock from "jest-fetch-mock";
describe("getWikipediaSummary", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("devuelve el extract cuando la respuesta es válida", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ extract: "Resumen de pelicula de stars wars" }));

    const result = await getWikipediaSummary("Test");
    expect(result).toBe("Resumen de pelicula de stars wars");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Test"
    );
  });

  it("devuelve mensaje por defecto si no hay extracto", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const result = await getWikipediaSummary("Test");
    expect(result).toBe("No summary available for this title.");
  });

  it("devuelve undefined si ocurre un error", async () => {
    fetchMock.mockRejectOnce(new Error("API error"));

    const result = await getWikipediaSummary("Test");
    expect(result).toBeUndefined();
  });
});
