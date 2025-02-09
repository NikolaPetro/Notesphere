import fs from 'fs/promises';
import path from 'path';

const getNotesFilePath = () => path.join(process.cwd(), 'data', 'notes.json');

const getNotes = async () => {
  const notesData = await fs.readFile(getNotesFilePath(), 'utf8');
  const { notes } = JSON.parse(notesData);
  return notes;
};

const createNote = async (noteData) => {
  const notes = await getNotes();
  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 1,
    ...noteData,
    created_at: new Date().toISOString()
  };
  
  notes.push(newNote);
  await fs.writeFile(getNotesFilePath(), JSON.stringify({ notes }, null, 2));
  return newNote;
};

const updateNote = async (id, updateData) => {
  const notes = await getNotes();
  const index = notes.findIndex(note => note.id === parseInt(id));
  
  if (index === -1) {
    throw new Error('Note not found');
  }
  
  notes[index] = {
    ...notes[index],
    ...updateData,
    id: parseInt(id) 
  };
  
  await fs.writeFile(getNotesFilePath(), JSON.stringify({ notes }, null, 2));
  return notes[index];
};

const deleteNote = async (id) => {
  const notes = await getNotes();
  const filteredNotes = notes.filter(note => note.id !== parseInt(id));
  
  if (filteredNotes.length === notes.length) {
    throw new Error('Note not found');
  }
  
  await fs.writeFile(getNotesFilePath(), JSON.stringify({ notes: filteredNotes }, null, 2));
  return true;
};

export { getNotes, createNote, updateNote, deleteNote };
