import IModel from '../../common/IModel.interface';

class ArtistModel implements IModel {
    artistId: number;
    artistName: string;
}

export default ArtistModel;