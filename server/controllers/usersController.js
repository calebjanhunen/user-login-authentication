import User from "../models/users.js";
import bcrypt from "bcrypt";

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
            res.json({ success: `User ${user} is logged in` });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.json({ status: "error", error: err.message });
    }
}
