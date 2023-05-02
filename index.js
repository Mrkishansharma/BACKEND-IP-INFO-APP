
const express = require('express');

const cookieparser = require('cookie-parser');


const { connection } = require('./db');

const { userRouter } = require('./routes/user.routes');

const app = express();

require('dotenv').config();


app.use(express.json());

app.use(cookieparser());



const winston = require('winston');

const infologger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    transports: [
        new winston.transports.File({ filename: 'logs/info.log' }),
        new winston.transports.Console()
    ],
});

const errorlogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log' }),
        new winston.transports.Console()
    ],
});


app.use((req,res,next)=>{
    infologger.info({
        level: 'info',
        name:"Incomming Request",
        method: req.method,
        Headers: req.headers,
        url:req.url,
        ip:req.ip
    })
    next();
})

function ErrorLoger(err){
    errorlogger.error({
        level : 'error',
        name:"Error occured",
        message : err.message,
        stack : err.stack
    })
}


app.use('/', userRouter);


app.all("*", (req, res)=>{
    res.status(404).send("Page Not Found")
})


app.listen(process.env.port, async () => {
    try {
        await connection
        console.log('DB connected');
    } catch (error) {
        ErrorLoger(error);
        console.log(error);
    }
    console.log(`server is running on port ${process.env.port}`);
})


module.exports = {
    ErrorLoger
}