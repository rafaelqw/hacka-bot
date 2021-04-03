// TODO: Remover os .js das importações
import express from 'express';
import Router from './routes.js';
import WhatsAppService from './services/WhatsAppService.js';

const app = express();

WhatsAppService.start();

// await was.start();

app.use(express.json());
app.use(Router);

app.listen(3333, () => {
  console.log('🚀️ Server started on port 3333');
});
