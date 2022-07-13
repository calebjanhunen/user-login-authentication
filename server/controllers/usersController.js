import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    REFRESH_TOKEN_EXPIRE_LENGTH,
    ACCESS_TOKEN_EXPIRE_LENGTH,
} from "../config/constants.js";

export async function registerUser(req, res) {
    const { user, pwd } = req.body;

    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required" });

    try {
        const duplicateUser = await User.findOne({ username: user });
        if (duplicateUser)
            res.status(409).json({ message: "User already exists" }); //conflict

        //encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store user
        const data = await User.create({
            username: user,
            password: hashedPwd,
        });

        res.status(201).json({ success: `New user, ${user}, created` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function loginUser(req, res) {
    const cookies = req.cookies; //if logging in without explicitly logging out before -> this will exist
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required" });

    try {
        const foundUser = await User.findOne({ username: user });
        if (!foundUser) return res.sendStatus(401); //unauthorized

        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            //Create JWTs
            const accessToken = jwt.sign(
                { _id: foundUser._id.toString() },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: ACCESS_TOKEN_EXPIRE_LENGTH }
            );
            const newRefreshToken = jwt.sign(
                { _id: foundUser._id.toString() },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRE_LENGTH }
            );

            //removing old refresh token
            const newRefreshTokenArray = !cookies?.jwt
                ? foundUser.refreshToken
                : foundUser.refreshToken.filter(token => token !== cookies.jwt);

            if (cookies.jwt)
                res.clearCookie("jwt", {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, //1 day
                }); //secure: true -> only serves on https

            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, //1 day
            });

            //saving new refresh token to db
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();

            res.json({ accessToken });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.json({ status: "error", error: err.message });
    }
}

export async function logoutUser(req, res) {
    //On client, also delete the access token

    //Looks for refreshToken Cookie -> if it doesn't exist, user is not logged in
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    try {
        //is refresh token in database?
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) {
            res.clearCookie("jwt", {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, //1 day
            });

            return res.sendStatus(204);
        }

        //Delete refreshtoken in database
        const newRefreshTokenArray = foundUser.refreshToken.filter(
            token => token != refreshToken
        );
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();

        res.clearCookie("jwt", {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
        }); //secure: true -> only serves on https
        res.sendStatus(204);
    } catch (err) {
        res.json({ status: "error", error: err.message });
    }
}

export async function handleRefreshToken(req, res) {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //delete refresh token cookie
    res.clearCookie("jwt", {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, //1 day
    }); //secure: true -> only serves on https

    try {
        const foundUser = await User.findOne({ refreshToken });

        //Detected refresh token reuse (user not found -> logged out, but refresh token still being used)
        if (!foundUser) {
            res.sendStatus(403); //forbidden

            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, data) => {
                    if (err) return res.sendStatus(403); // token is expired

                    const hackedUser = await User.findById(data._id);
                    hackedUser.refreshToken = [];
                    const result = await hackedUser.save();
                    console.log(result);
                }
            );
        }

        const newRefreshTokenArray = foundUser.refreshToken.filter(
            token => token != refreshToken
        );

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, data) => {
                //old refresh token
                if (err) {
                    foundUser.refreshToken = [...newRefreshTokenArray];
                    const result = await foundUser.save();
                }

                if (err || foundUser._id.toString() !== data._id)
                    return res.sendStatus(403);

                //refresh token still valid
                const accessToken = jwt.sign(
                    { _id: data._id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRE_LENGTH }
                );
                const newRefreshToken = jwt.sign(
                    { _id: foundUser._id.toString() },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRE_LENGTH }
                );

                foundUser.refreshToken = [
                    ...newRefreshTokenArray,
                    newRefreshToken,
                ];

                res.cookie("jwt", newRefreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, //1 day
                });

                res.json({ accessToken });
            }
        );
    } catch (err) {
        res.json({ message: err.message });
    }
}
