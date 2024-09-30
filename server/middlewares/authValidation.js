const joi = require('joi')

const signupValidation = (req,res,next)=>{
    const Schema = joi.object({
        username: joi.string().min(4).max(20).required(),
        email:joi.string().email().required(),
        password: joi.string().min(8).max(16)
    })
    const data = {username:req.body.username,email:req.body.email,password:req.body.password}
    const {error} = Schema.validate(data)
    if(error){
        return res.status(400).json({message:`error ${error}`})
    }
    next();
}
const loginValidation = (req,res,next)=>{
    
    const Schema = joi.object({
        email:joi.string().email().required(),
        password: joi.string().min(8).max(16).required(),
    })
    const {error} = Schema.validate(req.body)
    if(error){
        return res.status(400).json({message:`error ${error}`})
    }
    next();
}
module.exports = {
    loginValidation,
    signupValidation
}