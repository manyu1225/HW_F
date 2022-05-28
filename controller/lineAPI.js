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
    console.log("code=======>", req.query.code);
    let linedata = {};
    if (!req.query.code) {
      handleSuccess(res, httpStatus.OK, res.data);
      console.log("=======>state unmatch!");
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
        .then(function (res) {
          console.log("resp.data=>", res.data);
          let decoded = jsonwebtoken(res.data.id_token);
          console.log("decoded.email=>", decoded.email);
          res.data.email = decoded.email;
          linedata.email = decoded.email;
        })
        .catch(function (error) {
          console.log("err=====>", error);
        });
    }
    console.log("=========================err==========");
    handleSuccess(res, httpStatus.OK, linedata);
  },
  async getLinetoken(req, res, next) {
    console.log("getLinetoken====>", req.body.code);

    if (!req.body.code) {
      console.log("=======>state unmatch!");
      return appError(httpStatus.BAD_REQUEST, "ERR...", next);
    } else {
      let reqPramater = qs.stringify({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.redirect_uri,
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
      });
      console.log("reqPramater=======>", reqPramater);

      axios
        .post(process.env.token_endpoint, reqPramater, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(function (resp) {
          console.log("resp.data=>", resp.data);
          let decoded = jsonwebtoken(resp.data.id_token);
          console.log("decoded.email=>", decoded.email);
          resp.data.email = decoded.email;
          handleSuccess(res, httpStatus.OK, resp.data);
        })
        .catch((e) => {
          console.log(e);
          return appError(httpStatus.BAD_REQUEST, "ERR.", next);
        });
    }
    return appError(httpStatus.BAD_REQUEST, "ERR..", next);
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
