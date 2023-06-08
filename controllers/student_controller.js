const Student = require("../models/student");
const Interview = require("../models/interview");
const date = new Date();

module.exports.getForm = async function (req, res) {
  //   console.log(date);
  const interviews = await Interview.find()
    .then((interviews) => {
      // Process the retrieved interviews
      console.log("interviews", interviews);
      res.render("add_students", {
        title: "Add Student",
        interviews,
      });
    })
    .catch((error) => {
      // Handle any errors that occurred during the query
      console.error(error);
      res.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    });
};

module.exports.submitForm = async function (req, res) {
  const student = await Student.create(req.body);

  let interviews = student.interviews;
  console.log("interviews", interviews);

  const addStudentToInterviews = async () => {
    try {
      for (const interviewId of interviews) {
        const interview = await Interview.findById(interviewId);

        if (!interview) {
          throw new Error(`Interview with ID ${interviewId} not found`);
        }

        interview.students.push(student);

        await interview.save();
      }

      console.log("Student added to interviews successfully");
    } catch (error) {
      console.error(error);
      res.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    }
  };

  // Call the function to add the student to the interviews
  addStudentToInterviews();

  return res.redirect("back");
};

module.exports.getStudents = async function (req, res) {
  const students = await Student.find()
    .then((students) => {
      console.log("students", students);
      return res.render("students", {
        title: "Students",
        students,
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports.editStudent = async function (req, res) {
  console.log(req.params);

  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      req.flash("error", "Student not found");
    }

    const allInterviews = await Interview.find({
      students: { $elemMatch: { $eq: student } },
    });

    console.log("All interviews associated", allInterviews);

    const interviews = await Interview.find();
    res.render("student_edit_form", {
      title: "Edit Student",
      student,
      interviews,
    });
  } catch (error) {
    req.flash("error", "oops, something went wrong!");
  }
};

module.exports.submitEditStudent = async function (req, res) {
  //   console.log(req.body);
  console.log("Inside submit form controller");

  const student = await Student.findById(req.params.id);

  try {
    const interviews = await Interview.find({
      students: { $elemMatch: { $eq: student } },
    });

    if (interviews.length > 0)
      for (interview of interviews) {
        interview.students.pull(student._id);
        await interview.save();
      }
  } catch (error) {
    console.log(error);
    return;
  }

  await Student.findByIdAndDelete(student.id);

  const newStudent = await Student.create(req.body);
  const newInterviews = newStudent.interviews;

  async function removeStudentFromInterviews(student) {
    try {
      if (interviewids.length > 0)
        for (interview of interviewids) {
          let interview = await Interview.findById(interview);
          interview.students.pull(student._id);
          await interview.save();
        }
    } catch (error) {
      console.log(error);
      return;
    }
  }

  await removeStudentFromInterviews();
  await Student.findByIdAndDelete(student.id);

  const addStudentToInterviews = async () => {
    try {
      for (const interviewId of newInterviews) {
        const interview = await Interview.findById(interviewId);

        if (!interview) {
          throw new Error(`Interview with ID ${interviewId} not found`);
        }

        interview.students.push(newStudent);

        await interview.save();
      }

      console.log("Student added to interviews successfully");
    } catch (error) {
      console.error(error);
      res.flash("error", "Oops, something went wrong!");
      return res.redirect("back");
    }
  };

  // Call the function to add the newStudent to the interviews
  addStudentToInterviews();

  console.log(newStudent);
  req.flash("success", "Student edited successfully!");

  return res.redirect("/students/all");
};

module.exports.deleteStudent = async function (req, res) {
  const student = await Student.findById(req.params.id);

  try {
    const interviews = await Interview.find({
      students: { $elemMatch: { $eq: student } },
    });

    if (interviews.length > 0)
      for (interview of interviews) {
        interview.students.pull(student._id);
        await interview.save();
      }
  } catch (error) {
    console.log(error);
    return;
  }

  await Student.findByIdAndDelete(student.id);

  return res.redirect("/students/all");
};
