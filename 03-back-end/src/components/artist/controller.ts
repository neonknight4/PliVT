import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import ArtistModel from "./model";
import { IAddArtist, IAddArtistValidator } from "./dto/IAddArtist";
import { IEditArtist, IEditArtistValidator } from "./dto/IEditArtist";

class ArtistController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.artistService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const artistId: number = +id;

        if (artistId <= 0) {
            return res.sendStatus(400);
        }

        const data: ArtistModel|null|IErrorResponse = await this.services.artistService.getById(artistId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof ArtistModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddArtistValidator(data)) {            
            return res.status(400).send(IAddArtistValidator.errors);
        }

        res.send(await this.services.artistService.add(data as IAddArtist));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const artistId: number = +id

        if (artistId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditArtistValidator(data)) {            
            return res.status(400).send(IEditArtistValidator.errors);
        }

        const result =  await this.services.artistService.edit(artistId, data as IEditArtist);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.artistService.delete(id));
    }
}

export default ArtistController