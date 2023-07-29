const { createMailTransporter } = require('./createMailTransporter');

const sendVerificationMail = (user) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: `"Skillex" <www.2323@gmail.com>`,
    to: user.email,
    subject: "Verify your email...",
    html: `<p> Hello ${user.name}, verify your email by clicking the link...</p>
        <a href='${process.env.REACT}/verify-email/${user.emailToken}'>Verify your Email</a>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Verification mail sent");
    }
  });
};

module.exports = { sendVerificationMail };
