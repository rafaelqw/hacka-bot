import venom from 'venom-bot';
import _ from 'lodash';
import DialogFlowService from './DialogFlowService.js';
import VTEXService from './VTEXService.js';
class WhatsAppService {
    async start(){
        this.client = await venom.create();
        this.client.onMessage(async (message) => {
            if (message.isGroupMsg === false) {
                await DialogFlowService.start(message.sender.id);
                const intent = await DialogFlowService.detectIntent(message);
                console.log(intent);
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
        const product_index = intent.parameters.fields.product_index.numberValue;
        const product_list = intent.parameters.fields.product_list.stringValue;

        if(product_name !== '' && product_list === '' && product_index !== undefined){
            VTEXService.start();
            const result = await VTEXService.searchItemsByProduct(product_name);
            console.log(result);
            if(result){
                const dfMessage = [];
                result.map(item => {
                    dfMessage.push(item.sku);
                });

                await DialogFlowService.detectIntent({body: JSON.stringify(dfMessage)});
            } else {
                return [{text: {text: ['Infelizmente não encontramos seu produto']}}];
            }

            let messageReturn = 'Encontramos os seguintes produtos: \n\n';
            if(result.length > 1){
                result.map((item, index) => {
                    messageReturn += `${index + 1} - ${item.name} \n`;
                });
                messageReturn += '\nDigite o *NÚMERO* do produto para colocar no carrinho';
                return [{text: {text: [messageReturn]}}];
            } else {
                const intent = await DialogFlowService.detectIntent({body: '1'});
                return intent.fulfillmentMessages;
            }
        } else if(product_name !== '' && product_index !== undefined && product_index !== ''){
            const product_sku = JSON.parse(product_list)[product_index - 1];
            await DialogFlowService.detectIntent({body: JSON.stringify(product_sku)});
            return [{text: {text: ['Produto adicionado ao carrinho!', ]}}, {text: {text: [`Caso queira adicionar mais produtos digite *Continuar*, caso contrário e deseje finalizar seu pedido, por questões de segurança segue o link para finalizar seu pedido em nossa plataforma: ${'http://cosmetics2.myvtex.com/checkout/cart/add?sc=1&sku='+product_sku+'&qty=1&seller=1'}`]}}];
        } else {
            return intent.fulfillmentMessages;
        }
    }

    verifyProductComplete(intent) {
        let complete = true;
        _.map(intent.parameters.fields, (field) => {
            if(field.stringValue === ''){
                complete = false;
            }
        });

        return complete;
    }
    
}

export default new WhatsAppService();
