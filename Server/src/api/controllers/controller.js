import { getNotes, createNote, updateNote, deleteNote } from '../models/model.js';




const getNotess = async (req, res) => {
  try {
    const notes = await getNotes();
    res.status(200).json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error reading notes data');
  }
};

const createNotes = async (req, res) => {
  try {
    const newNote = await createNote(req.body);
    res.status(201).json(newNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error creating note');
  }
};

const updateNotes = async (req, res) => {
  try {
    const updatedNote = await updateNote(req.params.id, req.body);
    res.status(200).json(updatedNote);
  } catch (err) {
    if (err.message === 'Note not found') {
      res.status(404).send('Note not found');
    } else {
      console.error(err.message);
      res.status(500).send('Error updating note');
    }
  }
};

const deleteNotes = async (req, res) => {
  try {
    await deleteNote(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.message === 'Note not found') {
      res.status(404).send('Note not found');
    } else {
      console.error(err.message);
      res.status(500).send('Error deleting note');
    }
  }
};

export { getNotess, createNotes, updateNotes, deleteNotes };