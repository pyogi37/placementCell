const express = require("express");
const router = express.Router();
const InterviewsController = require("../controllers/interview_controller");
const passport = require("passport");

router.get("/add", passport.checkAuthentication, InterviewsController.getForm);
router.post(
  "/add",
  passport.checkAuthentication,
  InterviewsController.submitForm
);

router.get(
  "/all",
  passport.checkAuthentication,
  InterviewsController.getInterviews
);

router.get(
  "/edit/:id",
  passport.checkAuthentication,
  InterviewsController.editInterview
);

router.post(
  "/edit/:id",
  passport.checkAuthentication,
  InterviewsController.submitEditInterview
);

module.exports = router;
