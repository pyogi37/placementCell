const Interview = require("../models/interview");

module.exports.getForm = function (req, res) {
  res.render("add_interviews", {
    title: "Add Interview",
  });
};

module.exports.submitForm = async function (req, res) {
  try {
    const interview = await Interview.create(req.body);
    console.log(interview);
    res.flash("success", "Interview added!");
    return res.redirect("/");
  } catch (error) {
    // res.flash("error", "Can't submit form!");
    return res.redirect("back");
  }
};

module.exports.getInterviews = async function (req, res) {
  try {
    const interviews = await Interview.find();

    Interview.find({ _id: { $in: interviews } })
      .populate("students")
      .exec()
      .then((populatedInterviews) => {
        return res.render("interviews", {
          title: "Interviews",
          interviews: populatedInterviews,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    res.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
};

module.exports.editInterview = async function (req, res) {
  try {
    const interview = await Interview.findById(req.params.id);

    return res.render("interview_edit_form", {
      title: "Edit Interview",
      interview,
    });
  } catch (error) {
    console.error(error);
    res.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
};

module.exports.submitEditInterview = async function (req, res) {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, {
      companyName: req.body.companyName,
      date: req.body.date,
    });
    res.flash("success", "Interview edited!");
    return res.redirect("/interviews/all");
  } catch (error) {
    console.error(error);
    res.flash("error", "Oops, something went wrong!");
    return res.redirect("back");
  }
};
