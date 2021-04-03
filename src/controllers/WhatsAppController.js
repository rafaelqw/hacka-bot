import WhatsAppService from '../services/WhatsAppService.js';

export default class WhatsAppController {
    async indexNewMessages (req, res) {
        const newMessages = await WhatsAppService.client.getChatContactNewMsg();
        return res.json(newMessages);
    }
}
