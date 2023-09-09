const jwt = require('jsonwebtoken');
const { success, error, validation } = require('../utils/responseApi.js');
const User = require('../models/userModel.js');


module.exports = {
    //jwt token verification middleware
    tokenVerification : async(req,res,next) => {
        try{
            console.log("ethy");
            // console.log('Entered for token verification');
            // console.log(req.headers['autherization'])
            const token = req.headers['autherization']?.split(' ')[1]

            const decode = jwt.verify(token,process.env.JWT_SECRET);
            // console.log(decode,'decoded')
            const user = decode._id;
            // console.log(user,'This is the user');
            req.user = user
            next();
        }catch (err) {  
            // console.log(err);
            return res.status(403).json(error('User is unautherized, Please login as a valid user',res.statusCode))
        }
    },

    isBlocked:async(req,res,next) => {
        try {
            const user = await User.findOne({email:req.user});
            if(user.status === 'Inactive'){
                // return res.json(success('OK',{token:token},res.statusCode)).status(200)
                return res.json({msg:'Something went wrong, Please try after sometimes'}).status(200)

                // return res.json(403).json(error("Your account has been blocked"))
            }else{
                next()
            }
        } catch (err) {
            return res.json({msg:'Something went wrong, Please try after sometimes'}).status(200)

            // return res.status(500).json(err('Something went wrong, Try after sometimes',res.statusCode))
        }
    }
}
