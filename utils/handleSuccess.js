const handleSuccess =(res,status, data)=>{
    res.status(status).json({
        "statis":"success",
        data: {
          data
          }
        });
}

module.exports = handleSuccess;