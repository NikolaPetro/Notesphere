import { compareSync } from 'bcrypt';
import { query } from '../../db/index.js';

const getNotes = () => {
  return query('select * from notes; ');
};

export { getNotes };
