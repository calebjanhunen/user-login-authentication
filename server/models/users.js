import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { REFRESH_TOKEN_EXPIRE_LENGTH } from "../config/constants.js";

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
        refreshToken: [String],
    },
    {
        collection: "user-data-test",
    }
);

userSchema.methods.generateRefreshToken = async function () {
    const user = this;

    const refreshToken = jwt.sign(
        { _id: user._id.toString() },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRE_LENGTH }
    );

    user.refreshToken = [...user.refreshToken, refreshToken];
    await user.save();

    return refreshToken;
};

//hash plain text password before saving
userSchema.pre("save", async function (next) {
    const user = this;
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

const User = mongoose.model("UserDataTest", userSchema);

export default User;
