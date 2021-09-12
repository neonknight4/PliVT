import Ajv from 'ajv';

interface IAddAuthor {
    authorName: string;
}

const ajv = new Ajv();

const IAddAuthorValidator = ajv.compile({
    type: "object",
    properties: {
        authorName: {
            type: "string",
            minLength: 2,
            maxLength: 32,
        },
    },
    required: [
        "authorName",
    ],
    additionalProperties: false
});

export { IAddAuthor };
export { IAddAuthorValidator };