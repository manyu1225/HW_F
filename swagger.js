const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    version: "1.0.1", // by default: "1.0.0"
    title: "My API",
    description: "", // by default: ""
  },
  host: "localhost:3000", // by default: "localhost:3000"
  basePath: "/", // by default: "/"
  schemes: ["http", "https"], // by default: ['http']
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
const outputFile = "./swagger_output.json"; // 輸出的文件名稱
const endpointsFiles = ["./app.js"]; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以

swaggerAutogen(outputFile, endpointsFiles, doc); // swaggerAutogen 的方法
