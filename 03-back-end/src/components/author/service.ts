import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddAuthor } from "./dto/IAddAuthor";
import { IEditAuthor } from "./dto/IEditAuthor";
import AuthorModel from "./model";


class AuthorModelAdapterOptions implements IModelAdapterOptions {

}

class AuthorSecvice extends BaseService<AuthorModel> {
    protected async adaptModel(data: any, options: Partial<AuthorModelAdapterOptions> = {}): Promise<AuthorModel> {
        const item = new AuthorModel();

        item.authorId = +(data?.author_id);
        item.authorName = data?.author_name;
    
        return item;
    }

    public async getAll(): Promise<AuthorModel[]|IErrorResponse> {
        return await this.getAllFromTable("author");
    }

    public async getById(authorId: number): Promise<AuthorModel|null|IErrorResponse> {
        return await this.getByIdFromTable("author", authorId);
    }

    public async add(data: IAddAuthor): Promise<AuthorModel|IErrorResponse> {
        return new Promise<AuthorModel|IErrorResponse>(async resolve => {

            const sql: string = `
                                INSERT 
                                    author 
                                SET 
                                    author_name = ?;
                                `
            this.db.execute(sql, [
                data.authorName,
            ])
                .then(async res => {
                    const newAuthorId: number = +((res[0] as any)?.insertId);
                    resolve(await this.getById(newAuthorId));
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
            authorId: number,
            data: IEditAuthor
        ): Promise<AuthorModel|null|IErrorResponse> {
        const result = await this.getById(authorId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof AuthorModel)) {
            return result;
        }
        
        return new Promise(async resolve => {
            const sql: string = `
                                UPDATE 
                                    author 
                                SET 
                                    author_name = ?, 
                                WHERE
                                    author_id = ?;
                                `
            this.db.execute(sql, [
                data.authorName,
                authorId,
            ])
            .then(async result => {
                resolve(await this.getById(authorId));
            })
            .catch(error => {
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                })
            });
        });
    }

    public async delete(authorId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(async resolve => {
            this.db.execute(
                `
                DELETE FROM 
                    author 
                WHERE 
                    author_id = ?;`,
                [
                    authorId
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

export default AuthorSecvice;