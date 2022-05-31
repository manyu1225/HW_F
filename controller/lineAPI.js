const usersModel = require("../models/User");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const handleErrorAsync = require("../service/handleErrorAsync");
const appError = require("../service/appError");
const axios = require("axios");
const jsonwebtoken = require("jwt-decode");
const qs = require("qs");
const jwt = require("jsonwebtoken");

const generateAndSendToken = async (res, statusCode, user) => {
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_DAY,
    }
  );
  const resData = {
    token,
    user,
  };
  handleSuccess(res, statusCode, resData);
};

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
      await axios
        .post(process.env.token_endpoint, reqPramater, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then(async function (response) {
          let decoded = jsonwebtoken(response.data.id_token);
          response.data.email = decoded.email;

          const user = await usersModel
            .findOne({ email: decoded.email })
            .select("+password");

          if (!user) {
            const newUser = await usersModel.create({
              name: decoded.name,
              email: decoded.email,
              token: response.data.access_token,
              password: response.data.access_token,
            });
            if (!newUser) {
              return appError(httpStatus.BAD_REQUEST, "LINE登入失敗!", next);
            }
            generateAndSendToken(res, httpStatus.CREATED, newUser);
          } else {
            const editedUser = await usersModel.findByIdAndUpdate(
              user.id,
              {
                token: response.data.access_token,
              },
              { new: true, runValidators: true }
            );
            if (!editedUser) {
              return appError(httpStatus.BAD_REQUEST, "LINE登入失敗!", next);
            }
            generateAndSendToken(res, httpStatus.CREATED, editedUser);
          }
        })
        .catch(function (error) {
          return appError(httpStatus.BAD_REQUEST, error, next);
        });
    }
  },
  async getLineUserInfo(req, res, next) {
    axios
      .get("https://api.line.me/v2/profile", {
        headers: {
          Authorization: "Bearer " + req.body.access_token,
        },
      })
      .then(function (response) {
        handleSuccess(res, httpStatus.OK, response.data);
      })
      .catch(function (error) {
        return appError(httpStatus.BAD_REQUEST, error, next);
      });
  },
};
module.exports = lineAPIController;
