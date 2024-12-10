import { getNotes } from '../models/model.js';

import bcrypt from 'bcrypt';


const getNotess = async (req, res) => {
  try {
    const result = await getNotes();
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error');
  }
};


export { getNotess };
