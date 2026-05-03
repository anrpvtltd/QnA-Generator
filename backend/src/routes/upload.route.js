import express from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/upload.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadController);

export default router;
