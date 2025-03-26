import sendEmail from '../config/sendEmail.js'
import UserModel from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js'
import multer from 'multer'
import generatedOpt from '../utils/generatedOtp.js'
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js'
import jwt from 'jsonwebtoken'
import generatedaccessToken from '../utils/generatedAccessToken.js'


//registering user
export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Please enter the required fields",
                error: true,
                success: false
            })
        }
        const user = await UserModel.findOne({ email })

        if (user) {
            return response.json({
                message: "Email is already registered",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyemail = await sendEmail({
            sendTo: email,
            subject: "Verification Email",
            html: verifyEmailTemplate({
                name,
                url: VerifyEmailUrl
            })
        })

        return response.json({
            message: "User Registered Successfuly",
            error: false,
            success: true,
            data: save
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verifying user email
export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id: code })

        if (!user) {
            return response.status(400).json({
                message: "Invalid Code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({ _id: code }, {
            verify_email: true
        })

        return response.json({
            message: "Verification email done",
            success: true,
            error: false
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//login controller
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                message: "Enter your Email and Password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User is not registered",
                error: true,
                success: false
            });
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact customer support",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: "Enter your password correctly",
                error: true,
                success: false
            });
        }

        // Generate tokens
        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        // Set cookies for tokens (note that SameSite='None' and Secure=true is recommended in production)
        const cookiesOption = {
            httpOnly: true,  // To prevent access to cookies via JavaScript
            secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
            sameSite: "None", // Allow cookies to be sent with cross-origin requests (important for CORS)
        };

        // Set access and refresh tokens in cookies
        res.cookie('accessToken', accessToken, cookiesOption);
        res.cookie('refreshToken', refreshToken, cookiesOption);

        return res.json({
            message: "You have logged in successfully",
            error: false,
            success: true,
            data: { accessToken, refreshToken },
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//logout controller
export async function logoutController(req, res) {
    try {

        const userid = req.userId
        // Clear the access and refresh tokens from cookies
        const cookiesOption = {
            httpOnly: true,  // To prevent access to cookies via JavaScript
            secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
            sameSite: "None", // Allow cookies to be sent with cross-origin requests (important for CORS)
        };

        res.clearCookie("accessToken", cookiesOption);
        res.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        })

        return res.json({
            message: "Logged out successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

//upload user profile
export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId
        const image = request.file  //multer

        const upload = await uploadImageCloudinary(image)
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })

        return response.json({
            message: "upload profile",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url
            }
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//update user details
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId
        const { name, email, mobile, password } = request.body

        let hashPassword = ""

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        }

        const updateUser = await UserModel.updateOne({ _id: userId }, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword })
        })

        return response.json({
            message: "Updated successfully",
            error: false,
            success: true,
            data: updateUser
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//forgot pass
export async function forgotPasswordController(request, response) {
    try {

        const { email } = request.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User is not available",
                error: true,
                success: false
            })
        }

        const otp = generatedOpt()
        const expireTime = new Date() + 60 * 60 * 1000 //1hr

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password from Khaja",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        })

        return response.json({
            message: "Check your email",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//verify forgotOTP
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body

        if (!email || !otp) {
            return response.status(400).json({
                message: "Enter email and OTP",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "User is not available",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString()
        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false,
            })
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Please enter correct OTP",
                error: true,
                success: false
            })
        }


        ///not expired and ===

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            forgot_password_otp: "",
            forgot_password_expiry: ""
        })

        return response.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//reset pass
export async function resetpassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required fields"
            })
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New Password and Confirm Password must be same.",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword, salt)

        const update = await UserModel.findOneAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password is changed successfully.",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

//refresh token
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_REFRESH_KEY_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken.id

        const newAccessToken = await generatedaccessToken(userId)
        const cookiesOption = {
            httpOnly: true,  // To prevent access to cookies via JavaScript
            secure: process.env.NODE_ENV === "production", // Ensure cookies are sent over HTTPS in production
            sameSite: "None", // Allow cookies to be sent with cross-origin requests (important for CORS)
        }
        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New Access Token Generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

//login user details
export async function userDetails(request, response) {
    try {
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: "User Details",
            data: user,
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false
        })
    }
}

