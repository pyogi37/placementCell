const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const env = require("../config/environment");

const User = require("../models/user");

// tell passport to use a new strategy for google login
passport.use(
  new googleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: env.google_call_back_url,
    },
    async function (accessToken, refreshToken, profile, done) {
      // find a user
      try {
        const user = await User.findOne({
          email: profile.emails[0].value,
        }).exec();

        console.log(profile);

        if (user) {
          // If user found, set it as req.user
          return done(null, user);
        } else {
          // If not found, create the user and set it as req.user
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });

          return done(null, newUser);
        }
      } catch (err) {
        console.log("Error in Google strategy passport", err);
        return;
        // Handle the error appropriately (e.g., return an error response)
      }
    }
  )
);

module.exports = passport;
