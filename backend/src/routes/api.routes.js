import express from 'express';
import multer from 'multer';
import { uploadPDF } from '../controllers/upload.controller.js';
import { chatWithDoc } from '../controllers/chat.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), uploadPDF);
router.post('/chat', chatWithDoc);

export default router;
