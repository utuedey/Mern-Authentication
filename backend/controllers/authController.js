const bcrypt = require('bcryptjs');
const { generateVerificationToken }  = require('../utils/generateVerificationCode');
const User = require('../models/User');
const crypto = require('crypto');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
const { 
     sendVerificationEmail,
     sendWelcomeEmail,
     sendPasswordResetEmail,
     sendResetSuccessEmail } = require('../mailtrap/emails');

exports.Signup = async (req, res) => {

    const { email, password, username } = req.body;

    try {
        if (!email || !password || !username) {
            throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(400).json({
                sucess: false,
                message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();
        const newUser = new User(
        { 
            email,
            password: hashedPassword,
            username,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24hours
        });

        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id);

        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            status: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined,
            },
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }

}

exports.VerifyEmail = async (req, res) => {

    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save()

        await sendWelcomeEmail(user.email, user.username);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("error in verifyEmail", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

exports.Login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                message: "Password Incorrect"
            })
        }

        generateTokenAndSetCookie(res, user._id)

        user.lastlogin = new Date();
        await user.save();

        res.status(200).json(
            {
                success: true,
                message: "User logged in successfully",
                user: {
                    ...user._doc,
                    password: undefined
                }
            }
        );

    } catch (error) {
        console.log("error during Login", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

exports.Logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out sucessfully"
    })
}

exports.ForgetPassword = async (req, res) => {

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json(
            {
                success: true,
                message: "Password reset link sent to your email",
            }
        );

    } catch (error) {
        console.log("error in forgetPassword", error)
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

exports.ResetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        const user = await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now()},
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        // update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });

    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        })
        
   } catch (error) {
    console.log("Error in checkAuth", error);
    res.status(400).json({
        success: false,
        message: error.message
    });

   }
}