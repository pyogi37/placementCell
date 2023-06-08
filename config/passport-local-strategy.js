const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

//authenticate using passport

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      try {
        const user = await User.findOne({ email: email });
        if (!user || !user.validPassword(password)) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false);
        }

        return done(null, user);
      } catch (error) {
        console.log("Error in finding user -> PASSPORT");
        return done(error);
      }
    }
  )
);

// serialize the user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//deserialiazing the user
passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  if (!user) {
    console.log("Error in finfing User -> Passport");
  }
  return done(null, user);
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is signed in, then pass on the req to the next func
  if (req.isAuthenticated()) {
    return next();
  }

  // if the user is not signed in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // setting user from req in locals
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
