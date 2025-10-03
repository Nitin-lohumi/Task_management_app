import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/noteController.js";
const router = express.Router();
router.post("/notes", createNote);
router.get("/notes/:userid", getNotes);
router.delete("/notes/:userid/:Note_id", deleteNote);
export default router;
