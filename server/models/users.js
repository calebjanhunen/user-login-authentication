import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            minlength: 4,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
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

const User = mongoose.model("UserDataTest", userSchema);

export default User;
