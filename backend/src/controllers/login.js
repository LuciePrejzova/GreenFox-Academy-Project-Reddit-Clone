"use strict";

import { loginService } from "../services/login.js";
import 'regenerator-runtime/runtime.js'

class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }

    async loginUser(req, res) {
        const serviceResponse = await loginService.handleLoginUserRequest(req);
        const { statusCode, responseObject } = serviceResponse;
        res.status(statusCode);
        res.send(responseObject);
    }
}

const loginController = new LoginController();
export { loginController, LoginController };
