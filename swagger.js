const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "REST API",
    description: "",
  },
  host: "localhost:3000", // "g11herokuexpress.herokuapp.com",
  basePath: "/", // by default: "/"
  schemes: ["http"], //https
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
      name: "Authorization", // name of the header, query parameter or cookie
      description: "請加上 JWT TOKEN",
    },
  }, // by default: empty object
  definitions: {},
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
