const dotenv = require('dotenv');

const mongoose = require('mongoose');

dotenv.config({
    path: './config.env'
});

const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
    console.log('DB Conntection SUCCESS!')
}).catch((e) => console.error(e));
