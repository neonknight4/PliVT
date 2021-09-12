import Ajv from 'ajv';

interface IAddArtist {
    artistName: string;
}

const ajv = new Ajv();

const IAddArtistValidator = ajv.compile({
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

export { IAddArtist };
export { IAddArtistValidator };