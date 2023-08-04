const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;
    //validate
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "fields cannot be empty",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    //update course with section
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { courseContent: newSection._id },
      },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cannot create a section",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, sectionId } = req.body;

    //validate the data
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "fields cannot be empty",
      });
    }
    //update the data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //return respose

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cannot update the section",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    //fetch the data
    const { sectionId } = req.body;

    //validate
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "fields cannot be empty",
      });
    }

    //find and delete the id
    await Section.findByIdAndDelete(sectionId);

    //delete the data
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Somethings went wrong while trying to delete the section",
      error: error.message,
    });
  }
};
