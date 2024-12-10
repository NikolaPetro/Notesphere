import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';

import { errorHandler, notFoundHandler } from './error/errorHandler.js';
import routes from './api/routes/routes.js';
const dirname = path.resolve();

dotenv.config();
const app = express();

app.use(cors());

app.use(morgan('tiny'));
app.use(express.static(path.join(dirname, '/public')));

app.use(express.json());

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT ?? 5555;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
console.log('Server started');
