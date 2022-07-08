import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("User api");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
