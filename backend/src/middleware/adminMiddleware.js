"use strict";

import { failResponse } from "../utils/index.js";

// to be placed after "authenticateJwtToken" middleware
function userIsAdmin(req, res, next) {
  if (req.userIsAdmin !== true) {
    const { statusCode, responseObject } = failResponse(401, "user is not admin");
    res.status(statusCode);
    res.send(responseObject);
    return;
  }
  next();
}

export { userIsAdmin };

