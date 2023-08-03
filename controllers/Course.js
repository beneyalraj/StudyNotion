const Course = require("../models/Course")
const Tag = require("../models/Tags")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/ImageUploader");

exports.createCourse = async (req,res) =>{

    try{
    //fetch data from user body
    const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;


    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
        return res.status(400).json({
            success:false,
            message:"All fields are required"
        });
    }

    //check for instructor
    const userid = req.user.id;
    const instructorDetails = await User.findById(userid);
    console.log("instructorDetails:", instructorDetails);

    if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message:"instructor details not found",
        });
    }

    //check if given tag is valid
    const tagDetails = await Tag.findById(tag);
    if(!tagDetails){
        return res.status(404).json({
            success:false,
            message:"Given tag is not valid",
        });
    }

    //upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

    //create an entry for the course
    const newCourse = await Course.create({
        courseName,
        courseDescription,
        Instructor:instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag:tagDetails._id,
        thumbnail:thumbnailImage.secure_url,
    });
    //add new course to user schema of the instructor
    await User.findByIdAndUpdate(
        {id:instructorDetails._id},
        {
            $push:{
                courses: newCourse._id
            }
        },
        {next:true},
    )

    return res.status(200).json({
        success:false,
        message:"Course created successfully",
        data:newCourse,
    });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot create a course",
            error:error.message,
        });
    }


}


//getAllCourses handler

exports.showAllCourses = async (req,res) =>{
    try{
        const allCourses = await Course.find({});

        return res.status(200).json({
            success:false,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course details",
            error:error.message,
        });
    }
}