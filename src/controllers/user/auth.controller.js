const uuid = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");
const nodemailer = require("nodemailer");
const User = require("../../models/userModel.js");
const Course = require('../../models/courseModel.js')
const { success } = require("../../utils/responseApi.js");
const BadRequest = require("../../utils/errors/badRequest.js");
const schema = require("../../utils/validations/auth.schema.js");
const { catchAsync } = require("../../utils/errors/catchAsync.js");
const { sendVerificationMail } = require("../../utils/sendVerificationMail.js");

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
    const isExist = await User.findOne({ email: email });
    if (isExist) {
      return res.json({ msg: "Email already exist" }).status(409);
    }

    //becrypting the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name: name,
      email: email,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
    }).save();

    sendVerificationMail(user, "register");

    const token = createToken(user._id);

    return res.status(201).json({ msg: `A link to verify your account has been sent to ${email}` });
  } catch (error) {
    res.json({ msg: "something went wrong" }).status(500);
  }
});

const userLogin = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res.json({ msg: "Email doesn't exist, Please try again..." }).status(401);
    }
    const checkPassword = await bcrypt.compare(password, isExist.password);
    if (!checkPassword) {
      return res.json({ msg: "Invalid Credentials, Please try again..." }).status(401);
    } else if (isExist.status === "Inactive") {
      return res.json({ msg: "You are restricted to enter this website!!!" }).status(403)
    }
    // checking whether user email is verified
    if (!isExist.email_verified) {
      return res.json({ msg: "Please verify your email before login" }).status(403);
    }

    let role;
    if (isExist.isInstructor === true) {
      role = "instructor";
    } else {
      role = "user";
    }
    // generating jwt token
    const token = createToken(isExist._id);
    return res.json(success("OK", { token: token }, res.statusCode)).status(200);
  } catch (error) {
    res.json({ msg: "Something went wrong, Please try after sometimes" }).status(500);
  }
});

const getUserProfile = async (req, res) => {
  const user = await User.findById({ _id: req.user });
  res.status(200).json({ success: true, user });
};

//verifying the token
const verifyToken = async (req, res) => {
  try {
    const decode = jwt.verify(req.body.token, process.env.JWT_SECRET);
    return res.status(200).json({ msg: "user authenticated successfully...", user: decode });
  } catch (err) {
    return res.status(403).json({ msg: "Invalid authentication token..." });
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // checking whether user exist with given email
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return res.status(404).json(error("No user found with the provided email"));
    }
    isExist.emailToken = crypto.randomBytes(64).toString("hex");
    const user = await isExist.save();
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
    res.status(500).json({ msg: "something went wrong" });
  }
};

//verify email confirmation link
const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.token;
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


const statusCheck = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ msg: "User found", status: user.status });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, fieldOfStudy, experienceYears, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.name = name;

    // Check if the user is an instructor before updating these fields
    if (user.isInstructor) {
      user.instructor_details.field_of_study = fieldOfStudy;
      user.instructor_details.experience_years = experienceYears;
    }
    await user.save();

    return res.status(200).json({ msg: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

const fetchSingleCourse = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json(error("Course not found."));
    }

    return res.status(200).json(success("OK", { course }));

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
  statusCheck,
  updateProfile,
  fetchSingleCourse
};
