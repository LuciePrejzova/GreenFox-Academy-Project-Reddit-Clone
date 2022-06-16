"use strict";

import { failResponse, verifyJwtToken } from "../utils/index.js";

function authenticateJwtToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const { statusCode, responseObject } = checkIfTokenIsValid(token);    

    if (statusCode !== 200) {
        res.status(statusCode);
        res.send(responseObject);
        return;
    }

    // setting attributes of authenticated user on the response object
    req.userId = responseObject.id;
    req.userName = responseObject.name;
    req.userEmail = responseObject.email;
    req.userIsAdmin = responseObject.isAdmin
    next();
}

function checkIfTokenIsValid(token) {
    if (token == null) {
        return failResponse(401, "jwt token is not provided");
    }

    const verficationResult = verifyJwtToken(token);
    return verficationResult;
}

export { authenticateJwtToken };

