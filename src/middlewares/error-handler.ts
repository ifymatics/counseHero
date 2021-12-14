import { Request, Response, NextFunction } from "express";
import { CustormError } from "./../errors/custorm-error";

/**
* Function for returning errors to the users when it occurs application
* @name errorHandler
* @function (middleware)
* @params  {Object} req,res next 
* @returns {Object} error
*/

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {

    if (error instanceof CustormError) {
        return res.status(error.statusCode).send({ errors: error.serializeError() })
    }
    res.status(400).json({ errors: [{ message: "Something went wrong" }] })
}