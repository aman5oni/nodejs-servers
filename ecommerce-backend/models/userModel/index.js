import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";
import crypto from "crypto"
import {JWT_PRIVATE_KEY,JWT_EXPIRES,RESET_PASSWORD_EXPIRE} from "../../config/appConfig"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name Cannot Exceed 30 Charecters"],
    minLength: [4, "Name Should Have More Than 4 Charecters"]
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: [true, "Email Already Exists"],
    validate: [validator.isEmail, "Please Enter A Correct Email"]
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password Should Be Greater Then 8 Charecters"],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

userSchema.pre("save", async function(next){
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function(){
    return jwt.sign({
        id:this._id
    },JWT_PRIVATE_KEY,
    {
        expiresIn:JWT_EXPIRES
    })
}

userSchema.methods.comparePassword = function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + RESET_PASSWORD_EXPIRE * 60 * 1000

    return resetToken
}

const User = mongoose.model("User", userSchema);

export { User };
