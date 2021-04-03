export default class ResponseController {

    async responderKenzo(req, res) {
        
        res.status(200).json({message: 'Kenzo respondido'});
    }

}