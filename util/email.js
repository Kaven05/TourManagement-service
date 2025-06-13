const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.E_USERNAME,
      pass: process.env.E_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Kavin<kavine05@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
