import { generateToken } from "../lib/utils.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { cloudinary } from "../lib/cloudinary.js";

// ==========================================
// 1. SIGNUP CONTROLLER
// ==========================================
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res
        .status(400)
        .json({ success: false, msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExist = await userModel.findOne({ email: normalizedEmail });

    if (userExist) {
      return res.status(409).json({
        success: false,
        msg: "An account with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: hashPassword,
      bio: bio.trim(),
    });

    // Use shared token utility helper
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      msg: "Account created successfully",
      token,
      userData: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    console.error("Signup Controller Error:", error);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// ==========================================
// 2. LOGIN CONTROLLER
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide email and password" });
    }

    // Normalize input to prevent case duplication issues
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel
      .findOne({ email: normalizedEmail })
      .select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid Email or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid Email or Password" });
    }

    // ✅ CLEANUP FIX: Replaced the crashing jwt.sign code with your utility helper!
    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      msg: `Welcome back, ${user.fullName}!`,
      token,
      userData,
    });
  } catch (error) {
    console.error("Backend Login Controller Error:", error.message);
    return res
      .status(500)
      .json({ success: false, msg: "Internal Server Error" });
  }
};

// ==========================================
// 3. CHECK AUTH CONTROLLER
// ==========================================
export const checkAuth = (req, res) => {
  return res.json({ success: true, user: req.user });
};

// ==========================================
// 4. UPDATE PROFILE CONTROLLER
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (bio) updateData.bio = bio.trim();

    if (profilePic) {
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "chat_app_avatars",
      });
      updateData.profilePic = upload.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No valid changes provided to update.",
      });
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      msg: "Profile updated successfully!",
    });
  } catch (error) {
    console.error("❌ updateProfile Controller Error Details:", error);
    return res
      .status(500)
      .json({ success: false, msg: error.message || "Internal Server Error" });
  }
};
