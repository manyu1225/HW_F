const http = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const headers = require('./utils/headers');
const httpStatus = require('./utils/httpStatus');
const handleSuccess = require('./utils/handleSuccess');
const handleError = require('./utils/handleError');
const Posts = require('./model/Posts');

dotenv.config({
    path:'./config.env'
});

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
  );
   
mongoose.connect(DB).then(()=>{
    console.log('DB Conntection SUCCESS!');
});

const reqListener = async(req,res)=>{
    let body ="";
    req.on('data', (chunk)=>{
        body+= chunk;
    })

    if ( req.url === '/' && req.method === 'GET' ) {
        res.writeHead(httpStatus.OK, {'Content-Type': 'text/html'});
        res.write('<h1>HI</h1>');
        res.end();

    } else if(req.url ==='/posts' && req.method ==='GET'){
        const allPosts = await Posts.find();
  
        handleSuccess(res, httpStatus.OK,allPosts);
    }else if(req.url ==='/posts' && req.method ==='POST'){
        req.on("end",async() => {
            try {
                if ( !body ) {
                    handleError(res, httpStatus.INTERNAL_SERVER, "");
                    return ;
                };
                const data  = JSON.parse(body);
                const newPost = await Posts.create(data);
                handleSuccess(res,httpStatus.OK, newPost);
            } catch (err) {
                handleError(res, httpStatus.INTERNAL_SERVER,err.message);
            }
         });
    }else if(req.url.startsWith('/posts/') && req.method ==='DELETE'){
        try {
            const id = req.url.split('/').pop();
            if(!id){
                handleError(res, httpStatus.INTERNAL_SERVER,"資源ID錯誤");
                return ;
            }
            const data = await Posts.findByIdAndDelete(id);
            if(!data){
                handleError(res, httpStatus.INTERNAL_SERVER,"無該ID");
                return ;
            }
            handleSuccess(res,httpStatus.OK,  data);
        } catch (err) {
            handleError(res,httpStatus.INTERNAL_SERVER ,err.message);
        }
    }else if(req.url ==='/posts' && req.method ==='DELETE'){
        try {
            await Posts.deleteMany();
            const allPosts = await Posts.find();
            handleSuccess(res,httpStatus.OK, allPosts);
        } catch (err) {
            handleError(res,httpStatus.INTERNAL_SERVER, err.message);
        }
    } else if ( req.url.startsWith('/posts/') && req.method === 'PATCH' ) {
        req.on('end', async () => {
            try {
                const id = req.url.split('/').pop();
                if(!id){
                    handleError(res, httpStatus.INTERNAL_SERVER,"資源ID錯誤");
                    return ;
                }
                const  data = JSON.parse(body);
                if(!data){
                    handleError(res, httpStatus.INTERNAL_SERVER,"此次無修改內容");
                    return ;
                }
                const updPost = await Posts.
                                findByIdAndUpdate( id,data, { new: true });
               if(!updPost){
                    handleError(res, httpStatus.INTERNAL_SERVER,"無此ID");
                }else{
                    handleSuccess(res,httpStatus.OK, updPost);
                }
            } catch (err) {
                handleError(res,httpStatus.INTERNAL_SERVER, err.message);
            }
        });
    
    } else if ( req.method === 'OPTIONS' ) {
        res.writeHead(httpStatus.OK);
        res.end();
    }else{
        handleError(res,httpStatus.NOT_FOUND, "此路由錯誤!");

    };
};


const server = http.createServer(reqListener);
server.listen(process.env.PORT, ()  => {
    if ( process.env.PORT ) {
        console.log('Deploy Heroku Successfully');
        return;
    }
    console.log(`Server running at http://localhost:${PORT}/`);
});