// TODO: Remover os .js das importações
import express from 'express';
import dotenv from 'dotenv';
import Router from './routes.js';
import WhatsAppService from './services/WhatsAppService.js';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const app = express();

WhatsAppService.start();

app.use(express.json());
app.use(Router);

app.listen(3333, () => {
  console.log('🚀️ Server started on port 3333');
});

// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\Rafael\hacka-bot\src\config\dialoflow.json"