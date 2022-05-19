const httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401, // 登入授權失敗
  FORBIDDEN: 403, // 已登入但沒權限訪問
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
};
module.exports = httpStatusCodes;
