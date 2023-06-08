const Result = require("../models/result");
const Student = require("../models/student");
const Interview = require("../models/interview");
const { Parser } = require("json2csv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");

module.exports.getForm = async function (req, res) {
  try {
    const student = await Student.findById(req.params.studentId);
    const interview = await Interview.findById(req.params.interviewId);
    return res.render("result_form", {
      title: "Results",
      student,
      interview,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "oops something went wrong!");
    return res.redirect("back");
  }
};

module.exports.submitForm = async function (req, res) {
  try {
    const updatedResult = await Result.findOneAndUpdate(
      { student: req.params.studentId, interview: req.params.interviewId },
      { result: req.body.result },
      { new: true }
    );
    if (updatedResult) {
      return res.redirect("back");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "oops something went wrong!");
    return res.redirect("back");
  }

  try {
    const result = await Result.create({
      interview: req.params.interviewId,
      student: req.params.studentId,
      result: req.body.result,
    });
    req.flash("success", "Result Updated!");

    return res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "oops something went wrong!");
    return res.redirect("back");
  }
};

module.exports.getAllResults = async function (req, res) {
  Result.find()
    .populate("student", "name") // Assuming 'name' is a field in the 'student' schema
    .populate("interview", "companyName") // Assuming 'title' is a field in the 'interview' schema
    .then((populatedResults) => {
      // Send the populated results in the response
      //   res.status(200).json(populatedResults);

      res.render("results", {
        title: "Results",
        results: populatedResults,
      });
    })
    .catch((error) => {
      if (error) {
        // Handle the error
        console.error(error);
        // Send an appropriate response
        return;
      }
    });
};

module.exports.downloadCSV = async function (req, res) {
  Result.find()
    .populate("student", ["name", "college", "status", "dsa", "react", "webd"])
    .populate("interview", ["date", "company"])
    .then((populatedResults) => {
      // Convert populated results to CSV format
      const csvWriter = createCsvWriter({
        path: "results.csv",
        header: [
          { id: "studentId", title: "Student ID" },
          { id: "studentName", title: "Student Name" },
          { id: "studentCollege", title: "Student College" },
          { id: "studentStatus", title: "Student Status" },
          { id: "dsaFinalScore", title: "DSA Final Score" },
          { id: "webDFinalScore", title: "WebD Final Score" },
          { id: "reactFinalScore", title: "React Final Score" },
          { id: "interviewDate", title: "Interview Date" },
          { id: "interviewCompany", title: "Interview Company" },
          { id: "interviewResult", title: "Interview Result" },
        ],
      });

      const csvData = populatedResults.map((result) => ({
        studentId: result.student._id,
        studentName: result.student.name,
        studentCollege: result.student.college,
        studentStatus: result.student.status,
        dsaFinalScore: result.student.dsa,
        webDFinalScore: result.student.webd,
        reactFinalScore: result.student.react,
        interviewDate: result.interview.date,
        interviewCompany: result.interview.company,
        interviewResult: result.result,
      }));

      csvWriter
        .writeRecords(csvData)
        .then(() => {
          console.log("CSV file has been created successfully.");
          // Send the CSV file as a response if needed
          res.sendFile(path.join(__dirname, "..", "results.csv"));
        })
        .catch((err) => {
          console.error(err);
          res.flash("error", "Can't download file!");
          return res.redirect("back");
        });
    })
    .catch((err) => {
      console.error(err);
      res.flash("error", "oops, something went wrong!");
      return res.redirect("back");
    });
};
