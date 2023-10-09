const UserModel = require("./user.model");

const createUserInToDB = async (payload) => {
    
    
  
      const user = await UserModel.findOne({ email: email });
      if (user) {
        return next(new ErrorHandler("User already axist!", 404));
      }
  
      // console.log(hashPassword);
      // console.log(req.body.photo);
      const newUser = new ManagementUserModel({
        fullname,
        email,
        department,
        password: hashPassword,
        photo: {
          public_id: req.body.photo.public_id,
          url: req.body.photo.url,
        },
        role,
        phone,
        gender,
        userStatus,
      });
      let userData = await newUser.save();
  
      res.status(201).json({
        success: true,
        userData,
        message: "User Create Successfully!!",
      });
};

const userServices = {
  createUserInToDB,
};

module.exports = userServices;
