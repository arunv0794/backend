import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/User.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get user data from request body
    // validation can be added here
    // check if email already exists in the database
    // check for image, check for avatar
    // upload them to cloudinary, get the url and save it in the database
    // create user object and create entry in db
    // remove password and refresh token from the response
    // check for user creation
    // return res
    

    const { fullName, username, email, password } = req.body;
    console.log("email: ", email);
    // Here you would typically add logic to save the user to a database
    // For this example, we'll just return a success message
    if(
        [fullName, username, email, password].some((field) =>
            field?.trim() === "")) 
        {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = UserActivation.findOne
    ({$or: [{ email }, { username }]
    });

        if(existedUser) {
            throw new ApiError(409, "User already exists with this email or username");
        }   
        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar =  await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if (!avatar) {
            throw new ApiError(400, "Avatar file is required");
        }

        const newUser = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            username: username.toLowerCase(),
            email,
            password
        });

        const createdUser = await User.findById(User._id).select("-password -refreshToken"); 

        if(!createdUser) {
            throw new ApiError(500, "User creation failed");
        }

        return res.status(201).json
        (new ApiResponse(true, "User registered successfully", createdUser));

    });


export { registerUser }; 