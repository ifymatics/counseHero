import { ValidationError } from "express-validator";
import { CustormError } from "./custorm-error";

export class ValidationRequestError extends CustormError {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super('Invalid Parameters');
        Object.setPrototypeOf(this, ValidationRequestError.prototype)
    }
    serializeError() {

        return this.errors.map(err => ({ message: err.msg, field: err.param }));
    }
}