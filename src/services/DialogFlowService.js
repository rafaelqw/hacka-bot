import DialogFlow from '@google-cloud/dialogflow';

class DialogFlowService {
    async start(sessionId){
        this.projectId = process.env.DIALOG_FLOW_PROJECT_ID;
        this.sessionClient = new DialogFlow.SessionsClient();
        this.sessionPath = this.sessionClient.projectAgentSessionPath(process.env.DIALOG_FLOW_PROJECT_ID, sessionId);
    }

    async detectIntent(message){
        const request = {
            session: this.sessionPath,
            queryInput: {
                text: {
                    text: message.body, 
                    languageCode: 'pt-br',
                },
            },
        };
        
        const responses = await this.sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        return result;
    }
}

export default new DialogFlowService();
