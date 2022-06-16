"use strict";
import { getJwtToken } from "../utils/jwtUtils.js";
import { serverErrorResponse, failResponse, okResponse } from "../utils/responseObjects.js";
import { compareSync } from "bcrypt";
import { validationUtils } from "../utils/validationUtils.js";
import models from "../models/index.js";
const { User: user } = models


class LoginService {
    async handleLoginUserRequest(req) {
        try {
            const response = await this.checkIfUserCanLogin(req.body);
            return response;
        } catch (error) {
            return serverErrorResponse();
        }
    }

    async checkIfUserCanLogin({ name, email, password }) {

        // if credentials are missing
        if (this.credentialsAreIncomplete(name, email, password)) {
            return failResponse(400, "missing credentials");
        }

        // tries to find user based on provided email or username
        const userFromDB = await this.findUserByMailOrName(email, name);

        // user is not found in database or password is invalid
        if (userFromDB === null || !this.isPasswordMatch(password, userFromDB.password)) {
            return failResponse(401, "invalid credentials"); // 401 -> unauthorized
        }

        // user has valid credentials but is not active yet
        if (!userFromDB.isActive) {
            return failResponse(401, "user is not activated");
        }

        // user has valid credentials and is active
        else {
            const { id, name, email, isAdmin } = userFromDB;
            const token = getJwtToken({ id, name, email, isAdmin });
            return okResponse(token);

        }
    }

    // database queries //
    async findUserByMailOrName(email, username) {
        let userFromDB = null;

        if (this.validEmailWasProvided(email)) {
            userFromDB = await this.findUserByField({ email });

        } else if (validationUtils.fieldIsNotBlank(username)) {
            userFromDB = await this.findUserByField({ name: username });
        }

        return userFromDB;
    }

    async findUserByField(keyValuePair) {
        return await user.findOne({ where: keyValuePair });
    }

    // validation //
    isPasswordMatch(requestPassword, dbHashedPassword) {
        return compareSync(requestPassword, dbHashedPassword);
    }

    validEmailWasProvided(stringInput) {
        return validationUtils.fieldIsNotBlank(stringInput) && validationUtils.isValidEmail(stringInput);
    }

    // credentials are incomplete if:
    //  - both valid email and username is missing
    //    or if valid email or usernames is provided, but password is missing
    credentialsAreIncomplete(username, email, password) {
        const hasUsername = validationUtils.fieldIsNotBlank(username);
        const hasPassword = validationUtils.fieldIsNotBlank(password);
        const hasEmail = this.validEmailWasProvided(email);

        return (!hasEmail && !hasUsername) || !hasPassword;
    }
}

const loginService = new LoginService();
export { loginService, LoginService };