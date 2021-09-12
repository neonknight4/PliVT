import * as express from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/Irouter.interface';
import AuthMiddleware from '../../middleware/auth.middleware';
import AuthorController from './controller';

export default class AuthorRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const authorController: AuthorController = new AuthorController(resources);

        application.get("/author", AuthMiddleware.getVerifier("administrator"), authorController.getAll.bind(authorController));
        application.get("/author/:id", AuthMiddleware.getVerifier("administrator"), authorController.getById.bind(authorController));
        
        application.post("/author/", AuthMiddleware.getVerifier("administrator"), authorController.add.bind(authorController));
        application.put("/author/:id", AuthMiddleware.getVerifier("administrator"), authorController.edit.bind(authorController));
        
        application.delete("/author/:id", AuthMiddleware.getVerifier("administrator"), authorController.delete.bind(authorController));
    }
}