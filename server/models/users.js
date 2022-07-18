import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    REFRESH_TOKEN_EXPIRE_LENGTH,
    REFRESH_TOKEN_COOKIE_EXPIRE_LENGTH,
} from "../config/constants.js";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            minlength: [4, "Length must be at least 4 characters"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Length must be at least 8 characters"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        refreshTokens: [String],
    },
    {
        collection: "user-data-test",
    }
);

userSchema.methods.generateRefreshToken = async function (cookies, res) {
    const user = this;

    try {
        //if refresh token cookie exists -> clear it
        if (cookies.refreshToken)
            res.clearCookie("refreshToken", {
                httpOnly: true,
                maxAge: REFRESH_TOKEN_COOKIE_EXPIRE_LENGTH,
            }); //secure: true -> only serves on https

        //filter out already existing refresh token
        const refreshTokenArray = cookies.refreshToken
            ? user.refreshTokens.filter(token => token !== cookies.refreshToken)
            : user.refreshTokens;

        const refreshToken = jwt.sign(
            { _id: user._id.toString() },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: REFRESH_TOKEN_EXPIRE_LENGTH }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: REFRESH_TOKEN_COOKIE_EXPIRE_LENGTH,
        });

        user.refreshTokens = [...refreshTokenArray, refreshToken];
        await user.save();

        return refreshToken;
    } catch (err) {
        console.log(err);
        return err;
    }
};

const User = mongoose.model("UserDataTest", userSchema);

export default User;
