import express from 'express';
import { getNotess, createNotes, updateNotes, deleteNotes } from '../controllers/controller.js';


const router = express.Router();

router.get('/', getNotess);
router.post('/', createNotes);
router.put('/:id', updateNotes);
router.delete('/:id', deleteNotes);

export default router;