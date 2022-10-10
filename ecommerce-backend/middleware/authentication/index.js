import ErrorHandler from "../../utils/errorHandler";
import asyncErrorHandler from "../catchAsyncErrors";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../../config/appConfig";
import { User } from "../../models/userModel";

const isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { user } = req.cookies;

  if (!user) {
    return next(new ErrorHandler("Please Login To Access This Resource", 401));
  }

  const decodedData = jwt.verify(user, JWT_PRIVATE_KEY);
  req.user = await User.findById(decodedData.id);
  next();
  
});

const authorizeRoles = (...roles) => {
    
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} Is Not Allowed To Access This Resource`,
          403
        )
      );
    }
    next();
  };
};

export { isAuthenticatedUser, authorizeRoles };
