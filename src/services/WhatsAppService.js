import venom from 'venom-bot';
import DialogFlowService from './DialogFlowService.js';

class WhatsAppService {
    async start(){
        this.client = await venom.create();
        this.client.onMessage(async (message) => {
            if (message.isGroupMsg === false) {
                const messagesResponse = await DialogFlowService.detectedIntent(message);
                console.log('Usuário: '+ message.body)
                for (const item of messagesResponse) {
                    console.log(item)
                    await this.client.sendText(message.from, item.text.text[0]);
                    console.log('Bot: '+ item.text.text[0])
                }
            }
        });
    }

    async sendMessage(){
        
    }
}

export default new WhatsAppService();
