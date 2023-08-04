const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get userid
    const id = req.user.id;

    //validate
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //get profile data
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    await profileDetails.save();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    //fetch id
    const id = req.body;
    //validate
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not available",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //delete user
    await User.findByIdAndDelete({ _id: id });
    //return response
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
      profileDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "User cannot be deleted",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    //get id
    const id = req.User.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const UserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      error: "User data obtained successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
