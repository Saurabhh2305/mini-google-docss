import { Router, Response } from "express";
import { Note } from "../models/note.model";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

// GET /api/notes
router.get("/", async (req: AuthRequest, res: Response) => {
  const notes = await Note.find({ owner: req.userId }).sort({ updatedAt: -1 });
  res.json(notes);
});

// POST /api/notes
router.post("/", async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const note = await Note.create({
    title,
    content,
    owner: req.userId,
    collaborators: []
  });

  res.status(201).json(note);
});

// PUT /api/notes/:id
router.put("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, owner: req.userId },
    { title, content },
    { new: true }
  );

  if (!note) return res.status(404).json({ message: "Note not found" });

  res.json(note);
});

// DELETE /api/notes/:id
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const note = await Note.findOneAndDelete({ _id: id, owner: req.userId });

  if (!note) return res.status(404).json({ message: "Note not found" });

  res.json({ message: "Note deleted" });
});

export default router;
