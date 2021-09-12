import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import AuthorModel from "./model";
import { IAddAuthor, IAddAuthorValidator } from "./dto/IAddAuthor";
import { IEditAuthor, IEditAuthorValidator } from "./dto/IEditAuthor";

class AuthorController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.authorService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const authorId: number = +id;

        if (authorId <= 0) {
            return res.sendStatus(400);
        }

        const data: AuthorModel|null|IErrorResponse = await this.services.authorService.getById(authorId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof AuthorModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddAuthorValidator(data)) {            
            return res.status(400).send(IAddAuthorValidator.errors);
        }

        res.send(await this.services.authorService.add(data as IAddAuthor));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const authorId: number = +id

        if (authorId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditAuthorValidator(data)) {            
            return res.status(400).send(IEditAuthorValidator.errors);
        }

        const result =  await this.services.authorService.edit(authorId, data as IEditAuthor);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.authorService.delete(id));
    }
}

export default AuthorController