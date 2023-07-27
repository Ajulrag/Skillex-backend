const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserNotFound = require('../../utils/errors/userNotFound.js')
const UnAuthorizedException = require('../../utils/errors/UnAutherized.js');
const BadRequest = require('../../utils/errors/badRequest.js');
const { findUserByEmail,createNewUser,findUserWithPass,findUserForToken,findUserWithEmail } = require('../../repositories/user/auth.repository.js')

const userSignUp = async(user) => {
    const isExist = await findUserByEmail(user.email);
    if (isExist) throw new BadRequest('Email already exists');
    const hashPassword = bcrypt.hashSync(user.password, 10);
    const res = await createNewUser({ ...user,  password: hashPassword })
    return res
}

const userLogin = async({ email, password }) => {
    const user = await findUserWithPass(email);
    console.log(user);
    if(!user) throw new UserNotFound();
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new UnAuthorizedException('Invalid emailor password');
    //generating jwt token and passing payload
    const token = jwt.sign({user:isMatch.email},process.env.JWT_SECRET,{expiresIn:"24hr"})
    return res.status(200).json(success('OK',{token:token},res.statusCode))
}

const emailGenerate = async(email,token) => {
    const response = await findUserForToken(email,token)
    return response
}
const verifyUserByEmail = async (user, token) => {
    const response = await findUserWithEmail(user);
    if (!response) throw new UserNotFound();

    //verifying the token
    if (response.confirmationToken === token) {
        response.email_verified = true;
        response.confirmationToken = null;
       const res = await response.save(); // Save the updated user in the database
        return res
    } else if (response.email_verified === true) {
        return { msg: 'Email has been already verified.' };
    } else {
        return { msg: 'Confirmation link is not valid...' };
    }
};

module.exports = {
    userSignUp,
    userLogin,
    emailGenerate,
    verifyUserByEmail
}