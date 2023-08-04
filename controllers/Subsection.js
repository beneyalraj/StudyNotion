const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/ImageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //fetch data from req body
    const { sectionId, title, timeDuration, description } = req.body;
    //extract video files
    const video = req.files.videoFile;
    //validate
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }
    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //create the sub section
    const subSectionDetails = await SubSection.create(SubSection, {
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoURL: uploadDetails.secure_url,
    });
    //update the section
    const updatedDetails = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subsection: subSectionDetails._id,
        },
      },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "subsection created successfully",
      updatedDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating a subsection",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    //fetch data
    const { subSectionName, subSectionId } = req.body;

    //validate the data
    if (!subSectionId || !subSectionName) {
      return res.status(400).json({
        success: false,
        message: "fields cannot be empty",
      });
    }
    //update the data
    const subSection = await SubSection.findByIdAndUpdate(
      subSectionId,
      { subSectionName },
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

exports.deleteSubSection = async (req, res) => {
  try {
    //fetch the data
    const { subSectionId } = req.body;

    //validate
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: "fields cannot be empty",
      });
    }

    //find and delete the id
    await SubSection.findByIdAndDelete(subSectionId);

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
