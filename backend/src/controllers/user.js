import 'regenerator-runtime/runtime.js'
import { async } from 'regenerator-runtime/runtime.js';
import { userService } from "../services/user.js";
// import { async } from "regenerator-runtime/runtime.js";

class UserController {
  constructor(userService) {
    this.userService = userService;
  };

  registrationValidation = async (req, res, next) => {
    userService.validateRegister(req, res, next);
  };

  registrationApproval = async (req, res) => {
    userService.approveRegister(req, res);
  };

  accountActivation = async (req, res) => {
    userService.activateAccount(req, res);
  };

  async resetPasswordProcess(req, res) {
    userService.sendResetPasswordLink(req, res);
  };

  async activateNewPassword(req, res) {
    userService.activateAccountWithNewPassword(req, res);
  }

  async showProfile(req, res) {
    userService.showProfile(req, res);
  };

  getAllUsers = async (req, res) => {
    userService.findAllUsers(req, res);
  };

  createUserByAdmin = async (req, res) => {
    const serviceResponse = await userService.createUserByAdmin(req);
    const { statusCode, responseObject } = serviceResponse;
    res.status(statusCode).send(responseObject);
  };

  updateUser = async (req, res) => {
    const serviceResponse = await userService.updateUser(req);
    const { statusCode, responseObject } = serviceResponse;
    res.status(statusCode).send(responseObject);
  };

  deleteUserByAdmin = async(req, res) => {
   const serviceResponse = await userService.deleteUserByAdmin(req);
    const { statusCode, responseObject } = serviceResponse;
   res.status(statusCode).send(responseObject);
  };

  async getUserPosts(req,res) {
    userService.getUserPosts(req,res);
  };

}

const userController = new UserController(userService);
export { userController, UserController };