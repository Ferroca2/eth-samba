import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();

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
      url: process.env.HOST || "http://localhost:8080",
    },
  ],
};

swaggerAutogen(output, endpoints, doc);
