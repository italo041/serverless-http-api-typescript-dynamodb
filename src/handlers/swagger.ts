import { promises as fs } from "fs";
import { resolve } from "path";

export const swagger = async () => {
  const filePath = resolve(process.cwd(), "swagger.yaml");
  try {
    const swaggerYaml = await fs.readFile(filePath, "utf8");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/yaml"
      },
      body: swaggerYaml
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "No se pudo leer el archivo swagger.yaml"
    };
  }
};
