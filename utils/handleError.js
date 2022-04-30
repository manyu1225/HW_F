const headers = require('./headers');

const handleError = (res,status, msg)=>{
    res.writeHead(status, headers);
    res.write(JSON.stringify({
        "status":"false",
         msg
    }));
    res.end();
}
module.exports = handleError;