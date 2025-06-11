import { createOrder } from "../../src/handlers/createOrder";
import * as uuid from "uuid";
import { createOrderSchema } from "../../src/dtos/createOrder.dto";
import * as httpResponseModule from "../../src/utils/httpResponse";

jest.mock("aws-sdk", () => ({
  DynamoDB: {
    DocumentClient: jest.fn().mockImplementation(() => ({
      put: jest.fn().mockReturnThis(),
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  },
}));

jest.mock("uuid");
jest.mock("../../src/dtos/createOrder.dto");
jest.mock("../../src/utils/httpResponse");
jest.mock("@middy/http-json-body-parser", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    before: jest.fn(),
    after: jest.fn(),
    onError: jest.fn(),
  })),
}));

const OLD_ENV = process.env;

describe("createOrder handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV, DYNAMODB_TABLE2: "Orders" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("retorna 400 si la validación falla", async () => {
    (createOrderSchema.validate as jest.Mock).mockReturnValueOnce({
      error: { details: ["error"] },
      value: null,
    });
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValueOnce("validation-error-response");

    const event = { body: JSON.stringify({}) };
    const result = await createOrder(event);

    expect(result).toBe("validation-error-response");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(400, expect.any(Object));
  });

  it("almacena el item y retorna 200 si todo es correcto", async () => {
    (createOrderSchema.validate as jest.Mock).mockReturnValueOnce({
      error: null,
      value: { foo: "bar" },
    });
    (uuid.v1 as jest.Mock).mockReturnValueOnce("mock-uuid");
    (httpResponseModule.httpResponse as jest.Mock).mockReturnValueOnce("success-response");

    const event = { body: JSON.stringify({ foo: "bar" }) };
    const result = await createOrder(event);

    expect(result).toBe("success-response");
    expect(httpResponseModule.httpResponse).toHaveBeenCalledWith(200, expect.objectContaining({
      message: "Item stored successfully",
      item: { foo: "bar" },
    }));
  });
});
