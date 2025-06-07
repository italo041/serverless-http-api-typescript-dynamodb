import { getCacheKey, getFromCache, setCache } from "../../src/utils/cacheUtils";

describe("cacheUtils", () => {
  describe("getCacheKey", () => {
    it("genera la clave correctamente", () => {
      const query = { foo: "bar" };
      expect(getCacheKey(query)).toBe('history:{"foo":"bar"}');
    });
  });

  describe("getFromCache", () => {
    const mockDynamoDb: any = {
      get: jest.fn(),
    };

    it("devuelve los datos si el cache es válido", async () => {
      const now = Date.now();
      mockDynamoDb.get.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Item: {
              data: [1, 2, 3],
              cachedAt: now - 1000, // 1 segundo atrás
            },
          }),
      });

      const result = await getFromCache(
        "key",
        "table",
        30,
        mockDynamoDb
      );
      expect(result).toEqual([1, 2, 3]);
    });

    it("devuelve null si el cache está expirado", async () => {
      const now = Date.now();
      mockDynamoDb.get.mockReturnValueOnce({
        promise: () =>
          Promise.resolve({
            Item: {
              data: [1, 2, 3],
              cachedAt: now - 31 * 60 * 1000, // 31 minutos atrás
            },
          }),
      });

      const result = await getFromCache(
        "key",
        "table",
        30,
        mockDynamoDb
      );
      expect(result).toBeNull();
    });

    it("devuelve null si no hay Item", async () => {
      mockDynamoDb.get.mockReturnValueOnce({
        promise: () => Promise.resolve({}),
      });

      const result = await getFromCache(
        "key",
        "table",
        30,
        mockDynamoDb
      );
      expect(result).toBeNull();
    });
  });

  describe("setCache", () => {
    it("llama a dynamoDb.put con los parámetros correctos", async () => {
      const mockDynamoDb: any = {
        put: jest.fn().mockReturnValue({ promise: () => Promise.resolve() }),
      };
      const cacheKey = "key";
      const data = { foo: "bar" };
      const tableName = "table";

      await setCache(cacheKey, data, tableName, mockDynamoDb);

      expect(mockDynamoDb.put).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: tableName,
          Item: expect.objectContaining({
            id: cacheKey,
            data,
            cachedAt: expect.any(Number),
          }),
        })
      );
    });
  });
});
