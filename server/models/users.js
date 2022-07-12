import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: String,
    },
    {
        collection: "user-data-test",
    }
);

const User = mongoose.model("UserDataTest", userSchema);

export default User;
