import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import GenreModel from "./model";
import { IAddGenre, IAddGenreValidator } from "./dto/IAddGenre";
import { IEditGenre, IEditGenreValidator } from "./dto/IEditGenre";

class GenreController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.genreService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const genreId: number = +id;

        if (genreId <= 0) {
            return res.sendStatus(400);
        }

        const data: GenreModel|null|IErrorResponse = await this.services.genreService.getById(genreId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof GenreModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddGenreValidator(data)) {            
            return res.status(400).send(IAddGenreValidator.errors);
        }

        res.send(await this.services.genreService.add(data as IAddGenre));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const genreId: number = +id

        if (genreId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditGenreValidator(data)) {            
            return res.status(400).send(IEditGenreValidator.errors);
        }

        const result =  await this.services.genreService.edit(genreId, data as IEditGenre);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.genreService.delete(id));
    }
}

export default GenreController