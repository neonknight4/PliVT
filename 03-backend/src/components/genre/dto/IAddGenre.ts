import Ajv from 'ajv';

interface IAddGenre {
    genreName: string;
}

const ajv = new Ajv();

const IAddGenreValidator = ajv.compile({
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

export { IAddGenre };
export { IAddGenreValidator };