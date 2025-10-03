import Task from "../model/Note_model.js";
import UserData from "../model/userModal.js";

export const createNote = async (req, res) => {
  const { userid, content, tag } = req.body;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) return res.status(400).json({ message: "User not found" });
    const note = new Task({ userId: user._id, content, tags: tag });
    await note.save();
    res.status(201).json({ message: "Note created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  const { userid } = req.params;
  const { pageCount } = req.query;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) {
      return res.json({ msg: "user is not auth" });
    }
    const notes = await Task.find({ userId: user._id }).skip((pageCount - 1) * 10).limit(11)
      .sort({ createdAt: -1 }).lean();
    console.log(notes);
    res.json({
      length: notes.length > 10 ? 10 : notes.length,
      note: notes.slice(0, 10),
      next: notes.length === 11
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { userid, Note_id } = req.params;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) return res.status(400).json({ message: "User not found" });
    const note = await Task.findById({ _id: Note_id });
    if (!note) return res.status(404).json({ message: "Note not found" });
    await Task.findByIdAndDelete({ _id: Note_id });
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const EditTask = async (req, res) => {
  const { userId, TaskId, content, tag } = req.body;
  try {
    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const task = await Task.findById(TaskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }
    const updatedTask = await Task.findOneAndUpdate(
      { _id: TaskId, userId: userId },
      { content, tags: tag },
      { new: true }
    );
    res.json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
