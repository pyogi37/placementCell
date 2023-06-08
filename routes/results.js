const express = require("express");
const router = express.Router();
const ResultsController = require("../controllers/results_controller");
const passport = require("passport");

router.get(
  "/:interviewId/:studentId",
  passport.checkAuthentication,
  ResultsController.getForm
);

router.post(
  "/:interviewId/:studentId",
  passport.checkAuthentication,
  ResultsController.submitForm
);

router.get(
  "/get-all-results",
  passport.checkAuthentication,
  ResultsController.getAllResults
);

router.get(
  "/download",
  passport.checkAuthentication,
  ResultsController.downloadCSV
);

module.exports = router;
