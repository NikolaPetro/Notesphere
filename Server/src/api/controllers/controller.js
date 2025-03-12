import asyncHandler from 'express-async-handler';
import { getAll, createNote, updateNote, deleteNote } from '../models/model.js';

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await getAll();
  res.status(200).json(notes);
});

export const createNotes = asyncHandler(async (req, res) => {
  const newNote = await createNote(req.body);
  res.status(201).json(newNote);
});

export const updateNotes = asyncHandler(async (req, res) => {
  const updatedNote = await updateNote(req.params.id, req.body);
  res.status(200).json(updatedNote);
});

export const deleteNotes = asyncHandler(async (req, res) => {
  const deletedNote = await deleteNote(req.params.id);
  res.status(204).send(deletedNote);
});
