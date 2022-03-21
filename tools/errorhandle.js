function errorHandle(res, header) {
    res.writeHead(400, header);
    res.write(JSON.stringify({
        "status": "false",
        "message": "欄位未填寫正確，或無此 todo id",
    }));
    res.end();
}

module.exports = errorHandle;