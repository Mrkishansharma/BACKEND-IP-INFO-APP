
const jwt = require('jsonwebtoken');

const { ErrorLoger } = require('..');

require('dotenv').config();

const ioredis = require('ioredis');

const redis = new ioredis();


const auth = (req, res, next) => {

    const {token} = req.cookies;

    if(!token){

        return res.status(400).send({
            msg:"Kindly login first"
        })
        
    }


    try {

        const decoded = jwt.verify(token, process.env.AccessTokenKey);

        if(decoded){
            redis.get('blacklisted', (err,data)=>{
                if(data){

                    data = JSON.parse(data);

                    if(data.includes(token)){

                        return res.status(400).send({msg:"Kindly Login First"})

                    }else{

                        req.body.userID = decoded.userID;

                        next()

                    }

                }else{

                    req.body.userID = decoded.userID;

                    next()

                }
            })
            
            

        }else{

            return res.status(400).send({
                msg:"Something went wrong. Please try again after some time."
            })
        }
        
    } catch (error) {

        ErrorLoger(error)
        
        return res.status(500).send({
            error:error
        })

    }
}


module.exports = {
    auth
}