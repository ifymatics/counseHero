import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-eror";
import { generateJwtToken, verifyJwtToken } from "../helpers/jwt-helper";

interface UserPayload {
    aud?: string | string[] | undefined;
    exp?: number | undefined;
}

/**
* Function for returning refreshing user tokens
* @name refreshTokenHandler
* @function (middleware)
* @params  {Object} req,res next 
* @returns {Object} refreshToken ,accessToken
*/
export const refreshTokenHandler = async (req: Request, res: Response) => {

    try {
        const userPayload: UserPayload = await verifyJwtToken(req.body.refreshToken, 'refreshToken') as JwtPayload;

        //GENERATE TOKEN FOR LOGGEDIN user(counselor or student)

        const accessToken = await generateJwtToken(userPayload.aud);
        const refreshToken = await generateJwtToken(userPayload.aud, 'refreshToken');

        res.status(200).json({ accessToken, refreshToken })

    } catch (error: any) {
        console.log(error.message)
        throw new BadRequestError('Your session has expired!')
    }

}