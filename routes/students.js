const express = require("express");
const router = express.Router();
const StudentsController = require("../controllers/student_controller");
const passport = require("passport");

router.get("/add", passport.checkAuthentication, StudentsController.getForm);
router.post(
  "/add",
  passport.checkAuthentication,
  StudentsController.submitForm
);

router.get(
  "/all",
  passport.checkAuthentication,
  StudentsController.getStudents
);

router.get(
  "/edit/:id",
  passport.checkAuthentication,
  StudentsController.editStudent
);
router.post(
  "/edit/:id",
  passport.checkAuthentication,
  StudentsController.submitEditStudent
);

router.post(
  "/delete/:id",
  passport.checkAuthentication,
  StudentsController.deleteStudent
);

module.exports = router;
