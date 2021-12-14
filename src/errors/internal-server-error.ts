import { CustormError } from "./custorm-error";

export class IntervalServerError extends CustormError {
    statusCode = 500;
    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, IntervalServerError.prototype);
    }
    serializeError() {
        return [{ message: this.message }]
    }
}