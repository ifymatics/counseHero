import { NextFunction, Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-eror";
import { UnathorizedError } from "../errors/unathorized-error";
import { verifyJwtToken } from "../helpers/jwt-helper"

interface UserPayload {
    aud?: string | string[] | undefined;
    exp?: number | undefined;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

/**
* Function for checking authorized requests application
* @name authorizedHandler
* @function (middleware)
* @params  {Object} req,res next 
* @returns next()
*/
export const authorizedHandler = async (req: Request, _res: Response, next: NextFunction) => {

    if (!req.headers['authorization']) throw new UnathorizedError()
    const token = req.headers['authorization'].split(' ')[1];

    try {
        const { aud } = await verifyJwtToken(token) as JwtPayload;
        //console.log(aud)
        req.currentUser = { aud };
    } catch (error: any) {
        console.log(error.message)
        throw new BadRequestError('Your session has expired!')
    }


    return next();
}