"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const note_controller_1 = require("../controllers/note.controller");
const router = (0, express_1.Router)();
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
router.get("/", auth_middleware_1.requireAuth, note_controller_1.getMyNotes);
/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", auth_middleware_1.requireAuth, note_controller_1.createNote);
/**
 * @swagger
 * /notes/{id}:
 *   get:
 *     summary: Get single note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", auth_middleware_1.requireAuth, note_controller_1.getNoteById);
/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Update note (content/title + version history)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", auth_middleware_1.requireAuth, note_controller_1.updateNote);
/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Delete note (only owner)
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", auth_middleware_1.requireAuth, note_controller_1.deleteNote);
/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Share note with another user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/share", auth_middleware_1.requireAuth, note_controller_1.shareNote);
exports.default = router;
