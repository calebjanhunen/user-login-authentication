import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import { registerUser, loginUser } from "./controllers/usersController.js";

const app = express();

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lxuni.mongodb.net/UsersTestDB?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());

app.post("/register", bodyParser.json(), registerUser);
app.post("/login", bodyParser.json(), loginUser);

mongoose
    .connect(DB_URL)
    .then(() =>
        app.listen(5000, () => {
            console.log("Server running on port 5000");
        })
    )
    .catch(err => console.log(err));
