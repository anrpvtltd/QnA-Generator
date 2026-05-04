import express from 'express';
import multer from 'multer';
import { uploadPDF, getDocuments } from '../controllers/upload.controller.js';
import { chatWithDoc } from '../controllers/chat.controller.js';
import { getChatHistory } from '../controllers/history.controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadPDF);
router.get('/documents', getDocuments);
router.post('/chat', chatWithDoc);
router.get('/history/:sessionId', getChatHistory);

export default router;
