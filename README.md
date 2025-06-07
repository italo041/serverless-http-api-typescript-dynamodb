## Prerequisitos

- Node.js (versión 20.x o superior)
- npm (Node Package Manager)
- Serverless Framework instalado globalmente (`npm install -g serverless`)
- Cuenta de AWS con permisos IAM para desplegar funciones Lambda

## Estructura del Proyecto

```
aws-node-http-api-typescript-dynamodb
├── src
│   ├── dtos/             # Definiciones de Data Transfer Objects (DTOs)
│   ├── handlers/         # Funciones Lambda (merged, getHistory, createOrder)
│   ├── services/         # Lógica de negocio y acceso a datos
│   ├── utils/            # Funciones utilitarias y helpers
│
├── tests/                # Pruebas unitarias
├── .env                  # Variables de entorno (no versionado)
├── serverless.yml        # Configuración de Serverless Framework
├── package.json          # Dependencias y scripts npm
├── tsconfig.json         # Configuración de TypeScript
└── README.md             # Documentación del proyecto
```

## Instrucciones de Instalación

1. Clona el repositorio o descarga los archivos del proyecto.
2. Configura tus credenciales de AWS:
   ```
   aws configure
   ```
3. Instala las dependencias del proyecto:
   ```
   npm install
   ```

## Despliegue

Para desplegar la aplicación en AWS Lambda, ejecuta:
```
npm run deploy
```
Después del despliegue, toma nota de la URL del endpoint que aparece en la salida.

## Endpoints Disponibles

- **GET /merged**  
  Devuelve datos combinados de StarWars y MediaWiki cacheados en DynamoDB.
- **GET /history**  
  Devuelve el historial de solicitudes almacenadas en DynamoDB.  
- **POST /order**  
  Crea una nueva orden en la tabla Orders.

## Throttling en API Gateway

El throttling de la API Gateway está configurado en `serverless.yml` bajo la sección `custom.apiGatewayThrottling`:
```yaml
custom:
  apiGatewayThrottling:
    maxRequestsPerSecond: 2
    maxConcurrentRequests: 2
```
## Uso

Ejemplo para probar el endpoint `/merged`:
```
curl https://<your-api-id>.execute-api.<region>.amazonaws.com/merged
```

Ejemplo para crear una orden:
```
curl -X POST https://<your-api-id>.execute-api.<region>.amazonaws.com/order \
  -d '{"name":"Sable de luz","price":199.99,"type":"arma"}' \
  -H "Content-Type: application/json"
```
Ejemplo para devolver el historial:

Parámetros soportados (query string):
- `limit`: número entero entre 1 y 100, opcional, por defecto 10.
- `lastKey`: string opcional para paginación.

Ejemplo:
```
curl "https://<your-api-id>.execute-api.<region>.amazonaws.com/history?limit=5&lastKey=eyJpZCI6IjEyMyJ9"
  ```

## Pruebas Locales

Puedes ejecutar y probar localmente con:
```
npm run offline
```
Las pruebas unitarias se encuentran en la carpeta `/tests` y pueden ejecutarse con:
```
npm run test
```

## Notas

- Los datos se almacenan en las tablas DynamoDB: `StarWarsRequests`, `Orders` y `CacheTable`.