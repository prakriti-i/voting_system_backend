import dotenv from "dotenv";
dotenv.config();


export const Env = {
    port: process.env.PORT || 3000,
    dbConnectionString: process.env.db_connection_string,
    jwtSecretKey: process.env.jwt_secret_key
}