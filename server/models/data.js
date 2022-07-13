import mongoose from "mongoose";

const dataSchema = mongoose.Schema(
    {
        title: String,
        owner: mongoose.Schema.Types.ObjectId,
    },
    {
        collection: "data",
    }
);

const Data = mongoose.model("Data", dataSchema);

export default Data;
