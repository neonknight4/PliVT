import Ajv from 'ajv';

interface IEditSong {
    genreId: number;
    artistId: number;
    authorId: number;
    songText: string;
    songName: string;
}

const ajv = new Ajv();

const IEditSongValidator = ajv.compile({
    type: "object",
    properties: {
        genreId: {
            type: "number",
            minimum: 1,
        },
        artistId: {
            type: "number",
            minimum: 1,
        },
        authorId: {
            type: "number",
            minimum: 1,
        },
        songText: {
            type: "string",
            minLength: 3,
        },
        songName: {
            type: "string",
            minLength: 3,
            maxLength: 32,
        },
    },
    required: [
        "genreId",
        "artistId",
        "authorId",
        "songText",
        "songName",
    ],
    additionalProperties: false
});

export { IEditSong };
export { IEditSongValidator };