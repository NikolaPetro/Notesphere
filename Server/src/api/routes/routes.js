import express from 'express';
import { getNotes, createNotes, updateNotes, deleteNotes } from '../controllers/controller.js';

const router = express.Router();

router.get('/', getNotes);
router.post('/', createNotes);
router.patch('/:id', updateNotes);
router.delete('/:id', deleteNotes);

export default router;
