import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: { type: String, required: true },
    tags: { type: [String], default: [], required: false },
}, { timestamps: true });

const Task = mongoose.model("Task", noteSchema);
export default Task;