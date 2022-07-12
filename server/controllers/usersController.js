import User from "../models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
                { expiresIn: "20s" }
            );
            const refreshToken = jwt.sign(
                { _id: foundUser._id.toString() },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            //Saving refreshToken with current user
            await User.findByIdAndUpdate(foundUser._id, { refreshToken });

            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, //1 day
            });
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
        await User.findByIdAndUpdate(foundUser._id, { refreshToken: "" });

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
    try {
        const foundUser = await User.findOne({ refreshToken });
        if (!foundUser) res.sendStatus(403);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, data) => {
                if (err || foundUser._id.toString() !== data._id)
                    return res.sendStatus(403);

                const accessToken = jwt.sign(
                    { _id: data._id },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "20s" }
                );

                res.json({ accessToken });
            }
        );
    } catch (err) {
        res.json({ message: err.message });
    }
}
