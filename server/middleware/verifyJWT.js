import jwt from "jsonwebtoken";
import User from "../models/users.js";

export async function verifyJWT(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.sendStatus(401); //unauthorized
    const token = authHeader.replace("Bearer", "").trim(); //token

    try {
        const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedData._id);
        if (!user) throw new Error();

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: "Please authenticate" });
    }
}
