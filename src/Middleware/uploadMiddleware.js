const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const fs = require("fs");

const path = require("path");
const config = require("../config/config");
const CreateUploadsFile = require("../utility/mikDirectory.uploadhelper");

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});
const uploadDir = path.join(__dirname, "..", "uploads");
console.log(uploadDir);
//File Upload directory
const imageUploadDirectory = `${uploadDir}/image`;
const fileUploadDirectory = `${uploadDir}/file`;

// Create Upload directory if not exist.
const directory = [imageUploadDirectory, fileUploadDirectory];
// create upload file function
CreateUploadsFile(directory);

// File Upload storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, imageUploadDirectory);
    }
    if (file.fieldname === "files") {
      cb(null, fileUploadDirectory);
    }
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExtension, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now() +
      fileExtension;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (file.fieldname === "images" || file.fieldname === "image") {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error("Please upload an image"));
      }
    }
    if (file.fieldname === "files" || file.fieldname === "file") {
      if (!file.originalname.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/)) {
        return cb(new Error("Please upload a file"));
      }
    }
    cb(null, true);
  },
});

//  if needed upload cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      fs.unlinkSync(file.path);
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const FileUploadHelper = {
  uploadToCloudinary,
  upload,
};

module.exports = FileUploadHelper;
