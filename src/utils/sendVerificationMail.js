const { createMailTransporter } = require("./createMailTransporter");

const sendVerificationMail = (user, action) => {
  const transporter = createMailTransporter();
  const confirmationLink =
    action === "register"
      ? `${process.env.REACT}/verify-email/${user.emailToken}`
      : `${process.env.REACT}/reset/${user.emailToken}`;
  const mailOptions = {
    from: `"Skillex" <www.2323@gmail.com>`,
    to: user.email,
    subject: "Verify your email...",
    html: `
    <div style="background-color: #f7f7f7; padding: 20px; text-align: center;">
      <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Bx8RoTER--/c_imagga_scale,f_auto,fl_progressive,h_1080,q_auto,w_1080/https://faruknasir.com/images/blog/2021/verification_url.png" alt="E-Learning Banner" style="max-width: 50%; height: auto;">
      <h1 style="color: #333;">Welcome to Skillex E-Learning!</h1>
      <p style="font-size: 18px; color: #555;">Hello ${user.name},</p>
      <p style="font-size: 18px; color: #555;">Thank you for choosing Skillex for your learning journey. We're excited to have you on board!</p>
      <p style="font-size: 18px; color: #555;">Please verify your email address by clicking the button below:</p>
      <a href="${confirmationLink}" style="display: inline-block; background-color: #007bff; color: #fff; padding: 10px 20px; font-size: 18px; text-decoration: none; border-radius: 5px; margin-top: 20px;">Verify Your Email</a>
      <p style="font-size: 16px; color: #888; margin-top: 20px;">If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@skillex.com" style="color: #007bff; text-decoration: none;">support@skillex.com</a>.</p>
      <p style="font-size: 16px; color: #888;">Happy learning!</p>
    </div>
  `,
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
