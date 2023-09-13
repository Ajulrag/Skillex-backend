const nodemailer = require('nodemailer')

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
            port: 465,
            secure: true, 
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.PASSWORD
            }
    })
    return transporter;
}

module.exports = { createMailTransporter }