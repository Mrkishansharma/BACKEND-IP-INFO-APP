

const validation = (req, res, next) => {
    const {IP} = req.params;
    
    const regularExpression = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
    
    const isValid = regularExpression.test(IP);
    
    console.log(isValid);

    if(isValid){

        next();

    }else{

        return res.status(400).send({
            msg:"IP Address is not valid"
        })

    }

}


module.exports = {validation}