const express = require("express");

const router = express.Router();
const homeController = require("../controllers/home_controller");
const passport = require("passport");

console.log("Router loaded");

router.get("/", passport.checkAuthentication, homeController.home);

router.use("/users", require("./users"));
router.use("/students", require("./students"));
router.use("/interviews", require("./interviews"));
router.use("/results", require("./results"));

module.exports = router;
