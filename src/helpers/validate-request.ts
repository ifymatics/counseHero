import { Request, Response, NextFunction } from 'express';
import { validationResult, body, param, query } from 'express-validator';
import { ValidationRequestError } from '../errors/validation-request-error';

/**
* Function for validating request fields
* @name validateRequest
* @function 
* @params  {Object} req,res next 
* @returns next()
*/
export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ValidationRequestError(errors.array());
    }

    next();
};

/**
* Function for mapping request fields with error messages
* @name validationStrings
* @function 
* @params  validationStr: string[][]
* @returns {Object}
*/
export const validationStrings = (validationStr: string[][]) => {
    return validationStr.map(fieldStr => {
        if (fieldStr[1] === 'param') {
            return param(fieldStr[0])
                .trim()
                .notEmpty()
                .withMessage(`You must supply ${fieldStr[0]} param`);
        };

        return fieldStr[0].toLocaleLowerCase() === 'email' ?
            body(fieldStr[0])
                .isEmail()
                .withMessage('Email must be valid')
            : fieldStr[0].toLocaleLowerCase() === 'date' ?
                body(fieldStr[0]).isISO8601().toDate().withMessage(`You must supply a valid ${fieldStr[0]}`) :
                body(fieldStr[0])
                    .trim()
                    .notEmpty()
                    .withMessage(`You must supply a ${fieldStr[0]}`);
    });

}