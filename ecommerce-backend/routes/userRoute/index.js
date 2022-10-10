import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUser,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateProfile,
  updateUser
} from "../../controller/userController";
import {
  authorizeRoles,
  isAuthenticatedUser
} from "../../middleware/authentication";

const userRoute = express.Router();

userRoute.route("/register").post(registerUser);
userRoute.route("/login").post(loginUser);
userRoute.route("/logout").get(logoutUser);
userRoute.route("/password/forgot").post(forgotPassword);
userRoute.route("/password/reset/:token").put(resetPassword);
userRoute.route("/user/details").get(isAuthenticatedUser, getUserDetails);
userRoute.route("/password/update").put(isAuthenticatedUser, updatePassword);
userRoute.route("/user/updateprofile").put(isAuthenticatedUser, updateProfile);
userRoute
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
userRoute
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

  
export default userRoute;
