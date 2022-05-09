
const handleError = (res,status, msg)=>{
    res.status(status).json({
        status: 'fail',
        message:msg
        });
}
module.exports = handleError;