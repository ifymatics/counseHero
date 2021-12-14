import { connect, connection } from "mongoose";

/**
 * Function for connecting to MongoDb database
 * @Function
 * @returns (Object)
 */
export const db = async () => {
    try {
        const connected = await connect(`${process.env.MONGODB_CONNECTION_URI}`);

        return connected;
    } catch (error) {
        connection.close();

    }
}