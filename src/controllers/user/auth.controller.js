const authServices = require('../../services/user/auth.services.js');
const  BadRequest  = require('../../utils/errors/badRequest.js');
const { catchAsync } = require("../../utils/errors/catchAsync.js");
const schema = require('../../utils/validations/auth.schema.js')
const { success } = require('../../utils/responseApi.js')
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const User = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


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
            return res.status(409).json({msg:'Email already exist'});
        }

        //becrypting the password
        const hash = await bcrypt.hash(password,10);

        //creating the user
        const user = await new User({
            name:name,
            email:email,
            password:password
        }).save();

        //generating the confirmation link
        await generateEmailLink(user,'signup');
        return res.status(201).json({msg:`A link to verify your account has been sent to ${email}`,user:email});
    } catch (error) {
        res.status(500).json({msg:'something went wrong'});
    }
});

const userLogin = catchAsync(async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } =req.body;
        // checking whether the user exist
        const isExist = await User.findOne({email:email})
        console.log(isExist,'ddfdf');
        if(!isExist){
            return res.status(401).json({msg:"Email doesn't exist, Please try again..."})
        }
        const checkPassword = await bcrypt.compare(password,isExist.password);
        if(!checkPassword){
            return res.status(401).json({msg:"Invalid Credentials, Please try again..."})
        }
        // checking whether user email is verified
        if(!isExist.email_verified){
            return res.status(403).json({msg:'Please verify your email before login'})
        }
        //checking the user status
        if(isExist.status){
            return res.status(401).json(error("Your account has been blocked."));
        }
        //setting up the user status
        let role;
        if(isExist.isInstructor === true) {
            role = 'instructor'
        } else {
            role = 'user'
        }
        // generating jwt token
        const token = jwt.sign({user:isExist.email,role:role},process.env.JWT_SECRET,{expiresIn:"24hr"})
        return res.status(200).json(success('OK',{token:token},res.statusCode))
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Something went wrong, Please try after sometimes'})
    }
    
})

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
const verifyEmail = catchAsync(async (req,res) => {
    try {
        //getting the token and user
        const {token,user} = req.body;

        //verifying the user exist
        const isExist = await User.findById(user);
        if(!isExist) {
            return res.status(404).json({msg:'User not found, Please try again...'})
        }
        //verifying the token
        if(isExist.confirmationToken = token){
            isExist.email_verified = true;
            isExist.confirmationToken = null;
            await isExist.save();
            return  res.status(200).json({msg:'Email verified successfully',user:isExist.first_name})
        }else if(isExist.email_verified===true){
            return res.status(409).json({msg:'Email has been already verified.'})
        }else{
            return res.status(400).json({msg:'Confirmation link is not valid...'})
        }
        
    } catch (error) {
        res.status(500).json({msg:'something went wrong'});
        
    }
})

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
        const confirmationLink = action==='signup' ? `${process.env.DOMAIN}/user/confirm?token=${token}&id=${_id}`
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
    resendEmail
}