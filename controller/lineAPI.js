const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const axios = require("axios");
const jsonwebtoken = require("jwt-decode");
const qs = require("qs");
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
    console.log("=======>", req.query.code);
    if (!req.query.code) {
      return appError(httpStatus.BAD_REQUEST, "code 必須有值!", next);
    } else {
      let reqPramater = qs.stringify({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.redirect_uri,
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
      });
      axios
        .post(process.env.token_endpoint, reqPramater, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(function (response) {
          console.log("response.data=>", response.data);
          let decoded = jsonwebtoken(response.data.id_token);
          console.log("decoded.email=>", decoded.email);
          response.data.email = decoded.email;
          handleSuccess(res, httpStatus.OK, response.data);
        })
        .catch(function (error) {
          console.log("err=====>", error);
          return appError(httpStatus.BAD_REQUEST, "ERR.", next);
        });
      console.log("===========2========");
    }
    console.log("=============3======");
  },
  async getLineUserInfo(req, res, next) {
    console.log("============5=====" + req.body.access_token);
    console.log("============6=====" + req.query.access_token);
    axios
      .get(process.env.profile_endpoint, {
        headers: {
          Authorization: "Bearer " + req.query.access_token,
        },
      })
      .then(function (response) {
        console.log("response.data===>", response.data);
        handleSuccess(res, httpStatus.OK, response.data);
      })
      .catch(function (error) {
        console.log("err=====>", error);
        return appError(httpStatus.BAD_REQUEST, "ERR.", next);
      });
  },
};
module.exports = lineAPIController;
