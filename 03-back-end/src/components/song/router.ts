import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import SongController from './controller';

export default class SongRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const songController: SongController = new SongController(resources);

        application.get("/song", AuthMiddleware.getVerifier("administrator"), songController.getAll.bind(songController));
        application.get("/song/:id", AuthMiddleware.getVerifier("administrator"), songController.getById.bind(songController));
        
        application.post("/song/", AuthMiddleware.getVerifier("administrator"), songController.add.bind(songController));
        application.put("/song/:id", AuthMiddleware.getVerifier("administrator"), songController.edit.bind(songController));
        
        application.delete("/song/:id", AuthMiddleware.getVerifier("administrator"), songController.delete.bind(songController));
    }
}