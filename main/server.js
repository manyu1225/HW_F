/*
## curl -k https://localhost:8000 => k: curl 略過檢查自簽 SSL 憑證有效性
## curl http://localhost:8000 
## Curl OPTIONS Syntax (https://reqbin.com/req/c-haxm0xgr/curl-basic-auth-example)
### curl http://localhost:8002 -X OPTIONS -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type" -H "Origin: http://localhost"
## curl -O index.html http://localhost:8002
## curl -o index.html http://localhost:8002
## curl -X POST -F 'name=Jason' -F 'email=jason@example.com' http://localhost:8000 //使用该-F选项时，curl使用 Content-Type 为“multipart/form-data”发送数据。
## curl -X POST -d 'name=Jason' -d 'email=jason@example.com' http://localhost:8000 //使用-d选项。这导致curl使用application/x-www-form-urlencodedContent-Type发送数据
## curl -X POST -d 'name=Jason&email=jason@example.com' http://localhost:8000
## curl -X POST -H "Content-Type: application/json" -d '{"name": "Jason", "email": "jason@example.com"}' http://localhost:8000 //-H选项:指定Content-Type
## curl -X POST -F 'image=@/home/user/Pictures/wallpaper.jpg' http://localhost:8000 //文件上传:文件位置之前添加 at 符号
# https://www.itread01.com/p/190409.html
## 指令:curl
在linux中curl是一個利用URL規則在命令列下工作的檔案傳輸工具,可以說是一款很強大的http命令列工具。它支援檔案的上傳和下載,是綜合傳輸工具,但按傳統,習慣稱url為下載工具。
### 語法:# curl [option] [url]
常見引數:
-A/--user-agent <string> 設定使用者代理髮送給伺服器
-b/--cookie <name=string/file> cookie字串或檔案讀取位置
-c/--cookie-jar <file> 操作結束後把cookie寫入到這個檔案中
-C/--continue-at <offset> 斷點續轉
-D/--dump-header <file> 把header資訊寫入到該檔案中
-e/--referer 來源網址
-f/--fail 連線失敗時不顯示http錯誤
-o/--output 把輸出寫到該檔案中
-O/--remote-name 把輸出寫到該檔案中,保留遠端檔案的檔名
-r/--range <range> 檢索來自HTTP/1.1或FTP伺服器位元組範圍
-s/--silent 靜音模式。不輸出任何東西
-T/--upload-file <file> 上傳檔案
-u/--user <user[:password]> 設定伺服器的使用者和密碼
-w/--write-out [format] 什麼輸出完成後
-x/--proxy <host[:port]> 在給定的埠上使用HTTP代理
-#/--progress-bar 進度條顯示當前的傳送狀態

## CORS https://blog.huli.tw/2021/02/19/cors-guide-1/
1.response.header：Access-Control-Allow-Origin: * ，(任何 origin 的網站都可以用 AJAX 存取這個資源)。
2.preflight request:
  2.1 簡單請求:
    =>method 是 GET、POST 或是 HEAD 然後不要帶自訂的header，Content-Type 也不要超出：application/x-www-form-urlencoded、multipart/form-data 或是text/plain 這三種
  2.2 非簡單請求:
   => Access-Control-Request-Headers: content-type、Access-Control-Request-Method: POST
  2.3 (我願意接受這個 header)
   =>Access-Control-Allow-Headers: X-App-Version,content-type。
3. 帶上Cookie
 =>Access-Control-Allow-Credentials: true 
 =>Access-Control-Allow-Origin 不能是 *
4.存取自訂 header
 存取 CORS response的header，尤其是自定義的header，後端要多帶一個Access-Control-Expose-Headers的header，這樣前端才拿得到
5.跨來源的請求只接受三種 HTTP Method：GET、HEAD 以及 POST，除了這三種之外，都必須由後端回傳一個 Access-Control-Allow-Methods，讓後端決定有哪些 method 可以用。
 =>Access-Control-Allow-Methods:PATCH
ˊ快取 preflight reques
6.快取 preflight request(跟瀏覽器說這個 preflight response 能夠快取幾秒)
 =>Access-Control-Max-Age
 */

const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle = require('../tools/errorhandle');
const header = require('../tools/header');
const rootPath = '/todos';
const todolist = [];
// function createServer(requestListener?: http.RequestListener): http.Server (+1 overload)
const requestListener = (req, res) => {

    let reqUrl = req.url;
    let reqMethod = req.method;
    let body = '';
    //接收請求的數據
    req.on('data', chunk => {
        body += chunk;//一定要使用+=，如果body=chunk，因为请求favicon.ico，body会等于{}
    });

    console.log("req.method=" + reqMethod);
    //GET
    if (reqUrl == rootPath & reqMethod === 'GET') {
        res.writeHead(200, header);
        res.write(JSON.stringify({
            "status": "200",
            "data": todolist,
        }));
        res.end();
    } else if (reqUrl == rootPath && reqMethod === 'POST') {
        //在end事件触发后。
        req.on('end', () => {
            //字串成對象
            try {
                const oBody = JSON.parse(body);// null;
                const data = {
                    "title": oBody?.title ?? '',
                    "id": uuidv4(),
                }
                todolist.push(data);
                res.writeHead(200, header);
                res.write(JSON.stringify({
                    "status": "200",
                    "data": todolist,
                }));
                res.end();
            } catch (error) {
                errHandle(res, header);
            }
        });

    } else if (reqUrl.startsWith(rootPath + '/') && reqMethod === 'PATCH') {
        req.on('end', () => {
            try {
                const updTitle = JSON.parse(body).title;
                const id = reqUrl.split('/')?.pop() ?? undefined;
                const index = todolist.findIndex(todo => todo.id == id);
                if (updTitle !== undefined && index !== -1) {
                    console.log("22=" + updTitle);
                    todolist[index].title = updTitle;
                    res.writeHead(200, header);
                    res.write(JSON.stringify({
                        "status": "200",
                        "data": todolist,
                    }));
                } else {
                    errHandle(res, header);
                }
                res.end();
            } catch (error) {
                errHandle(res, header);
            }
        });
    } else if (reqUrl == rootPath && reqMethod === 'DELETE') {//delete all
        todolist.length = 0;
        res.writeHead(200, header);
        res.write(JSON.stringify({
            "status": "200",
            "data": todolist,
        }));
        res.end();
    } else if (reqUrl.startsWith(rootPath + '/') && reqMethod === 'DELETE') {
        const id = reqUrl.split('/').pop();
        const index = todolist.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todolist.splice(index, 1);
            res.writeHead(200, header);
            res.write(JSON.stringify({
                "status": "200",
                "data": todolist,
            }));

        } else {
            res.writeHead(500, header);
            res.write(JSON.stringify({
                "status": "false",
                "data": `'無此ID: ${id}`,
            }));
        }
        res.end();
    } else if (reqMethod == 'OPTIONS') {
        res.writeHead(200, header);
        res.write("HELLO OPTIONS~\n");
        res.end();
    } else {
        res.writeHead(404, header);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }

}

http.createServer(requestListener).listen(process.env.PORT || 3005);




