import ErrorHandler from "../../utils/errorHandler";
import asyncErrorHandler from "../../middleware/catchAsyncErrors";
import { User } from "../../models/userModel";
import { sendToken } from "../../utils/jwtToken";
import { sendEmail } from "../../utils/sendMail";
import crypto from "crypto";
// Create User

const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample id",
      url: "sample profile url"
    }
  });

  sendToken(user, 201, "User Register SucessFully", res);
});

// Login User

const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }

  sendToken(user, 200, "User Login SucessFully", res);
});

// LogOut User

const logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie("user", null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: "Log Out Sucessfully"
  });
});

// Forgot Password

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordURL = `http://${req.get(
    "host"
  )}/password/reset/${resetToken}`;

  const Message = `Your Password Reset Token is \n \n ${resetPasswordURL} \n\n If You Are Not Requested This Email Please Ignore It`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      Message
    });
    res.status(200).json({
      success: true,
      message: `Email Sent To ${user.email} Sucessfully`
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password Link

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token Has Been Invalid Or Has Been Expired",
        400
      )
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password Does'nt Matched", 400));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password Reset Sucesfully", res);
});

//Get User Details

const getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    statuscode: 200,
    user,
    message: "Details Fetched Sucessfully"
  });
});

// Change Password

const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password Is Incorrect", 401));
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler("Password Does'nt Matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, "Password Updated", res);
});

// Update User Profile

const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    statuscode: 200,
    user,
    message: "Profile Updated SucessFully"
  });
});

// Get All Users

const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    statusCode: 200,
    users,
    message: "Users Fetched Sucessfully"
  });
});

//Get Single User

const getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new ErrorHandler(`User Does'nt Exists With Id ${req.params.id}`, 400));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    user,
    message: "User Fetched"
  });
});

// Update User Role

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
    statuscode: 200,
    user,
    message: "Role Updated SucessFully"
  });
});

// Delete User

const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User Does'nt Exists With Id ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    statuscode: 200,
    message: "User Removed SucessFully"
  });
});


export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getUserDetails,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};
