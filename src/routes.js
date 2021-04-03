import express from 'express';
import WhatsAppController from './controllers/WhatsAppController.js';

const router = express.Router();

const whatsAppController = new WhatsAppController();

router.get('/new-messages', whatsAppController.indexNewMessages);

export default router;