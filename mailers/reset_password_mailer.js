const nodemailer = require("../config/nodemailer");

exports.resetPassword = (user, link) => {
  let htmlString = nodemailer.renderTemplate(
    { user, link },
    "/users/reset_pwd.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "me@codeial.com",
      to: user.email,
      subject: "Reset password",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending email", err);
        return;
      }
      console.log("Message sent", info);

      return;
    }
  );
};
