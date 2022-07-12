import jwt from "jsonwebtoken";

export function verifyJWT(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.sendStatus(401);
    console.log(token);

    // const token = authHeader.split[1]; //token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403); //invalid token (forbidden)
        req.userId = decoded._id;
        next();
    });
}
