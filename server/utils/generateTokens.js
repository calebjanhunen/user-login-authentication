import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_EXPIRE_LENGTH } from "../config/constants.js";

export function createAccessToken(user) {
    return jwt.sign(
        { _id: user._id.toString() },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRE_LENGTH }
    );
}
