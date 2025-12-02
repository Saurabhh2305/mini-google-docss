import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Note } from "../models/note.model";
import { User } from "../models/user.model";
import { sendShareEmail } from "../utils/email.util";

export const createNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.create({
      title: req.body.title || "Untitled",
      content: req.body.content || "",
      owner: req.userId,
      versions: [{ content: req.body.content || "", updatedAt: new Date() }]
    });
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const getMyNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find({
      $or: [
        { owner: req.userId },
        { "collaborators.user": req.userId }
      ]
    }).populate("owner", "name email");
    res.json(notes);
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate("owner", "name email")
      .populate("collaborators.user", "name email");

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // TODO: permission check (owner or editor collaborator)
    note.title = req.body.title ?? note.title;
    if (req.body.content !== undefined) {
      note.content = req.body.content;
      note.versions.push({ content: req.body.content, updatedAt: new Date() });
    }
    await note.save();
    res.json(note);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await Note.deleteOne({ _id: req.params.id, owner: req.userId });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const shareNote = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, role } = req.body; // viewer/editor
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Only owner can share" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const already = note.collaborators.find(c => c.user.toString() === user._id.toString());
    if (!already) {
      note.collaborators.push({ user: user._id, role: role || "viewer" });
      await note.save();
    }

    // email notification
    await sendShareEmail(user.email, note._id.toString());

    res.json(note);
  } catch (err) {
    next(err);
  }
};
