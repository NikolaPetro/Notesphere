import express from 'express';
import asyncHandler from 'express-async-handler';

import { getNotess } from '../controllers/controller.js';
const router = express.Router();


router.get('/', asyncHandler(getNotess));


export default router;
