import Task from "../model/Note_model.js";
import UserData from "../model/userModal.js";
import Tags from "../model/TaskTags_model.js";
export const createNote = async (req, res) => {
  const { userid, content, tag, title } = req.body;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) return res.status(400).json({ message: "User not found" });
    const tagsToSave = tag && tag.length ? tag : ["Common"];
    const existingTags = await Tags.find({ tag: { $in: tagsToSave } }).lean();
    const existingTagNames = existingTags.map((t) => t.tag);
    const newTags = tagsToSave.filter((t) => !existingTagNames.includes(t));
    if (newTags.length) {
      await Tags.insertMany(newTags.map((t) => ({ tag: t })));
    }
    const note = new Task({ userId: user._id, content, tags: tag.length ? tag : ["Comman"], title });
    await note.save();
    res.status(201).json({ message: "Note created", newTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNotes = async (req, res) => {
  const { userid } = req.params;
  const { pageCount = 1, tags, sorts = "0" } = req.query;
  try {
    const user = await UserData.findOne({ _id: userid });
    if (!user) {
      return res.status(401).json({ msg: "User is not authenticated" });
    }
    let query = { userId: user._id };
    const tagsArray = tags ? tags.split(",").filter((t) => t) : [];
    if (tagsArray.length) {
      query.tags = { $in: tagsArray }
    }
    const sortStatus = Number(sorts) == -1 ? { complete: -1 } : { createdAt: -1 }
    let notes = await Task.find(query)
      .skip((Number(pageCount) - 1) * 10)
      .limit(11).sort(sortStatus);
    const AllTags = await GetTags();
    res.json({
      length: notes.length > 10 ? 10 : notes.length,
      tags: AllTags,
      tasks: notes.slice(0, 10),
      next: notes.length === 11
    });
  } catch (error) {
    console.log(error.message);
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
    const task = await Task.findByIdAndDelete({ _id: taskId });
    if (task.tags.length) {
      await Tags.deleteMany({ tag: { $in: task.tags } });
    }
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const EditTask = async (req, res) => {
  const { userId, TaskId, content, tags, complete, title } = req.body;
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
      { content, tags: tags.length ? tags : [], title, complete },
      { new: true }
    );

    const tagsToSave = tags && tags.length ? tags : [];
    if (tagsToSave.length) {
      const existingTags = await Tags.find({ tag: { $in: tagsToSave } }).lean();
      const existingTagNames = existingTags.map((t) => t.tag);
      const newTags = tagsToSave.filter((t) => !existingTagNames.includes(t));
      if (newTags.length) {
        await Tags.insertMany(newTags.map((t) => ({ tag: t })));
      }
    }

    const allTagsInTasks = await Task.find({}, { tags: 1 }).lean();
    const tagsInUse = new Set(allTagsInTasks.flatMap(t => t.tags));
    await Tags.deleteMany({ tag: { $nin: Array.from(tagsInUse) } });
    
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

const GetTags = async () => {
  try {
    const Tag = await Tags.find().lean();
    return Tag;
  } catch (error) {
    throw new Error(error.message);
  }
}