import venom from 'venom-bot';
import lodash from 'lodash';
import DialogFlowService from './DialogFlowService.js';
import VTEXService from './VTEXService.js';
class WhatsAppService {
    async start(){
        this.client = await venom.create();
        this.client.onMessage(async (message) => {
            if (message.isGroupMsg === false) {
                await DialogFlowService.start(message.sender.id);
                const intent = await DialogFlowService.detectIntent(message);
                
                const messagesResponse = await this.verifyIntent(intent);

                console.log('Usuário: '+ message.body)
                for (const item of messagesResponse) {
                    await this.client.sendText(message.from, item.text.text[0]);
                    console.log('Bot: '+ item.text.text[0])
                }
            }
        });
    }

    async verifyIntent(intent){
        let messageReturn = '';
        switch (intent.action) {
            case 'welcome.welcome-next.Compras-yes':
                messageReturn = await this.buyStage(intent);
                break;
        
            default:
                messageReturn = intent.fulfillmentMessages;
                break;
        }

        return messageReturn;
    }

    async buyStage(intent) {
        const product_name = intent.parameters.fields.product_name.stringValue;
        const product_category = intent.parameters.fields.product_category.stringValue;

        if(product_name !== '' && product_category === ''){
            VTEXService.start();
            const result = await VTEXService.searchCategoriesByProduct(product_name);
            console.log(result);
            await DialogFlowService.detectIntent({body: JSON.stringify(result)});

            let messageReturn = 'Em qual categoria você acha que seu produto se encaixa? \n';
            if(result.length > 1){
                result.map((item, index) => {
                    messageReturn += `${index + 1} - ${item} \n`;
                });
                messageReturn += 'Digite o *NÚMERO* da categoria';
                return [{text: {text: [messageReturn]}}];
            } else {
                const intent = await DialogFlowService.detectIntent({body: '1'});
                return intent.fulfillmentMessages;
            }
        } else if (this.verifyProductComplete(intent)) {
            
            return intent.fulfillmentMessages;
        }
        else {
            return intent.fulfillmentMessages;
        }
    }

    verifyProductComplete(intent) {
        let complete = true;
        lodash.map(intent.parameters.fields, (field) => {
            if(field.stringValue === ''){
                complete = false;
            }
        })
        // for (const field of intent.parameters.fields) {
        //     if(field.stringValue === ''){
        //         complete = false;
        //     }
        // }

        return complete;
    }
    
}

export default new WhatsAppService();
