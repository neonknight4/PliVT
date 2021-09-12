import IModel from '../../common/IModel.interface';

class AuthorModel implements IModel {
    authorId: number;
    authorName: string;
}

export default AuthorModel;