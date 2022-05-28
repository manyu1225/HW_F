const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const axios = require("axios");
const jsonwebtoken = require("jwt-decode");

const lineAPIController = {
  async authorize(req, res, next) {
    const client_id = process.env.client_id;
    const redirect_uri = process.env.redirect_uri;
    const scope = process.env.scope;
    const authorization_endpoint = process.env.authorization_endpoint;
    let url =
      authorization_endpoint +
      "?response_type=code&client_id=" +
      client_id +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri) +
      "&state=" +
      process.env.state +
      "&scope=" +
      scope;
    res.redirect(url);
  },
  async callback(req, res, next) {
    console.log("code=======>", req.query.code);

    let reqPramater =
      "grant_type=authorization_code&code=" +
      req.query.code +
      "&redirect_uri=" +
      process.env.redirect_uri +
      "&client_id=" +
      process.env.client_id +
      "&client_secret=" +
      process.env.client_secret;
    console.log("reqPramater=======>", reqPramater);
    if (!req.query.code) {
      handleSuccess(res, httpStatus.OK, resp.data);
      console.log("=======>state unmatch!");
    } else {
      res.send(
        "<html><body>" +
          '<form method="post" action="/line/token">' +
          '<table><tr><th>grant_type</th><td><input type="text" name="grant_type" size="100" value="authorization_code"></td></tr>' +
          '<tr><th>code</th><td><input type="text" name="code" size="100" value="' +
          req.query.code +
          '"></td></tr>' +
          '<tr><th>redirect_uri</th><td><input type="text" name="redirect_uri" size="100" value="' +
          process.env.redirect_uri +
          '"></td></tr>' +
          '<tr><th>client_id</th><td><input type="text" name="client_id" size="100" value="' +
          process.env.client_id +
          '"></td></tr>' +
          '<tr><th>client_secret</th><td><input type="text" name="client_secret" size="100" value="' +
          process.env.client_secret +
          '"></td></tr>' +
          '</table><button type="submit">Exchange code to token</button><br>' +
          "</form></body></html>"
      );
    }
    return;
  },
  async getLinetoken(req, res, next) {
    console.log("getLinetoken====>", req.body.code);
    let reqPramater =
      "grant_type=authorization_code&code=" +
      req.body.code +
      "&redirect_uri=" +
      process.env.redirect_uri +
      "&client_id=" +
      process.env.client_id +
      "&client_secret=" +
      process.env.client_secret;
    if (!req.body.code) {
      console.log("=======>state unmatch!");
      return appError(httpStatus.BAD_REQUEST, "ERR", next);
    } else {
      axios
        .post(process.env.token_endpoint, reqPramater)
        .then(function (resp) {
          console.log("resp.data=>", resp.data);
          let decoded = jsonwebtoken(resp.data.id_token);
          console.log("decoded.email=>", decoded.email);
          resp.data.email = decoded.email;
          handleSuccess(res, httpStatus.OK, resp.data);
        })
        .catch((e) => {
          console.log(e);
          return appError(httpStatus.BAD_REQUEST, "ERR", next);
        });
    }
    return appError(httpStatus.BAD_REQUEST, "ERR", next);
  },
  async getLineUserInfo(req, res, next) {
    axios
      .get(process.env.profile_endpoint, {
        headers: {
          Authorization: "Bearer " + req.body.access_token,
        },
      })
      .then(function (resp) {
        console.log(resp.data);
        handleSuccess(res, httpStatus.OK, resp.data);
      });
  },
};
module.exports = lineAPIController;
