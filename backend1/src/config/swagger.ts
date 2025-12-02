import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: any = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Google Docs API",
      version: "1.0.0",
      description: "Real-Time Collaborative Notes App backend API"
    },
    servers: [
      {
        // url: "http://localhost:4000/api",
         url: "http://localhost:5000/api",
        description: "Local development server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts"]
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
