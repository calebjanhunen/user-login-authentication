import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import {
    registerUser,
    loginUser,
    logoutUser,
    handleRefreshToken,
} from "./controllers/usersController.js";
import { getData } from "./controllers/dataController.js";
import { verifyJWT } from "./middleware/verifyJWT.js";

const app = express();

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lxuni.mongodb.net/UsersTestDB?retryWrites=true&w=majority`;

//built-in middleware: Cross origin Resource Sharing
app.use(cors());

//build-in middleware: for reading json
app.use(express.json());

//middleware for reading cookies
app.use(cookieParser());

app.post("/register", bodyParser.json(), registerUser);
app.post("/login", bodyParser.json(), loginUser);
app.get("/logout", logoutUser);
app.get("/refresh", handleRefreshToken);

app.get("/data", verifyJWT, getData);

mongoose
    .connect(DB_URL)
    .then(() =>
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        })
    )
    .catch(err => console.log(err));
