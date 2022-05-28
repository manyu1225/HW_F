const handleSuccess = (res, status, data) => {
  res.status(status).json({
    status: "success",
    data,
  });
};

module.exports = handleSuccess;
