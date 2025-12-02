"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareNote = exports.deleteNote = exports.updateNote = exports.getNoteById = exports.getMyNotes = exports.createNote = void 0;
const note_model_1 = require("../models/note.model");
const user_model_1 = require("../models/user.model");
const email_util_1 = require("../utils/email.util");
const createNote = async (req, res, next) => {
    try {
        const note = await note_model_1.Note.create({
            title: req.body.title || "Untitled",
            content: req.body.content || "",
            owner: req.userId,
            versions: [{ content: req.body.content || "", updatedAt: new Date() }]
        });
        res.status(201).json(note);
    }
    catch (err) {
        next(err);
    }
};
exports.createNote = createNote;
const getMyNotes = async (req, res, next) => {
    try {
        const notes = await note_model_1.Note.find({
            $or: [
                { owner: req.userId },
                { "collaborators.user": req.userId }
            ]
        }).populate("owner", "name email");
        res.json(notes);
    }
    catch (err) {
        next(err);
    }
};
exports.getMyNotes = getMyNotes;
const getNoteById = async (req, res, next) => {
    try {
        const note = await note_model_1.Note.findById(req.params.id)
            .populate("owner", "name email")
            .populate("collaborators.user", "name email");
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        res.json(note);
    }
    catch (err) {
        next(err);
    }
};
exports.getNoteById = getNoteById;
const updateNote = async (req, res, next) => {
    try {
        const note = await note_model_1.Note.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        // TODO: permission check (owner or editor collaborator)
        note.title = req.body.title ?? note.title;
        if (req.body.content !== undefined) {
            note.content = req.body.content;
            note.versions.push({ content: req.body.content, updatedAt: new Date() });
        }
        await note.save();
        res.json(note);
    }
    catch (err) {
        next(err);
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res, next) => {
    try {
        await note_model_1.Note.deleteOne({ _id: req.params.id, owner: req.userId });
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
};
exports.deleteNote = deleteNote;
const shareNote = async (req, res, next) => {
    try {
        const { email, role } = req.body; // viewer/editor
        const note = await note_model_1.Note.findById(req.params.id);
        if (!note)
            return res.status(404).json({ message: "Note not found" });
        if (note.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "Only owner can share" });
        }
        const user = await user_model_1.User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const already = note.collaborators.find(c => c.user.toString() === user._id.toString());
        if (!already) {
            note.collaborators.push({ user: user._id, role: role || "viewer" });
            await note.save();
        }
        // email notification
        await (0, email_util_1.sendShareEmail)(user.email, note._id.toString());
        res.json(note);
    }
    catch (err) {
        next(err);
    }
};
exports.shareNote = shareNote;
