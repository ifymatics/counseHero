import jwt from "jsonwebtoken";

/**
 * Function for generating token
 * @name verifyJwtToken
 * @function 
 * @params userId - string,type - string
 * @returns {Promise} - generated Token
 */

export const generateJwtToken = (userId: any, type = 'accessToken') => {
    if (typeof userId !== "string") return;
    return new Promise((resolve, reject) => {
        const payload = {};
        let secret = process.env.JWT_ACCESS_TOKEN_KEY!;
        let options = { expiresIn: '1hr', issuer: 'counselHero', audience: userId };
        if (type === 'refreshToken') {
            secret = process.env.JWT_REFRESH_TOKEN_KEY!;
            options = { expiresIn: '1y', issuer: 'counselHero', audience: userId };

        }

        jwt.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })


    })
}

/**
 * Function for verifying token
 * @name verifyJwtToken
 * @function 
 * @params token - string, type - string
 * @returns {Promise} - verified payload
 */
export const verifyJwtToken = (token: string, type = 'accessToken') => {
    let secret = type === 'refreshToken' ? process.env.JWT_REFRESH_TOKEN_KEY! : process.env.JWT_ACCESS_TOKEN_KEY!;

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, value) => {

            if (err) reject(err)
            resolve(value)
        });

    });
}