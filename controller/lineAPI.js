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
      axios
        .post(process.env.token_endpoint, reqPramater, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
        })
        .then(function (resp) {
          console.log("resp.data=>", resp.data);
          let decoded = jsonwebtoken(resp.data.id_token);
          console.log("decoded.email=>", decoded.email);
          resp.data.email = decoded.email;
          res.send({
            status: "success",
            data: resp.data,
          });
          return;
        })
        .catch((e) => {
          console.log("error", e.response.request._response);
          return appError(httpStatus.BAD_REQUEST, "ERR.", next);
        });
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
