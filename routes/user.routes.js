
const { UserModel } = require("../models/user.model");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const {Router } = require('express');



const ioredis = require('ioredis');

const redis = new ioredis();



const { validation } = require("../middlewares/validation");

const { SearchModel } = require("../models/search.model");

const { auth } = require("../middlewares/auth");


const { ErrorLoger } = require("..");


const userRouter = Router();


userRouter.post('/register', async (req,res)=>{

    const {email, pass, name} = req.body;

    if(!(email && pass && name)){
        return res.status(400).send({msg:"Kindly Pass all the details."});
    }

    try {

        const userPresent = await UserModel.findOne({email});
        if(userPresent){
           return res.status(400).send({msg:"User Already present"});
        }

        const hasPassword = bcrypt.hashSync(pass, 5);

        const newuser = new UserModel({name, email, pass:hasPassword});
        await newuser.save();

        return res.status(200).send({
            msg:"Registration successfull",
            user:newuser
        });

    } catch (error) {

        ErrorLoger(error)

        return res.status(500).send({error:error.message});

    }
})



userRouter.post('/login', async (req,res)=>{

    const {email, pass} = req.body;

    if(!(email && pass)){
        return res.status(400).send({msg:"Kindly Pass all the details."});
    }

    try {
        
        const userPresnet = await UserModel.findOne({email});
        if(!userPresnet){
            return res.status(400).send({msg:"User does not exit."});
        }

        const isVerify = bcrypt.compareSync(pass, userPresnet.pass);

        if(isVerify){

            const token = jwt.sign({userID:userPresnet._id}, process.env.AccessTokenKey, {expiresIn:"6h"});

            res.cookie("token", token, {maxAge:1000*60*6});

            return res.status(200).send({msg:"Login Successfull"});

        }else{

            return res.status(400).send({msg:"Invalid Password"});

        }

    } catch (error) {

        ErrorLoger(error)

        return res.status(500).send({error:error.message});

    }
})



userRouter.get('/logout', async (req,res)=>{
    const {token} = req.cookies;

    redis.get("blacklisted", (err, data)=>{

        if(err){

            return res.status(400).send({msg:"someting went wrong", err:err});

        }

        if(data){

            data = JSON.parse(data)

            data.push(token);

            console.log(data)

            redis.set('blacklisted', JSON.stringify(data), "EX", 1000*60*6);

            res.status(200).send({msg:"logout successfull"})

        }else{

            const arr = []

            arr.push(token);

            redis.set('blacklisted', JSON.stringify(arr), "EX", 1000*60*6);

            res.status(200).send({msg:"logout successfull"})

        }
    })
})



userRouter.get('/current-location/:IP', validation, auth,  async (req,res)=>{

    const {IP} = req.params;

    const {userID} = req.body;

    try {

        const search = await SearchModel.findOne({userID});

        if(search){

            // console.log(search)
            search.searches.push(IP)

            await SearchModel.findByIdAndUpdate({_id:search._id}, search)

            console.log(search)

        }else{

            const searches = []

            searches.push(IP)

            const newsearch = new SearchModel({userID,searches })

            newsearch.save()

        }
    } catch (error) {

        ErrorLoger(error)

        return res.status(500).send("Something went wrong")
        
    }

    redis.get(IP, async (err,data)=>{

        if(err){

            return res.status(400).send({msg:"something went worng", err:err});

        }
        if(data){
            // console.log(data);
            return res.status(200).send({
                msg:"Your current city data(from redis) : ",
                Data:JSON.parse(data)
            })

        }else{

            const cityData = await  fetch(`https://ipapi.co/${IP}/json/`).then(res => res.json());

            redis.set(IP, JSON.stringify(cityData), "EX", 60*60*6);

            return res.status(200).send({
                msg:"Your current city data(from DB) : ",
                Data:cityData
            })

        }
    })

})



module.exports = {
    userRouter
}