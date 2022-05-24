const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const axios = require("axios");
const jsonwebtoken = require("jsonwebtoken");

const lineAPIController = {
  async authorize(req, res, next) {
    const client_id = process.env.client_id;
    const redirect_uri = "https://g11herokuexpress.herokuapp.com/line/callback";
    const response_type = "code";
    const scope = "openid%20profile%20email";
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
    const redirect_uri = "https://g11herokuexpress.herokuapp.com/line/callback";
    res.send(
      "<html><body>" +
        '<form method="post" action="https://g11herokuexpress.herokuapp.com/line/token">' +
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
    const redirect_uri = "https://g11herokuexpress.herokuapp.com/line/callback";
    const client_id = process.env.client_id;
    const client_secret = process.env.client_secret;
    axios
      .post(
        "https://api.line.me/oauth2/v2.1/token",
        "grant_type=authorization_code&code=" +
          req.body.code +
          "&redirect_uri=" +
          redirect_uri +
          "&client_id=" +
          client_id +
          "&client_secret=" +
          client_secret
      )
      .then(function (resp) {
        let decoded = jsonwebtoken.decode(resp.data.access_token);
        let access_token = resp.data.access_token;
        console.log("res_Token=>", resp.data);
        console.log("access_token=>", access_token);
        console.log("decoded=>", decoded);
        handleSuccess(res, httpStatus.OK, resp.data);
      });
  },
  async getLineUserInfo(req, res, next) {
    axios
      .get("https://api.line.me/v2/profile", {
        headers: {
          Authorization: "Bearer " + req.body.access_token,
        },
      })
      .then(function (da) {
        console.log(da.data);
        let user = jsonwebtoken.decode(req.body.id_token);
        handleSuccess(res, httpStatus.OK, { email: user.email });
      });
  },
};
module.exports = lineAPIController;
