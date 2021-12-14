import { CustormError } from "./custorm-error";

export class NotFoundError extends CustormError {
    statusCode = 404;
    constructor(public message = "Not found!") {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}