import Ajv from 'ajv';

interface IEditArtist {
    artistName: string;
}

const ajv = new Ajv();

const IEditArtistValidator = ajv.compile({
    type: "object",
    properties: {
        artistName: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
    },
    required: [
        "artistName",
    ],
    additionalProperties: false
});

export { IEditArtist };
export { IEditArtistValidator };