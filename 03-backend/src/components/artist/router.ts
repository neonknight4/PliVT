import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import ArtistController from './controller';

export default class ArtistRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const artistController: ArtistController = new ArtistController(resources);

        application.get("/artist", AuthMiddleware.getVerifier("administrator"), artistController.getAll.bind(artistController));
        application.get("/artist/:id", AuthMiddleware.getVerifier("administrator"), artistController.getById.bind(artistController));
        
        application.post("/artist/", AuthMiddleware.getVerifier("administrator"), artistController.add.bind(artistController));
        application.put("/artist/:id", AuthMiddleware.getVerifier("administrator"), artistController.edit.bind(artistController));
        
        application.delete("/artist/:id", AuthMiddleware.getVerifier("administrator"), artistController.delete.bind(artistController));
    }
}