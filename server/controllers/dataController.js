import Data from "../models/data.js";

export async function createData(req, res) {
    let status = 400;
    const { title } = req.body;

    if (!title) {
        status = 400;
        throw new Error("Title required");
    }

    try {
        const data = await Data.create({
            title,
            owner: req.user._id,
        });
        res.status(201).json({ data });

        // res.sendStatus(201);
    } catch (err) {
        res.status(status).json({ error: err.message });
    }
}

export async function getData(req, res) {
    let status = 400;
    try {
        const data = await Data.find({ owner: req.user._id });

        res.json({ data });
    } catch (err) {
        res.status(status).json({ error: err.message });
    }
}

export async function deleteData(req, res) {
    try {
        const data = await Data.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!data) return res.sendStatus(404); //not found

        res.json({ data });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}
