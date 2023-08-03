const Tag = require("../models/Tags");

exports.Tag = async (req, res) => {
  try {
    const { name, description } = req.body;

    //validate the data
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    //create entry in database
    const TagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(TagDetails);

    return res.status(200).json({
      success: true,
      message: "Tag created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all tags
exports.showAllTags= async (req,res) =>{
    try{
        const allTags = await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            allTags
          });

    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
          });
    }
}
