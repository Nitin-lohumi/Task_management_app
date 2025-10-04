import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
    },
    content: { type: String, required: true },
    complete: { type: Boolean, default: false, required: false },
    tags: { type: [String], default: [], required: false },
}, { timestamps: true });

const Task = mongoose.model("Task", noteSchema);
export default Task;