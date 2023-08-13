const  BadRequest  = require('../../utils/errors/badRequest.js');
const { catchAsync } = require("../../utils/errors/catchAsync.js");
const schema = require('../../utils/validations/auth.schema.js')
const { success } = require('../../utils/responseApi.js')
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const User = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { sendVerificationMail } = require('../../utils/sendVerificationMail.js');
const { token } = require('morgan');



const createToken = (_id) => {
    const jwtSecretKey = process.env.JWT_SECRET;
    return jwt.sign({_id}, jwtSecretKey, { expiresIn: "3d"})
};

const userSignUp = catchAsync(async (req,res) => {
    try {
        const { name, email, password } = req.body;
        const {error, value } = schema.signupSchema.validate({
            name, email, password
        });

        if(error) throw new BadRequest(error.message) 
        //checking whether the email exist
        const isExist = await User.findOne({email:email});
        if(isExist){
            return res.json({msg:'Email already exist'}).status(409);
        }

        //becrypting the password
        const hashedPassword = await bcrypt.hash(password,10);

        //creating the user
        const user = await new User({
            name:name,
            email:email,
            password:hashedPassword,
            emailToken:crypto.randomBytes(64).toString("hex")
        }).save();
         
        sendVerificationMail(user,'register')

        const token = createToken(user._id)

        return res.status(201).json({msg:`A link to verify your account has been sent to ${email}`});
    } catch (error) {
        console.log(error);
        res.json({msg:'something went wrong'}).status(500);
    }
});

const userLogin = catchAsync(async (req, res) => {
    try {
        const { email, password } =req.body;
        // checking whether the user exist
        const isExist = await User.findOne({email:email})
        if(!isExist){
            return res.json({msg:"Email doesn't exist, Please try again..."}).status(401)
        }
        const checkPassword = await bcrypt.compare(password,isExist.password);
        if(!checkPassword){
            return res.json({msg:"Invalid Credentials, Please try again..."}).status(401)
        }
        // checking whether user email is verified
        if(!isExist.email_verified){
            console.log("===================================");
            return res.json({msg:'Please verify your email before login'}).status(403)
        }
        
        //setting up the user status
        let role;
        if(isExist.isInstructor === true) {
            role = 'instructor'
        } else {
            role = 'user'
        }
        // generating jwt token
        const token = createToken(isExist._id)
        return res.json(success('OK',{token:token},res.statusCode)).status(200)
    } catch (error) {
        console.log(error);
        res.json({msg:'Something went wrong, Please try after sometimes'}).status(500)
    }
    
})

const getUserProfile = async(req,res) => {
    const user = await User.findById({ _id: req.user })
    console.log(user,'njaan aanu user')
    res.status(200).json({ success: true, user})
}

//verifying the token
const verifyToken = async(req,res)=>{
    try{
        const decode = jwt.verify(req.body.token,process.env.JWT_SECRET);
        return res.status(200).json({msg:'user authenticated successfully...',user:decode});
    }catch(err){
        console.log(err);
        return res.status(403).json({msg:'Invalid authentication token...'})
    }
    
}

//verify email confirmation link
const verifyEmail = async (req,res) => {
    try {
        
        //getting the token
        const emailToken = req.body.token;
        console.log(emailToken);
        if(!emailToken) return res.status(404).json("Email token not found...");

        //verifying the user exist
        const user = await User.findOne({emailToken});
        if(user) {
            user.emailToken = null;
            user.email_verified = true
            await user.save();

            const token = createToken(user._id)
            res.status(200).json({
                _id:user._id,
                name:user.name,
                email:user.email,
                token,
                email_verified:user?.email_verified
            });
        } else res.status(404).json("Email verification failed, Invalid token!");
    } catch (error) {
        res.status(500).json({msg:'something went wrong'});
        
    }
}

//resend email verification link
const resendEmail = async(req,res) => {
    try {
        const isExist = await User.findOne({email:req.params.id});
            if(!isExist){
                return res.status(404).json({msg:`A account with this email doesn't exist`})
            }
            //getting action
            const action = req.query.action;
            await generateEmailLink(isExist,action);
            return res.json({msg:`A link to verify your account has been sent to ${isExist.email}`,user:isExist.email});
    } catch (error) {
        return res.status(500).json({msg : 'Something went wrong try again...'})
    }
}



async function generateEmailLink({_id,email}, action) {
    try {
        //genererating confirmation token
        const token = uuid.v4();

        //updating the token in user database
        await authServices.emailGenerate(email, token);


        //configuring email with nodemailer transporter
        const smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, //use SSL
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.PASSWORD
            }
        };
        const transporter = nodemailer.createTransport(smtpConfig);
        const confirmationLink = action==='signup' ? `${process.env.DOMAIN}/user/confirm?id=${_id}`
        : `${process.env.DOMAIN}/user/reset?token=${token}&id=${_id}`

        const mailOptions = {
            to:email,
            subject:'Confirm your email address',
            text:`Click on this link to confirm your email address : ${confirmationLink}`
        }

        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
               console.log(error);
            }
            
             
        })
    } catch (error) {
        return error;
    }
}



module.exports = {
    userSignUp,
    userLogin,
    verifyEmail,
    verifyToken,
    resendEmail,
    getUserProfile
}