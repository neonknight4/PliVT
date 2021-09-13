import BaseController from "../../common/BaseController";
import { Request, Response, NextFunction } from "express";
import IErrorResponse from "../../common/IErrorResponse.interface";
import SongModel from "./model";
import { IAddSong, IAddSongValidator } from "./dto/IAddSong";
import { IEditSong, IEditSongValidator } from "./dto/IEditSong";

class SongController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        res.send(await this.services.songService.getAll());
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const songId: number = +id;

        if (songId <= 0) {
            return res.sendStatus(400);
        }

        const data: SongModel|null|IErrorResponse = await this.services.songService.getById(songId);

        if (data === null) {
            return res.sendStatus(404);
        }

        if (data instanceof SongModel) {
            return res.send(data);
        }

        res.status(500).send(data);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddSongValidator(data)) {            
            return res.status(400).send(IAddSongValidator.errors);
        }

        res.send(await this.services.songService.add(data as IAddSong));
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const data = req.body;
        const id = req.params.id;
        const songId: number = +id

        if (songId <= 0) {
            return res.status(400).send("Invalid ID number");
        }
        if (!IEditSongValidator(data)) {            
            return res.status(400).send(IEditSongValidator.errors);
        }

        const result =  await this.services.songService.edit(songId, data as IEditSong);

        if (result === null) {            
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);    

        if (id <= 0) return res.status(400).send("ID value cannot be smaller than 1");

        res.send(await this.services.songService.delete(id));
    }
}

export default SongController;