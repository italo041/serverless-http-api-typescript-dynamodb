import { getHistory } from "../../src/handlers/getHistory";
import { getHistoryQuerySchema } from "../../src/dtos/getHistoryQuery.dto";
import * as httpResponseModule from "../../src/utils/httpResponse";

jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      scan: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValueOnce({
        Items: [{ id: "1" }],
        LastEvaluatedKey: "last-key"
      }),
    })),
  },
}));

jest.mock("../../src/dtos/getHistoryQuery.dto");
jest.mock("../../src/utils/httpResponse");

const OLD_ENV = process.env;

describe("getHistory handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, DYNAMODB_TABLE: "StarWarsRequests" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("retorna 400 si la validación falla", async () => {
    (getHistoryQuerySchema.validate as jest.Mock).mockReturnValueOnce({
      error: { details: ["error"] },
      value: null,
    });
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValueOnce("validation-error-response");

    const event = { queryStringParameters: {} };
    const result = await getHistory(event);

    expect(result).toBe("validation-error-response");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(400, expect.any(Object));
  });

  it("retorna 200 y los datos si todo es correcto", async () => {
    (getHistoryQuerySchema.validate as jest.Mock).mockReturnValueOnce({
      error: null,
      value: { limit: 10, lastKey: undefined },
    });
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValueOnce("success-response");

    const event = { queryStringParameters: {} };
    const result = await getHistory(event);

    expect(result).toBe("success-response");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(200, expect.objectContaining({
      data: expect.any(Object),
      pagination: expect.objectContaining({
        lastKey: "last-key",
        limit: 10,
      }),
    }));
  });
});
