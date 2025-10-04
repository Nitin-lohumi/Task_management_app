import mongoose from "mongoose";
const TagsSchema = new mongoose.Schema({
    tag: { type: String, required: true, unique: true }
});
const Tags = mongoose.model("Tags", TagsSchema);
export default Tags;