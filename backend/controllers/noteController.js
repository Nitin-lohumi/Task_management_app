import Task from "../model/Note_model.js";
import UserData from "../model/userModal.js";

export const createNote = async (req, res) => {
  const { userid, content, tag, title } = req.body;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) return res.status(400).json({ message: "User not found" });
    const note = new Task({ userId: user._id, content, tags: tag.length ? tag : ["Comman"], title });
    await note.save();
    res.status(201).json({ message: "Note created" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  const { userid } = req.params;
  const { pageCount = 1, tags, sort } = req.query;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) {
      return res.json({ msg: "user is not auth" });
    }
    let query = { userId: user._id };
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagsArray };
    }
    let notes = await Task.find(query)
      .sort(sort && sort == -1 ? { createdAt: -1 } : { createdAt: 1 })
      .skip((pageCount - 1) * 10)
      .limit(11);

    res.json({
      length: notes.length > 10 ? 10 : notes.length,
      tasks: notes.slice(0, 10),
      next: notes.length === 11
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const deleteNote = async (req, res) => {
  const { userid, taskId } = req.params;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) return res.status(400).json({ message: "User not found" });
    const note = await Task.findById({ _id: taskId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    await Task.findByIdAndDelete({ _id: taskId });
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const EditTask = async (req, res) => {
  const { userId, TaskId, content, tag, complete, title } = req.body;
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
      { content, tags: tag, title, complete },
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

export const CompleteTask = async (req, res) => {
  const { userId, taskId } = req.params;
  try {
    const user = await UserData.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }
    await task.updateOne({ complete: true });
    res.json({
      message: "Task Completed",
      complete: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, complete: false, });
  }
}