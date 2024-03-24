import swaggerAutogen from "swagger-autogen";

const output = "./swagger.json";
const endpoints = ["./index.ts"];

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Backend API",
    version: "1.0.0",
    description:
      "Backend API",
  },
  servers: [
    {
      url: "http://localhost:8080",
    },
  ],
};

swaggerAutogen(output, endpoints, doc);
