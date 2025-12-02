import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
  shareNote
} from "../controllers/note.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Get all notes for logged-in user (own + shared)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", requireAuth, getMyNotes);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", requireAuth, createNote);

/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get single note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", requireAuth, getNoteById);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update note (content/title + version history)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", requireAuth, updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete note (only owner)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", requireAuth, deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Share note with another user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/share", requireAuth, shareNote);

export default router;
