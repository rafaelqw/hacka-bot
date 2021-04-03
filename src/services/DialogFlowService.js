import DialogFlow from '@google-cloud/dialogflow';

class DialogFlowService {
    async detectedIntent(message){
        const projectId = 'hackbot-uy9p';
        // A unique identifier for the given session
        const sessionId = message.sender.id;// Numero do celular da pessoa

        // Create a new session
        const sessionClient = new DialogFlow.SessionsClient();
        const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: message.body, 
                // The language used by the client (en-US)
                languageCode: 'pt-br',
            },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        console.log(JSON.stringify(result));
        return result.fulfillmentMessages;
    }
}

export default new DialogFlowService();
