import { query } from '../../db/index.js'; 
const getAll = async () => {
  const { rows } = await query('SELECT * FROM notes;');
  return rows;
};

const createNote = async (note) => {
  const { title, content, type } = note;
  const { rows } = await query(
    'INSERT INTO notes (title, content, tags) VALUES ($1, $2, $3) RETURNING *',
    [title, content, type]
  );
  return rows[0];
};

const updateNote = async (id, updatedNote) => {
  const { title, content, tags } = updatedNote;
  const { rows } = await query(
    'UPDATE notes SET title = $1, content = $2, tags = $3 WHERE id = $4 RETURNING *',
    [title, content, tags, id]
  );
  return rows[0];
};

const deleteNote = async (id) => {
  const { rows } = await query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
  return rows[0];
};

export { getAll, createNote, updateNote, deleteNote };
