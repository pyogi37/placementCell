const express = require("express");
const app = express();
const port = 8000;
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const db = require("./config/mongoose");
const env = require("./config/environment");

// used for session cookie and authentication
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
// const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

// const sassMiddleware = require("node-sass-middleware");

// app.use(
//   sassMiddleware({
//     src: "/assets/scss",
//     dest: "assets/css",
//     debug: true,
//     outputStyle: "extended",
//     prefix: "/css",
//   })
// );

app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static("./assets"));

// bootstrap css and js
app.use(
  "css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// extract style and scripts from sub pages into layout
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// mongo store is used to store session key in db
app.use(
  session({
    name: "placementCell",
    secret: env.session_cookie_key,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: `mongodb://0.0.0.0:27017/${env.db}`,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup okay");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }

  console.log(`Server is running on port: ${port}`);
});
