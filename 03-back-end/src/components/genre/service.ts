import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddGenre } from "./dto/IAddGenre";
import { IEditGenre } from "./dto/IEditGenre";
import GenreModel from "./model";


class GenreModelAdapterOptions implements IModelAdapterOptions {

}

class GenreSecvice extends BaseService<GenreModel> {
    protected async adaptModel(data: any, options: Partial<GenreModelAdapterOptions> = {}): Promise<GenreModel> {
        const item = new GenreModel();

        item.genreId = +(data?.genre_id);
        item.genreName = data?.genre_name;
    
        return item;
    }

    public async getAll(): Promise<GenreModel[]|IErrorResponse> {
        return await this.getAllFromTable("genre");
    }

    public async getById(genreId: number): Promise<GenreModel|null|IErrorResponse> {
        return await this.getByIdFromTable("genre", genreId);
    }

    public async add(data: IAddGenre): Promise<GenreModel|IErrorResponse> {
        return new Promise<GenreModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    genre 
                                SET 
                                    genre_name = ?;
                                `
            this.db.execute(sql, [
                data.genreName,
            ])
                .then(async res => {
                    const newGenreId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newGenreId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    })
                });
        });
    }

    public async edit(
            genreId: number,
            data: IEditGenre
        ): Promise<GenreModel|null|IErrorResponse> {
        const result = await this.getById(genreId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof GenreModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    genre 
                                SET 
                                    genre_name = ?, 
                                WHERE
                                    genre_id = ?;
                                `
            this.db.execute(sql, [
                data.genreName,
                genreId,
            ])
            .then(async result => {
                resolve(await this.getById(genreId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(genreId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    genre 
                WHERE 
                    genre_id = ?;`,
                [
                    genreId
                ]
            )
            .then(res => {
                resolve({
                    errorCode: 0,
                    errorMessage: `Deleted ${(res as any[])[0]?.affectedRows} records.`
                });
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        })
    }
}

export default GenreSecvice;