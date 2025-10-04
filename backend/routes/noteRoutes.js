import express from "express";
import { createNote, getNotes, deleteNote, EditTask, CompleteTask } from "../controllers/noteController.js";
const router = express.Router();
router.post("/task", createNote);
router.get("/task/:userid", getNotes);
router.patch("/taskEdit", EditTask);
router.delete("/task/:userid/:taskId", deleteNote);
router.patch("/taskComplete/:userId/:taskId", CompleteTask);
export default router;
