const httpStatus =require("../utils/httpStatus");
const handleSuccess = require("../service/handleSuccess");
const appError = require("../service/appError");
const user = require('../models/User');
const tempPasswordToken =require('../models/tempTokenForPasswordCheck');
//套件
const bcrypt = require('bcrypt');//為了建置暫時的token
const nodemailer =require('nodemailer');//寄件伺服器
const uuid =require('uuid');//建立亂碼token用途


//參考 https://github.com/paigen11/mysql-registration-passport/blob/master/api/routes/forgotPassword.js
const forgetPasswordController={
    async sentMailForChangePW(req,res,next){
        const email =req.body.email
        if (! email) {           
            return appError(httpStatus.BAD_REQUES, "信箱為必填!", next);
        }

       const userData =await user.findOne(
            {
                    email:email
            }   
        )   

        if (!userData) {
            console.error('email not in database');
            return appError(httpStatus.BAD_REQUES, "資料庫中無此信箱", next);
        }

        const randomCode = uuid.v4();
        const randomSalt = bcrypt.genSaltSync(11);
        const token =bcrypt.hashSync(randomCode,randomSalt);

        await tempPasswordToken.create(
            {
              token:token,  
              email: email,
            }
        );

        const transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                  user: `${process.env.MAILER_ACCOUNT}`,
                  pass: `${process.env.MAILER_PASSWORD}`,
                },
            }
        ) 
        
        //寄件主旨 
        const title = '忘記密碼';
        //寄件內容
        const emailContent = 
        '您好\n\n'
        + '按一下下方連結以重設您帳戶的密碼。\n\n'
        + `https://carolchyang.github.io/nodeFinal/#/signin/${token}\n\n`
        + '此連結將從您收到此封電子郵件起 24 小時內有效。如果您沒有提出此要求，請忽略此電子郵件，您的密碼並未變更。\n' ;
        
        //設定寄件選項
        const mailOptions = {
            from: 'mySqlDemoEmail@gmail.com',
            to: `${userData.email}`,
            subject: title,
            text:emailContent,
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.log(err);
              return appError(httpStatus.BAD_REQUES, "寄件失敗,發生不可預期的錯誤，請重新處理", next);
            } else {
              res.status(200).json('信件已寄出，請確認!');
            }
        });
    }
}

module.exports = forgetPasswordController;