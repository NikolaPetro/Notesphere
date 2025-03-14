import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import { errorHandler, notFoundHandler } from './error/errorHandler.js';
import routes from './api/routes/routes.js';
const dirname = path.resolve();

dotenv.config();
const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(dirname, '/public')));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

app.use('/notes', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on port 3000`);
});

console.log('Server started');
