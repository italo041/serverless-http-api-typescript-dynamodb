const swaggerYaml = Buffer.from(`
openapi: 3.0.1
info:
  title: StarWars API
  version: 1.0.0
  description: API para órdenes y consultas StarWars
servers:
  - url: Agregar aqui la url de tu api serverless
    description: API Gateway endpoint
  - url: http://localhost:3000
    description: Local server (serverless offline)
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
paths:
  /merged:
    get:
      summary: Obtener datos combinados de StarWars y MediaWiki
      responses:
        "200":
          description: Respuesta exitosa
          content:
            application/json:
              schema:
                type: object
                properties:
                  title:
                    type: string
                  opening_crawl:
                    type: string
                  director:
                    type: string
                  producer:
                    type: string
                  release_date:
                    type: string
                  summary:
                    type: string
  /history:
    get:
      summary: Obtener historial de solicitudes
      security:
        - bearerAuth: []
      parameters:
        - in: query
          name: limit
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 10
          required: false
          description: Número máximo de resultados a devolver
        - in: query
          name: lastEvaluatedKey
          schema:
            type: string
          required: false
          description: Última clave evaluada para paginación (JSON string)
        - in: query
          name: order
          schema:
            type: string
            enum: [asc, desc]
            default: desc
          required: false
          description: Orden de los resultados por fecha de creación (ascendente o descendente)
      responses:
        "200":
          description: Respuesta exitosa
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: object
                  pagination:
                    type: object
                    properties:
                      lastKey:
                        type: object
                        nullable: true
                      limit:
                        type: integer
  /order:
    post:
      summary: Crear una nueva orden
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: Sable de luz
                price:
                  type: number
                  example: 199.99
                type:
                  type: string
                  example: arma
              required:
                - name
                - price
                - type
      responses:
        "200":
          description: Orden creada exitosamente
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  item:
                    type: object
                    properties:
                      name:
                        type: string
                      price:
                        type: number
                      type:
                        type: string
  /login:
    post:
      summary: Login con Cognito
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                  example: username
                password:
                  type: string
                  example: password123
              required:
                - username
                - password
      responses:
        "200":
          description: Login exitoso
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  data:
                    type: object
                    properties:
                      idToken:
                        type: string
        "400":
          description: Error de validación
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  details:
                    type: array
                    items:
                      type: object
        "401":
          description: Credenciales inválidas
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
`, "utf8").toString();

export const swagger = async () => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/yaml; charset=utf-8",
    },
    body: swaggerYaml,
  };
};
