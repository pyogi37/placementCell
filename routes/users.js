const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

router.post("/create", usersController.create);

router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

router.get("/sign-out", usersController.destroySession);

router.get("/forgot-pwd", usersController.forgotPwdForm);

router.post("/forgot-pwd", usersController.forgotPwdSendLink);

router.get("/reset-pwd/:userid/:token", usersController.getResetPasswordForm);

router.get(
  "/reset-pwd",
  passport.checkAuthentication,
  usersController.resetPasswordFormSignedIn
);

router.post(
  "/reset-pwd",
  passport.checkAuthentication,
  usersController.resetPasswordSignedIn
);

router.post("/reset-pwd/:userid/:token", usersController.resetPassword);

// // third party auths

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
//   usersController.createSession
// );

module.exports = router;
