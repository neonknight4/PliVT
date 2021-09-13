import IModel from '../../common/IModel.interface';
import ArtistModel from '../artist/model';
import AuthorModel from '../author/model';
import GenreModel from '../genre/model';

class SongModel implements IModel {
    songId: number;
    genreId: number;
    artistId: number;
    authorId: number;
    songText: string;
    songName: string;
    artist: ArtistModel;
    author: AuthorModel;
    genre: GenreModel;
}

export default SongModel;