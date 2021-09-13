import BaseSong from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import ArtistModel from "../artist/model";
import AuthorModel from "../author/model";
import GenreModel from "../genre/model";
import { IAddSong } from "./dto/IAddSong";
import { IEditSong } from "./dto/IEditSong";
import SongModel from "./model";


class SongModelAdapterOptions implements IModelAdapterOptions {
    loadArtist: boolean = false;
    loadAuthor: boolean = false;
    loadGenre: boolean = false;

}

class SongService extends BaseSong<SongModel> {
    protected async adaptModel(data: any, options: Partial<SongModelAdapterOptions> = {}): Promise<SongModel> {
        const item = new SongModel();

        item.songId = +(data?.song_id);
        item.genreId = data?.genre_id;
        item.artistId = data?.artist_id;
        item.authorId = data?.author_id;
        item.songText = data?.song_text;
        item.songName = data?.song_name;

        
        if (options.loadArtist) {
            item.artist = await this.getArtist(item.artistId) as ArtistModel;
        }

        if(options.loadAuthor){
            item.author = await this.getAuthor(item.authorId) as AuthorModel;
        }

        if(options.loadGenre){
            item.genre = await this.getGenre(item.authorId) as GenreModel;
        }

        return item;
    }

    public async getArtist(ArtistId: number): Promise<ArtistModel|IErrorResponse|null> {
        const sql = `
                    SELECT 
                        * 
                    FROM
                        artist 
                    WHERE
                        artist_id = ?;
                    `;
        const  [rows]  = await this.db.execute(sql, [ ArtistId ]) as any;

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        let items = new ArtistModel();

        items.artistId = +(rows[0]?.artist_id);
        items.artistName = rows[0]?.artist_name;

        return items;
    }

    public async getAuthor(AuthorId: number): Promise<AuthorModel|IErrorResponse|null> {
        const sql = `
                    SELECT 
                        * 
                    FROM
                        author 
                    WHERE
                        author_id = ?;
                    `;
        const  [rows]  = await this.db.execute(sql, [ AuthorId ]) as any;

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        let items = new AuthorModel();

        items.authorId = +(rows[0]?.author_id);
        items.authorName = rows[0]?.author_name;

        return items;
    }

    public async getGenre(GenreId: number): Promise<GenreModel|IErrorResponse|null> {
        const sql = `
                    SELECT 
                        * 
                    FROM
                        genre 
                    WHERE
                        genre_id = ?;
                    `;
        const  [rows]  = await this.db.execute(sql, [ GenreId ]) as any;

        if (!Array.isArray(rows) || rows.length === 0) {
            return null;
        }

        let items = new GenreModel();

        items.genreId = +(rows[0]?.genre_id);
        items.genreName = rows[0]?.genre_name;

        return items;
    }


    public async getAll(): Promise<SongModel[]|IErrorResponse> {
        return await this.getAllFromTable("song", {loadArtist: true, loadAuthor:true, loadGenre:true});
    }

    public async getById(
            songId: number, 
            options: Partial<SongModelAdapterOptions> = {loadArtist: true, loadAuthor:true, loadGenre:true}
        ): Promise<SongModel|null|IErrorResponse> {
        return await this.getByIdFromTable("song", songId, options);
    }

    public async add(data: IAddSong): Promise<SongModel|IErrorResponse> {
        return new Promise<SongModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    song 
                                SET 
                                    genre_id = ?, 
                                    artist_id = ?,
                                    author_id = ?,
                                    song_text = ?,
                                    song_name = ?;
                                `
            this.db.execute(sql, [
                data.genreId,
                data.artistId,
                data.authorId,
                data.songText,
                data.songName,
            ])
                .then(async res => {
                    const newSongId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newSongId,{loadArtist: true, loadAuthor:true, loadGenre:true}));
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
            songId: number,
            data: IEditSong
        ): Promise<SongModel|null|IErrorResponse> {
        const result = await this.getById(songId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof SongModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    song 
                                SET 
                                    genre_id = ?, 
                                    artist_id = ?,
                                    author_id = ?,
                                    song_text = ?,
                                    song_name = ?;
                                WHERE
                                    song_id = ?;
                                `
            this.db.execute(sql, [
                data.genreId,
                data.artistId,
                data.authorId,
                data.songText,
                data.songName,
                songId,
            ])
            .then(async result => {
                resolve(await this.getById(songId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(songId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    song 
                WHERE 
                    song_id = ?;`,
                [
                    songId
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

export default SongService;



