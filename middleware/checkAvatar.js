const path = require("path");
const multer = require("multer");
const sizeOf = require("image-size");
const appError = require("../service/appError");
const httpStatus = require("../utils/httpStatus");
const filterObject = require("../utils/filterObject");

const multerOptions = {
  fileSize: 1 * 1024 * 1024, // 1 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = "jpg|png|json";
    const extname = path.extname(file.originalname).toLowerCase();
    if (new RegExp(fileTypes).test(extname)) {
      cb(null, true);
    } else {
      cb(
        appError(
          httpStatus.BAD_REQUEST,
          `只接受 ${fileTypes.split("|").join("、")} 格式`,
          next
        )
      );
    }
  },
};

module.exports = (req, res, next) => {
  const upload = multer(multerOptions).fields([
    { name: "name", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "gender", maxCount: 1 },
  ]);
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    const hasPhoto = req.files && req.files["photo"];
    const allowFileds = ["name", "gender"];
    const filteredBody = filterObject(req.body, allowFileds);

    if (!hasPhoto && Object.keys(filteredBody).length === 0) {
      return appError(httpStatus.BAD_REQUEST, "請填寫正確欄位", next);
    }

    if (hasPhoto) {
      const photoFile = req.files["photo"][0];
      const dimensions = sizeOf(photoFile.buffer);
      if (dimensions.width < 300 || dimensions.width !== dimensions.height) {
        return next(
          appError(
            httpStatus.BAD_REQUEST,
            `圖片必須是正方形且解析度大於 300`,
            next
          )
        );
      }
      req.file = photoFile;
    }

    next();
  });
};
