const nodemailer = require("nodemailer");
const { frontend, smtp } = require("../config.json");

var transport = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  auth: {
    user: smtp.username,
    pass: smtp.password,
  },
});

const generateResetTokenEmail = token => `
  <div className="email" style="
    border: 1px solid black;
    padding 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;"
    >
      <h2>Hello there!</h2>
      <p>Please click on this <a href="${frontend.url}/reset?resetToken=${token}">link</a> to reset your password.</p>
    </div>
`;

exports.transport = transport;
exports.generateResetTokenEmail = generateResetTokenEmail;
