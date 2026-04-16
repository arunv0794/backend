import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {        
        if(!localFilePath) return null; // Return null if no file path is provided
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Optional: specify a folder in Cloudinary
        });
        // File uploaded successfully. Remove the file from the local server
        console.log("Image uploaded to Cloudinary:", response.secure_url);
        return response; // Return the URL of the uploaded image
    
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the file from the local server after uploading
        return null; // Rethrow the error to be handled by the caller
    }   
};
