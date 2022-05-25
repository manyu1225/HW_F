const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const request = require("request");
const qs = require("qs");
const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");

//一、取得授權碼 code https://access.line.me/oauth2/v2.1/authorize
//二、以回傳的授權碼再向 Line 取用戶資料 POST https://api.line.me/oauth2/v2.1/token

const lineAPIController = {
  async authorize(req, res, next) {
    const client_id = process.env.client_id;
    const redirect_uri = process.env.redirect_uri;
    const response_type = "code";
    const scope =process.env.scope; //; // ; //URL += 'profile';
    const authorization_endpoint = process.env.authorization_endpoint;
    let url =
    authorization_endpoint +
      "?response_type=" +
      response_type +
      "&client_id=" +
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
    const client_id = process.env.client_id;
    const client_secret = process.env.client_secret;
    const redirect_uri = process.env.redirect_uri;
    const code = req.query.code;
    const token_endpoint = process.env.token_endpoint;
    axios
      .post(
        token_endpoint,
        "grant_type=authorization_code&code=" +
          req.body.code +
          "&redirect_uri=" +
          redirect_uri +
          "&client_id=" +
          client_id +
          "&client_secret=" +
          client_secret
      )
      .then(function (res2) {
        let decoded = jsonwebtoken.decode(res2.data.access_token);
        let access_token = res2.data.access_token;
        console.log("res_Token=>", res2.data);
        console.log("access_token==>", access_token);
        console.log("decoded=>", decoded);
        handleSuccess(res, httpStatus.OK, res2.data);
      });



    handleSuccess(res, httpStatus.OK, {
      client_id,client_secret,code
    });
  },
  async getLinetoken(req, res, next) {
    const redirect_uri = process.env.redirect_uri;
    const client_id = process.env.client_id;
    const client_secret = process.env.client_secret;
    const token_endpoint = process.env.token_endpoint;

    console.log("client_id=" + client_id + "=== ===" + req.body.code);

    axios
      .post(
        token_endpoint,
        "grant_type=authorization_code&code=" +
          req.body.code +
          "&redirect_uri=" +
          redirect_uri +
          "&client_id=" +
          client_id +
          "&client_secret=" +
          client_secret
      )
      .then(function (res2) {
        let decoded = jsonwebtoken.decode(res2.data.access_token);
        let access_token = res2.data.access_token;
        console.log("res_Token=>", res2.data);
        console.log("access_token==>", access_token);
        console.log("decoded=>", decoded);
        handleSuccess(res, httpStatus.OK, res2.data);
      });
  },
  async getLineUserInfo(req, res, next) {
    const authorization_endpoint = process.env.authorization_endpoint;

    axios
      .get(authorization_endpoint, {
        headers: {
          Authorization: "Bearer " + req.body.access_token,
        },
      })
      .then(function (da) {
        console.log(da.data);
        let id_token = jsonwebtoken.decode(req.body.id_token);

        handleSuccess(res, httpStatus.OK, id_token);
      });
  },
};
module.exports = lineAPIController;
