export abstract class CustormError extends Error {
    abstract statusCode: number;
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustormError.prototype);
    }
    abstract serializeError(): { message: string, field?: string }[];

}