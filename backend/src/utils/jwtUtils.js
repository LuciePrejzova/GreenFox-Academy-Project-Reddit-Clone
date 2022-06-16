"use strict";

import "dotenv/config";
import jwt from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = jwt;
import { okJwtResponse, failResponse } from "./index.js";

function getJwtToken(
    payload,
    secretKey = process.env.JWT_TOKEN_SECRET,
    expiration = process.env.JWT_TOKEN_EXPIRATION
) {
    const jwtToken = jwt.sign(payload, secretKey, { expiresIn: expiration });
    return jwtToken;
}

function verifyJwtToken(token) {
    const response = jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    return failResponse(403, "expired jwt token"); // 403 Forbidden
                }

                if (err instanceof JsonWebTokenError) {
                    return failResponse(401, "invalid jwt token"); // 401 Unauthorized
                }
            }

            return okJwtResponse(user);
        }
    );

    return response;
}

export { getJwtToken, verifyJwtToken };