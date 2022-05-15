const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API",
    description: "",
  },
  host: "https://g11herokuexpress.herokuapp.com/",
  basePath: "/", // by default: "/"
  schemes: ["https"],
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    {
      name: "Posts",
      description: "貼文 router",
    },
    {
      name: "Users",
      description: "使用者 router",
    },
  ],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "X-API-KEY", // name of the header, query parameter or cookie
      description: "請加上API TOKEN",
    },
  }, // by default: empty object
  definitions: {},
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles);
