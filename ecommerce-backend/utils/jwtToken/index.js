import {COOKIE_EXPIRE} from "../../config/appConfig"

const sendToken = (user,statusCode,message,res) => {
    const token = user.getJWTToken();

    // Options for Cookie
    const options = {
        httpOnly:true,
        expires:new Date(
            Date.now() + COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        )
    }

    res.status(statusCode).cookie("user",token,options).json({
        success:true,
        user,
        token,
        message
    })

}

export { sendToken }