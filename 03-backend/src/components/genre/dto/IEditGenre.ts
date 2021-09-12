import Ajv from 'ajv';

interface IEditGenre {
    genreName: string;
}

const ajv = new Ajv();

const IEditGenreValidator = ajv.compile({
    type: "object",
    properties: {
        genreName: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
    },
    required: [
        "genreName",
    ],
    additionalProperties: false
});

export { IEditGenre };
export { IEditGenreValidator };