const headers = require('./headers');
const handleSuccess =(res,status, data)=>{
    res.writeHead(status, headers);
    res.write(JSON.stringify({
        "statis":"success",
        "data":data
    }));
    res.end();
}

module.exports = handleSuccess;