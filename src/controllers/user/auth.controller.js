const BadRequest = require("../../utils/errors/badRequest.js");
const { catchAsync } = require("../../utils/errors/catchAsync.js");
const schema = require("../../utils/validations/auth.schema.js");
const { success } = require("../../utils/responseApi.js");
const nodemailer = require("nodemailer");
const uuid = require("uuid");
const User = require("../../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationMail } = require("../../utils/sendVerificationMail.js");
const { token } = require("morgan");

const createToken = (_id) => {
  const jwtSecretKey = process.env.JWT_SECRET;
  return jwt.sign({ _id }, jwtSecretKey, { expiresIn: "3d" });
};

const userSignUp = catchAsync(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { error, value } = schema.signupSchema.validate({
      name,
      email,
      password,
    });

    if (error) throw new BadRequest(error.message);
    //checking whether the email exist
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.json({ msg: "Email already exist" }).status(409);
    }

    //becrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //creating the user
    const user = await new User({
      name: name,
      email: email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    }).save();

    sendVerificationMail(user, "register");

    const token = createToken(user._id);

    return res
      .status(201)
      .json({ msg: `A link to verify your account has been sent to ${email}` });
  } catch (error) {
    console.log(error);
    res.json({ msg: "something went wrong" }).status(500);
  }
});

const userLogin = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    // checking whether the user exist
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res
        .json({ msg: "Email doesn't exist, Please try again..." })
        .status(401);
    }
    const checkPassword = await bcrypt.compare(password, isExist.password);
    if (!checkPassword) {
      return res
        .json({ msg: "Invalid Credentials, Please try again..." })
        .status(401);
    } else if(isExist.status === "Inactive") {
      return res
        .json({ msg: "You are restricted to enter this website!!!"})
        .status(403)
    }
    // checking whether user email is verified
    if (!isExist.email_verified) {
      return res
        .json({ msg: "Please verify your email before login" })
        .status(403);
    }

    //setting up the user status
    let role;
    if (isExist.isInstructor === true) {
      role = "instructor";
    } else {
      role = "user";
    }
    // generating jwt token
    const token = createToken(isExist._id);
    return res
      .json(success("OK", { token: token }, res.statusCode))
      .status(200);
  } catch (error) {
    console.log(error);
    res
      .json({ msg: "Something went wrong, Please try after sometimes" })
      .status(500);
  }
});

const getUserProfile = async (req, res) => {
  const user = await User.findById({ _id: req.user });
  // console.log(user, "njaan aanu user");
  res.status(200).json({ success: true, user });
};

//verifying the token
const verifyToken = async (req, res) => {
  try {
    const decode = jwt.verify(req.body.token, process.env.JWT_SECRET);
    return res
      .status(200)
      .json({ msg: "user authenticated successfully...", user: decode });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ msg: "Invalid authentication token..." });
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    console.log("ethi");
    const { email } = req.body;
    // checking whether user exist with given email
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res
        .status(404)
        .json(error("No user found with the provided email"));
    }
    isExist.emailToken = crypto.randomBytes(64).toString("hex");
   const user = await isExist.save();
    console.log(user,"hifsdghgfsdhigfsdhjkfsdhgfsd");
    //generating the confirmation link
    sendVerificationMail(user, "reset");
    const token = createToken(user._id);

    return res.status(201).json({
      msg: `A link to verify your account has been sent to ${email}`,
      user: email,
    });
  } catch (err) {
    res.status(500).json({ msg: "something went wrong" });
  }
};

const resetPassword = async (req, res) => {
    try {
      const { password, user } = req.body;
      // checking whether user exists
      const isExist = await User.findOne({ _id: user });
      if (!isExist) {
        return res.status(404).json(error("User not found, Try again..."));
      }
      // hashing the new password
      const hash = await bcrypt.hash(password, 10);
      // updating the password
      isExist.password = hash;
      await isExist.save();
      return res.status(200).json(success("OK"));
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "something went wrong" });
    }
  };
  
  
  

//verify email confirmation link
const verifyEmail = async (req, res) => {
  try {
    //getting the token
    const emailToken = req.body.token;
    console.log(emailToken);
    if (!emailToken) return res.status(404).json("Email token not found...");

    //verifying the user exist
    const user = await User.findOne({ emailToken });
    if (user) {
      user.emailToken = null;
      user.email_verified = true;
      await user.save();

      const token = createToken(user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        email_verified: user?.email_verified,
      });
    } else res.status(404).json("Email verification failed, Invalid token!");
  } catch (error) {
    res.status(500).json({ msg: "something went wrong" });
  }
};
// Assuming you've defined your User model and imported it as 'User'
const statusCheck = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId); // Change '_id' to 'userId'
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ msg: "User found", status: user.status });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}

module.exports = {
  userSignUp,
  userLogin,
  verifyEmail,
  verifyToken,
  forgotPassword,
  resetPassword,
  getUserProfile,
  statusCheck
};
