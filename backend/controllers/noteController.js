import Task from "../model/Note_model.js";
import UserData from "../model/userModal.js";

export const createNote = async (req, res) => {
  const { userid, content, tag } = req.body;
  const user = await UserData.findOne({ _id: userid });
  if (!user) return res.status(400).json({ message: "User not found" });
  const note = new Task({ userId: user._id, content });
  await note.save();
  res.status(201).json({ message: "Note created" });
};

export const getNotes = async (req, res) => {
  const { userid } = req.params;
  const user = await UserData.findOne({ _id: userid });
  const notes = await Task.find({ userId: user._id }).sort({ createdAt: -1 });
  res.json(notes);
};

export const deleteNote = async (req, res) => {
  const { userid, Note_id } = req.params;
  const user = await UserData.findOne({ _id: userid });
  if (!user) return res.status(400).json({ message: "User not found" });
  const note = await Task.findById({ _id: Note_id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  await Task.findByIdAndDelete({ _id: Note_id });
  res.json({ message: "Note deleted" });
};
