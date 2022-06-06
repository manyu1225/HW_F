const bcrypt = require("bcrypt"); //處理密碼，獲得 hashed password
const jwt = require("jsonwebtoken"); //JWT 產生與驗證
const { isLength, isNumeric, isAlpha } = require("validator");

const usersModel = require("../models/User");
const Likes = require("../models/Likes");
const Follow = require("../models/Follow");
const httpStatus = require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const appError = require("../service/appError");
const saveImage = require("../service/saveImage");

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

const usersController = {
  async register(req, res, next) {
    const data = req.body;
    let { name, email, password } = data; //解構
    if (!name || !email || !password) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    }
    const user = await usersModel.findOne({ email });
    if (user) {
      return appError(httpStatus.BAD_REQUEST, "Mail已被註冊！", next);
    }
    const psd = await bcrypt.hash(password, 8);
    const newUser = await usersModel.create({
      name,
      email,
      password: psd,
    });
    await generateAndSendToken(res, httpStatus.CREATED, newUser);
  },
  async signin(req, res, next) {
    const data = req.body;
    let { email, password } = data; //解構
    if (!email || !password) {
      return appError(httpStatus.BAD_REQUEST, "請確認欄位", next);
    }
    const user = await usersModel.findOne({ email }).select("+password");
    if (!user) {
      return appError(httpStatus.BAD_REQUEST, "帳號或密碼有誤！", next);
    }
    const isValidated = await bcrypt.compare(password, user.password);
    if (!isValidated) {
      return appError(httpStatus.BAD_REQUEST, "密碼錯誤！", next);
    }

    await generateAndSendToken(res, httpStatus.OK, user);
  },
  async getUser(req, res, next) {
    const userId = req.params.id;
    const user = await usersModel.findById(userId);

    if (!user) {
      return appError(httpStatus.NOT_FOUND, "查無此使用者", next);
    }

    const followerCount = await Follow.countDocuments({
      targetUserId: userId,
    });

    handleSuccess(res, httpStatus.OK, {
      user,
      followerCount,
    });
  },
  //從 Middleware 之 JWT 取得 User 資訊
  async updatePassword(req, res, next) {
    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
      return appError(httpStatus.BAD_REQUEST, "欄位不可為空", next);
    }

    if (password !== passwordConfirm) {
      return appError(httpStatus.BAD_REQUEST, "密碼輸入不一致", next);
    }

    if (
      !isLength(password, { min: 8 }) ||
      isNumeric(password) ||
      isAlpha(password)
    ) {
      return appError(
        httpStatus.BAD_REQUEST,
        "密碼需至少 8 碼以上，並數字與英文或符號混合",
        next
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const editedUser = await usersModel.findByIdAndUpdate(
      req.user._id,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    await generateAndSendToken(res, httpStatus.OK, editedUser);
  },
  async getProfile(req, res, next) {
    handleSuccess(res, httpStatus.OK, req.user);
  },
  async updateProfile(req, res, next) {
    // 取得 Imgur 網址
    if (req.file) {
      const resObj = await saveImage(req, res, next);
      req.body["photo"] = resObj.imgUrl;
      req.file = undefined;
    }

    const editedUser = await usersModel.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!editedUser) {
      return appError(httpStatus.NOT_FOUND, "查無此使用者", next);
    }

    if (req.body["name"]) {
      await generateAndSendToken(res, httpStatus.OK, editedUser);
    } else {
      handleSuccess(res, httpStatus.OK, editedUser);
    }
  },
  async getlikeList(req, res, next) {
    const user = req.user._id;
    const { pageCount, page, reverse } = req.query;
    const pageNumber = Number(page) || 1;
    const limit = Number(pageCount) || 10;
    const sortBy = Number(reverse) === 1 ? "createAt" : "-createAt";
    const skip = (pageNumber - 1) * limit;

    const likes = await Likes.find({ user })
      .populate({
        path: "user",
        select: "name photo",
      })
      .populate({
        path: "post",
        select: "userId content createAt",
        populate: {
          path: "userId",
          select: "name photo",
        },
      })
      .skip(skip)
      .limit(limit)
      .sort(sortBy);

    const likesCount = await Likes.countDocuments({ user });
    const totalPages = Math.ceil(likesCount / limit);

    handleSuccess(res, httpStatus.OK, {
      pagination: {
        current_pages: pageNumber,
        total_pages: totalPages,
        total_datas: likesCount,
      },
      likes,
    });
  },
};
module.exports = usersController;
