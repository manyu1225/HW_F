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
    const redirect_uri =
      "https://intense-fortress-59028.herokuapp.com/line/callback";
    const response_type = "code";
    const scope = "profile"; //"openid%20profile%20email"; // ; //URL += 'profile';
    let url =
      "https://access.line.me/oauth2/v2.1/authorize" +
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
    const redirect_uri =
      "https://intense-fortress-59028.herokuapp.com/line/callback";
    res.send(
      "<html><body>" +
        '<form method="post" action="https://intense-fortress-59028.herokuapp.com/line/token">' +
        '<table><tr><th>grant_type</th><td><input type="text" name="grant_type" size="100" value="authorization_code"></td></tr>' +
        '<tr><th>code</th><td><input type="text" name="code" size="100" value="' +
        req.query.code +
        '"></td></tr>' +
        '<tr><th>redirect_uri</th><td><input type="text" name="redirect_uri" size="100" value="' +
        redirect_uri +
        '"></td></tr>' +
        '<tr><th>client_id</th><td><input type="text" name="client_id" size="100" value="' +
        client_id +
        '"></td></tr>' +
        '<tr><th>client_secret</th><td><input type="text" name="client_secret" size="100" value="' +
        client_secret +
        '"></td></tr>' +
        '</table><button type="submit">Exchange code to token</button><br>' +
        "</form></body></html>"
    );
  },
  async getLinetoken(req, res, next) {
    const redirect_uri =
      "https://intense-fortress-59028.herokuapp.com/line/callback";
    const client_id = process.env.client_id;
    const client_secret = process.env.client_secret;
    console.log("=========================" + req.body.code);
    request.post(
      "https://api.line.me/oauth2/v2.1/token",
      {
        form: {
          grant_type: "authorization_code",
          code: req.body.code,
          redirect_uri: redirect_uri,
          client_id: client_id,
          client_secret: client_secret,
        },
      },
      function (e, r, body) {
        if (!e && r.statusCode == 200) {
          var jsonBody = JSON.parse(body);
          try {
            var id_token = jsonwebtoken.verify(
              jsonBody.id_token,
              client_secret
            );
            res.send(
              "<html><body>" +
                '<form method="post" action="/userInfo">' +
                '<table><tr><th>access_token</th><td><input type="text" name="access_token" size="100" value="' +
                jsonBody.access_token +
                '"></td></tr>' +
                '<tr><th>token_type</th><td><input type="text" name="token_type" size="100" value="' +
                jsonBody.token_type +
                '"></td></tr>' +
                '<tr><th>refresh_token</th><td><input type="text" name="refresh_token" size="100" value="' +
                jsonBody.refresh_token +
                '"></td></tr>' +
                '<tr><th>expires_in</th><td><input type="text" name="expires_in" size="100" value="' +
                jsonBody.expires_in +
                '"></td></tr>' +
                '<tr><th>scope</th><td><input type="text" name="scope" size="100" value="' +
                jsonBody.scope +
                '"></td></tr>' +
                '<tr><th><a href="https://jwt.ms#id_token=' +
                jsonBody.id_token +
                '" target="_blank">id_token</a></th><td><input type="text" name="id_token" size="100" value="' +
                jsonBody.id_token +
                '"></td></tr>' +
                '</table><button type="submit">get userInfo</button><br>' +
                "</form></body></html>"
            );
          } catch (err) {
            res.send("error");
            console.log(err.toString());
          }
        } else {
          res.send("error");
          console.log(body);
        }
      }
    );
  },
  async getLineUserInfo(req, res, next) {
    request.get(
      "https://api.line.me/v2/profile",
      {
        headers: {
          Authorization: "Bearer " + req.body.access_token,
        },
      },
      function (e, r, body) {
        if (!e && r.statusCode == 200) {
          var jsonBody = JSON.parse(body);
          res.send(
            "<html><body>" +
              '<table border="1"><tr><th>userId</th><td>' +
              jsonBody.userId +
              "</td></tr>" +
              "<tr><th>displayName</th><td>" +
              jsonBody.displayName +
              "</td></tr>" +
              "<tr><th>pictureUrl</th><td>" +
              jsonBody.pictureUrl +
              "</td></tr>" +
              "</table>" +
              "</body></html>"
          );
        } else {
          res.send("error");
          console.log(body);
        }
      }
    );
  },
};
module.exports = lineAPIController;
