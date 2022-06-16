import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    type: 'login',
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendOptInMail(email, token) {
  console.log(process.env.BASE_URL_FRONTEND);
  let activationLink = `${process.env.BASE_URL_FRONTEND}confirmation/${token}`;
  let mail = {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: "Please active your account",
    text: `To activate your account, please click this link: ${activationLink}`,
    html: `<p>To activate your account, please click this link: <a href="${activationLink}">${activationLink}</a></p>`,
  };
  await transporter.sendMail(mail);
};

async function sendResetPasswordEmail(email, token) {
  let activationLink = `${process.env.BASE_URL}reset/${token}`;
  let mail = {
    from: process.env.SENDER_MAIL,
    to: email,
    subject: "Reset password",
    text: `You requested password reset, if it was you, please click this link: ${activationLink}`,
    html: `<p>You requested password reset, if it was you, please click this link: <a href="${activationLink}">${activationLink}</a></p>`,
  };
  await transporter.sendMail(mail);
};

export default { sendOptInMail, sendResetPasswordEmail };
