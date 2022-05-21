const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.1",
    title: "REST API",
    description: "",
  },
  host: "localhost:3005", //"localhost:3000",
  basePath: "/", // by default: "/"
  schemes: ["https", "http"], //https
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    {
      name: "Users",
      description: "使用者 router",
    },
    {
      name: "Posts",
      description: "貼文 router",
    },
    {
      name: "Comments",
      description: "回覆 router",
    },
    {
      name:"forget",
      description:"忘記密碼 router",
    }
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "Authorization", // name of the header, query parameter or cookie
      description: "請加上 JWT TOKEN /忘記密碼token 同規",
    },
  }, // by default: empty object
  definitions: {},
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];
swaggerAutogen(outputFile, endpointsFiles, doc);
