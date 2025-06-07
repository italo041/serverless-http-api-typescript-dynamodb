export function httpResponse(statusCode: number, body: object) {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
}
