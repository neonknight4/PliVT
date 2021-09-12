import IModel from '../../common/IModel.interface';

class GenreModel implements IModel {
    genreId: number;
    genreName: string;
}

export default GenreModel;