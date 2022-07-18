import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    REFRESH_TOKEN_EXPIRE_LENGTH,
    ACCESS_TOKEN_EXPIRE_LENGTH,
} from "../config/constants.js";
import { createAccessToken } from "../utils/generateTokens.js";

export async function registerUser(req, res) {
    const { user, pwd } = req.body;
    const cookies = req.cookies;

    try {
        const hashedPassword = await bcrypt.hash(pwd, 10);

        //create and store user
        const data = await User.create({
            username: user,
            password: hashedPassword,
        });

        //create JWTs
        const accessToken = createAccessToken(data);
        await data.generateRefreshToken(cookies, res); //save refresh token to user db and create refrsh token cookie

        res.status(201).json({ data, accessToken });
    } catch (err) {
        console.log(err);
        err.code === 11000
            ? res.status(400).json({ error: "User already exists" })
            : res.status(400).json({ error: err.message });
    }
}

export async function loginUser(req, res) {
    const cookies = req.cookies; //if logging in without explicitly logging out before -> this will exist
    // console.log(cookies);
    const { user, pwd } = req.body;
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: "Username and password are required" });

    try {
        const foundUser = await User.findOne({ username: user });
        if (!foundUser)
            return res.status(401).json({ message: "Invalid username" }); //unauthorized

        const validPassword = await bcrypt.compare(pwd, foundUser.password);
        if (!validPassword)
            return res.status(401).json({ message: "Invalid password" });

        //Create JWTs
        const accessToken = createAccessToken(foundUser);
        const refreshToken = await foundUser.generateRefreshToken(cookies, res);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, //1 day
        });

        res.json({ foundUser, accessToken });
    } catch (err) {
        res.json({ status: "error", error: err.message });
    }
}

export async function logoutUser(req, res) {
    //On client, also delete the access token

    //Looks for refreshToken Cookie -> if it doesn't exist, user is not logged in
    const cookies = req.cookies;
    if (!cookies?.refreshToken)
        return res.status(401).json({ message: "User not logged in" }); //No content
    const refreshToken = cookies.refreshToken;

    try {
        //is refresh token in database?
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, //1 day
            });

            return res.sendStatus(204);
        }

        //Delete refreshtoken in database
        const newRefreshTokenArray = foundUser.refreshTokens.filter(
            token => token != refreshToken
        );
        foundUser.refreshTokens = [...newRefreshTokenArray];
        const result = await foundUser.save();

        res.clearCookie("refreshToken", {
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
    console.log(cookies);
    if (!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;

    try {
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser)
            return res.status(401).json({ message: "Not logged in" });

        res.json({ foundUser });
    } catch (err) {
        res.json({ message: err.message });
    }
}
