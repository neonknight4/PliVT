import Ajv from 'ajv';

interface IEditAuthor {
    authorName: string;
}

const ajv = new Ajv();

const IEditAuthorValidator = ajv.compile({
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

export { IEditAuthor };
export { IEditAuthorValidator };