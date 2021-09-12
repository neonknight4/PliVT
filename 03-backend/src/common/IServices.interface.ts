import AdministratorSecvice from "../components/administrator/service";
import ArtistSecvice from "../components/artist/service";
import GenreSecvice from "../components/genre/service";
import AuthorSecvice from "../components/author/service";
import SongService from "../components/song/service";

export default interface IServices {
    songService: SongService;
    administratorService: AdministratorSecvice;
    artistService: ArtistSecvice;
    genreService: GenreSecvice;
    authorService: AuthorSecvice;

}