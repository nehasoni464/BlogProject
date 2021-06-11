const jwt = require('jsonwebtoken')
const User=require('../db/model/user')

const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        

     const user= await User.findOne({_id:decoded._id,'tokens.token':token})
   console.log("-->",user)
        if(!user)
        {
            throw new Error()
        }
        req.token=token
        req.user=user
        next()

    }catch(e){
        console.log(e)
        res.status(401).send({error:"please authenticate"})
    }
}
module.exports=auth