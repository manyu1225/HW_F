const handleSuccess = (res, status, data) => {
  res.status(status).json({
    "statis": "success",
    data
  });
}

module.exports = handleSuccess;