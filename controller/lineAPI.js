const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const qs = require("qs");
const axios = require("axios");
//一、取得授權碼 code https://access.line.me/oauth2/v2.1/authorize
//二、以回傳的授權碼再向 Line 取用戶資料 POST https://api.line.me/oauth2/v2.1/token

const lineAPIController = {
  async getAuthorizeUrl(req, res, next) {
    const client_id = "1657154166";
    const response_type = "code";
    const state = "123123";
    const scope = "openid%20profile%20email"; //URL += 'profile';
    const redirect_uri = "https://intense-fortress-59028.herokuapp.com/";
    let url =
      "https://access.line.me/oauth2/v2.1/authorize" +
      "?response_type=" +
      response_type +
      "&client_id=" +
      client_id +
      // process.env.client_id +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri) +
      "&state=" +
      state +
      "&scope=" +
      scope;
    console.log("state unmatch!" + url);
    res.redirect(url);
    //   handleSuccess(res, httpStatus.OK, url);
  },
  async getLinetoken(req, res, next) {
    const data = req.body;
    const { code } = data;
    const client_id = "1657154166";
    const client_secret = "f6603d07c801c0631bf0306a8058a24f";
    const payload = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: encodeURIComponent(
        "https://intense-fortress-59028.herokuapp.com/"
      ),
      client_id: client_id,
      client_secret: client_secret,
    };
    const resp = axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify(payload)
    );
    handleSuccess(res, httpStatus.OK, resp);
  },
  async getLineUserInfo(req, res, next) {
    const url = "https://api.line.me/oauth2/v2.1/verify";
    const client_id = "1657154166";
    const data = req.body;
    const { id_token } = id_token;
    const resp = axios.post(
      url,
      qs.stringify({
        client_id: client_id,
        id_token: id_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    );
    handleSuccess(res, httpStatus.OK, resp);
  },
  async cb(req, res, next) {
    const client_id = "1657154166";
    const client_secret = "f6603d07c801c0631bf0306a8058a24f";
    const redirect_uri = "https://intense-fortress-59028.herokuapp.com/cb";
    res.send(
      "<html><body>" +
        '<form method="post" action="/token">' +
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
  async gettoken(req, res, next) {
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
          // verify jwt signature
          try {
            var id_token = jsonwebtoken.verify(
              jsonBody.id_token,
              client_secret
            );
            // verify nonce in jwt

            // show form
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
      };
  },
  //grant_type=authorization_code&code=DYHBuiE7ujY09oweyYAM&redirect_uri=https%253A%252F%252Fintense-fortress-59028.herokuapp.com%252F&client_id=1657154166&client_secret=f6603d07c801c0631bf0306a8058a24f
  /* let queryData = this.$route.query;
   const id = req.params.id;
  getLineToken(payload).then((res) => {
    getLineUserInfo(this.client_id, res.data.id_token).then((userInfo) => {
      window.history.pushState('', '', window.location.pathname);
      this.vEmail = userInfo.data.email;
      this.vName = userInfo.data.name;
    });
  });
};*/
};
module.exports = lineAPIController;
