const passport = require("passport");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const jwtSecret = env.jwt_secret;
const resetPasswordMailer = require("../mailers/reset_password_mailer");

//render sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("user_sign_up", {
    title: "Sign up",
  });
};

//render sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  return res.render("user_sign_in", {
    title: "Sign in",
  });
};

// get the sign up data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Password don't match");
    return res.redirect("back");
  }

  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      try {
        let newUser = new User();
        newUser.name = req.body.name;
        newUser.setPassword(req.body.password);
        newUser.email = req.body.email;
        newUser.save();

        req.flash("success", "Sign-up complete!");
        return res.redirect("/users/sign-in");
      } catch (error) {
        req.flash("error", error.message);
        console.log("Error in creating user while signing up", error);
        return res.redirect("back");
      }
    }
    req.flash("error", "User already exists!");
    return res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    console.log("Error in finding user while signing up");
    return res.redirect("back");
  }
};

// sign in and create a session
module.exports.createSession = function (req, res) {
  req.flash("success", "You've now logged in!!");
  return res.redirect("/");
};

//sign out
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out!!");
    res.redirect("back");
  });
};

// get the forgot password form data
module.exports.forgotPwdForm = function (req, res) {
  return res.render("forgot_pwd", { title: "Forgot Password" });
};

// submit forgot password form and send link to email
module.exports.forgotPwdSendLink = async function (req, res) {
  const email = req.body.email;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "User doesn't exist");
      return res.redirect("back");
    }
    let secret = jwtSecret + user.hash;

    const payload = {
      email: user.email,
      id: user.id,
    };
    const token = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:8000/users/reset-pwd/${user._id}/${token}`;

    try {
      resetPasswordMailer.resetPassword(user, link);
    } catch (error) {
      req.flash("error", "Oops, Something went wrong!");
      console.log("Error in finding user", error);
      return res.redirect("back");
    }
    req.flash("success", "Link sent to your email");
  } catch (error) {
    req.flash("error", error.message);
    console.log("Error in finding user", error);
    return res.redirect("back");
  }
  return res.redirect("back");
};

// get reset password form
module.exports.getResetPasswordForm = async function (req, res) {
  const { userid, token } = req.params;
  const user = await User.findById(userid);
  if (!user) {
    req.flash("error", "Your link is tampered, generate again!!");
    return res.redirect("back");
  }

  const secret = jwtSecret + user.hash;

  try {
    const payload = jwt.verify(token, secret);
    if (!payload) {
      return res.send("JWT EXPIRED");
    }
    return res.render("reset_pwd", {
      title: "Reset Password",
      user: user.name,
      userid: user._id,
      token: token,
    });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
};

// reset password
module.exports.resetPassword = async function (req, res) {
  const { password, confirm_password } = req.body;
  const { userid, token } = req.params;

  if (password !== confirm_password) {
    req.flash("error", "Password don't match");
    return res.redirect("back");
  }

  try {
    const user = await User.findById(userid);
    const secret = jwtSecret + user.hash;
    const payload = jwt.verify(token, secret);

    const payloadUser = await User.findById(payload.id);

    if (!payloadUser) {
      req.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    }

    if (user.id !== payloadUser.id) {
      req.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    }
    try {
      user.setPassword(password);
      user.save();
      req.flash("success", "Password has been reset successfully!");
      return res.redirect("/users/sign-in");
    } catch (error) {
      req.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
};

// RESET PASSWORD WHEN USER IS SIGNED IN

module.exports.resetPasswordFormSignedIn = async function (req, res) {
  const user = req.user;

  try {
    return res.render("reset_pwd", {
      title: "Reset Password",
      user: user.name,
      userid: user._id,
    });
  } catch (error) {
    req.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
};

module.exports.resetPasswordSignedIn = async function (req, res) {
  const { password, confirm_password } = req.body;

  if (password !== confirm_password) {
    req.flash("error", "Password don't match");
    return res.redirect("back");
  }

  const user = await User.findById(req.user.id);

  try {
    user.setPassword(password);
    user.save();
    req.flash("success", "Password has been reset successfully!");
  } catch (error) {
    req.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
  return res.redirect("/");
};
