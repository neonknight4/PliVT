import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddArtist } from "./dto/IAddArtist";
import { IEditArtist } from "./dto/IEditArtist";
import ArtistModel from "./model";


class ArtistModelAdapterOptions implements IModelAdapterOptions {

}

class ArtistSecvice extends BaseService<ArtistModel> {
    protected async adaptModel(data: any, options: Partial<ArtistModelAdapterOptions> = {}): Promise<ArtistModel> {
        const item = new ArtistModel();

        item.artistId = +(data?.artist_id);
        item.artistName = data?.artist_name;
    
        return item;
    }

    public async getAll(): Promise<ArtistModel[]|IErrorResponse> {
        return await this.getAllFromTable("artist");
    }

    public async getById(artistId: number): Promise<ArtistModel|null|IErrorResponse> {
        return await this.getByIdFromTable("artist", artistId);
    }

    public async add(data: IAddArtist): Promise<ArtistModel|IErrorResponse> {
        return new Promise<ArtistModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    artist 
                                SET 
                                    artist_name = ?;
                                `
            this.db.execute(sql, [
                data.artistName,
            ])
                .then(async res => {
                    const newArtistId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newArtistId));
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
            artistId: number,
            data: IEditArtist
        ): Promise<ArtistModel|null|IErrorResponse> {
        const result = await this.getById(artistId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof ArtistModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    artist 
                                SET 
                                    artist_name = ?, 
                                WHERE
                                    artist_id = ?;
                                `
            this.db.execute(sql, [
                data.artistName,
                artistId,
            ])
            .then(async result => {
                resolve(await this.getById(artistId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(artistId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    artist 
                WHERE 
                    artist_id = ?;`,
                [
                    artistId
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

export default ArtistSecvice;