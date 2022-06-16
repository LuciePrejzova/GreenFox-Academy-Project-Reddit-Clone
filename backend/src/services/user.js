import validator from "email-validator";
import mailer from "../config/mailer.js";
import { validationUtils } from "../utils/validationUtils.js";
import { Sequelize } from "sequelize";
import models from "../models/index.js";
import {
  failResponse,
  resourceCreatedResponse,
  serverErrorResponse,
  serverErrorAdminResponse,
  notFoundResponse,
  resourceUpdatedResponse,
  okResponse,
  successResponse,
} from "../utils/responseObjects.js";
import { loginService } from "./login.js";
import { userIsAdmin } from "../middleware/adminMiddleware.js";
import { filters } from "../utils/filterUtils.js";

const { User } = models;

class UserService {

  async findAllUsers(req, res) {
    try {
    const users = await models.User.findAll();
    return res.json(users);
    } catch {
      return res.status(500).send({
        error: 'Server error'
      });
    }
  }

  async findByUserName(username) {
    let user = await User.findOne({
      where: { name: username },
    });
    return user;
  }

  async findByUserNameOrEmail(username, email) {
    let user = await User.findOne({
      where: Sequelize.or({ name: username }, { email: email }),
    });
    return user;
  }

  async findByToken(userToken) {
    let user = await User.findOne({
      where: { activationToken: userToken },
    });
    return user;
  }

  async updateTokenByUserName(username, newToken) {
    await User.update(
      { activationToken: newToken },
      {
        where: {
          name: username,
        },
      }
    );
  }

  async updateUpdatedAtByUserName(username, newDate) {
    await User.update(
      { createdAt: newDate },
      {
        where: {
          name: username,
        },
      }
    );
  }

  async updateStatusByUserName(userToken, status) {
    await User.update(
      { isActive: status },
      {
        where: {
          activationToken: userToken,
        },
      }
    );
  }

  async createUser(req) {
    await User.build({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      activationToken: validationUtils.generateRandomToken(24),
    }).save();
  }

  validateRegister(req, res, next) {
    try {
      // check whether all the data is provided
      if (!req.body.name || !req.body.email || !req.body.password || !req.body.password_repeat) {
        return res.status(400).send({
          error: "missing credentials",
        });
      }

      // username min length 1
      if (req.body.name.length < 1) {
        return res.status(400).send({
          msg: "Please enter a username with min. 1 chars",
        });
      }

      // valid email
      if (!validator.validate(req.body.email)) {
        return res.status(400).send({
          msg: "Please enter a valid email address",
        });
      }

      // password min. 8 chars, 1 uppercase and 1 number
      let pattern = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/g;
      if (!pattern.test(req.body.password)) {
        return res.status(400).send({
          msg: "Please enter a password with min. 8 chars, 1 uppercase and 1 number",
        });
      }
      // password (repeat) does not match
      if (req.body.password != req.body.password_repeat) {
        return res.status(400).send({
          msg: "Both passwords must match",
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
    next();
  }

  async approveRegister(req, res) {
    try {
      // Check for unique username or email
      let existingUser = await userService.findByUserNameOrEmail(req.body.name, req.body.email);

      // Username is unavailable
      if (existingUser != undefined) {
        return res.status(409).send({
          msg: "This username or/and email are already in use!",
        });
      } else {
        // Username is available

        // Generate 24-long random token
        let newToken = validationUtils.generateRandomToken(24);

        // Check if user exists with same token
        let existingUserWithSameToken = await userService.findByToken(newToken);

        // Generate new token as long as a it is not unique in the database
        while (existingUserWithSameToken != undefined) {
          newToken = validationUtils.generateRandomToken(24);
          existingUserWithSameToken = await userService.findByToken(newToken);
        }

        // Username, email & token are available --> Create user
        await userService.createUser(req);

        // Get user from database
        let createdUser = await userService.findByUserName(req.body.name);

        // Send confirmation link to user
        await mailer.sendOptInMail(
          createdUser.email,
          createdUser.activationToken
        );

        // Return response to user
        return res.status(201).send({
          id: createdUser.id,
          status: `Successfully created new user ${req.body.name}`
        })
      }
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }

  async activateAccount(req, res) {
    try {
      let userToken = req.params.token;
      let existingUser = await userService.findByToken(userToken);

      // User not found within the database
      if (!existingUser) {
        return res.status(400).send({
          msg: "User not existing",
        });
      }

      // already activated
      if (existingUser.isActive == true) {
        return res.status(409).send({
          msg: "Account is already activated!",
        });
      }

      // activationToken is expired
      if (!validationUtils.isTimeValid(24, await existingUser.createdAt)) {
        return res.status(410).send({
          msg: "Activation link is expired, please follow reset/forgotten password flow to activate your account.",
        });
      } else {
        // set account active
        await userService.updateStatusByUserName(userToken, true);
        // changes updated_at
        await existingUser.set("updatedAt", new Date());
        await existingUser.save();
        return res.status(201).send({
          msg: "Account activated",
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }

  async sendResetPasswordLink(req, res) {
    // Check for unique username or email
    let existingUser = await this.findByUserNameOrEmail(
      req.body.identification,
      req.body.identification
    );

    // Request body is empty
    if (!req.body.identification) {
      return res.status(400).send({
        error: "Please provide a user name or email",
      });
    }

    // User not found within the database
    if (existingUser == undefined) {
      return res.status(404).send({
        msg: "User not existing",
      });
    } else {
      // Generate 24-long random token
      let newToken = validationUtils.generateRandomToken(24);

      // Check if user exists with same token
      let existingUserWithSameToken = await this.findByToken(newToken);

      // Generate new token as long as a it is not unique in the database
      while (existingUserWithSameToken != undefined) {
        newToken = validationUtils.generateRandomToken(24);
        existingUserWithSameToken = await this.findByToken(newToken);
      }

      // Set new token to user
      await existingUser.set("activationToken", newToken);
      await existingUser.save();

      // Update updatedAt date
      await existingUser.set("updatedAt", new Date());
      await existingUser.save();

      // Send confirmation link to user
      await mailer.sendResetPasswordEmail(
        existingUser.email,
        existingUser.activationToken
      );

      // Return response to user
      return res.status(200).send({
        message: `Successfully reset password link sent to ${existingUser.name}`,
      });
    }
  }

  async activateAccountWithNewPassword(req, res) {
    try {
      let userToken = req.params.token;
      let existingUser = await userService.findByToken(userToken);

      // User not found within the database
      if (!existingUser) {
        return res.status(400).send({
          msg: "User not existing",
        });
      }

      // activationToken is expired
      if (!validationUtils.isTimeValid(24, await existingUser.updatedAt)) {
        return res.status(410).send({
          msg: "Reset password link is expired, please reset once more your password.",
        });
      }

      // password min. 8 chars, 1 uppercase and 1 number
      let pattern = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/g;
      if (!pattern.test(req.body.new_password)) {
        return res.status(400).send({
          msg: "Please enter a password with min. 8 chars, 1 uppercase and 1 number",
        });
      }

      // password (repeat) does not match
      if (req.body.new_password != req.body.new_password_repeat) {
        return res.status(400).send({
          msg: "Both passwords must match",
        });
      }

      // activate account if it wasn't activated yet
      if (existingUser.isActive == false) {
        await existingUser.set("isActive", true);
        await existingUser.save();
      }

      // update password with new password
      await existingUser.set("password", req.body.new_password);
      await existingUser.save();

      // Update updatedAt date
      await existingUser.set("updatedAt", new Date());
      await existingUser.save();

      return res.status(200).send({
        messagesg: "New password successfully reset",
      });
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }

  // ↓↓↓ POST /users ↓↓↓
  async createUserByAdmin(req) {
    try {
      const response = await this.tryCreateNewUser(req);
      return response;
    } catch (error) {
      return serverErrorAdminResponse(error.toString());
    }
  }

  async tryCreateNewUser(req) {
    const { username: name, email } = req.body;
    const isAdmin = req.body.isAdmin === true || false;

    // if credentials are missing
    const blankFields = ![name, email].every(validationUtils.fieldIsNotBlank);
    if (blankFields) {
      return failResponse(400, "missing credentials");
    }

    // if invalid email
    if (!loginService.validEmailWasProvided(email)) {
      return failResponse(400, "invalid email");
    }

    // check if user already exists
    const user = await this.findByUserNameOrEmail(req);
    if (user != null) {
      return failResponse(400, "user already exists");
    }

    await User.build({
      name,
      email,
      password: validationUtils.generateRandomTokenToMatchRegex(
        16,
        /^(?=.*[0-9])(?=.*[A-Z]).{16}$/g
      ),
      activationToken: validationUtils.generateRandomToken(24),
      isActive: true,
      isAdmin,
    }).save();

    return resourceCreatedResponse();
  }

  // ↓↓↓ PUT /users/userId ↓↓↓
  async updateUser(req) {
    try {
      // missing or empty payload
      const noPayload = validationUtils.objectIsBlank(req.body);
      if (noPayload) {
        return failResponse(422, "missing or empty payload");
      }

      // parse path parameter
      const { userId: id } = req.params;
      const userIdIsValidNumber = validationUtils.isValidNumber(id);
      if (!userIdIsValidNumber) {
        return notFoundResponse();
      }

      // payload
      const {
        username: name,
        email,
        isAdmin,
        password,
        profilePicture,
      } = req.body;

      // if user is admin
      const userIsAdmin = req.userIsAdmin === true || false;

      if (userIsAdmin) {
        const response = await this.tryToUpdateUserByAdmin(
          id,
          name,
          email,
          isAdmin,
          password
        );
        return response;
      }

      if (!userIsAdmin) {
        console.log(id);
        console.log(req.userId);
        const response = await this.tryToUpdateOwnProfile(
          req.userId,
          id,
          email,
          password,
          profilePicture
        );
        
        return response;
      }
    } catch (error) {
      if (userIsAdmin) {
        return serverErrorAdminResponse(error.toString());
      } else {
        return serverErrorResponse();
      }
    }
  }

  async tryToUpdateUserByAdmin(id, name, email, isAdmin, password) {
    // try fetch user from db
    const userToUpdate = await User.findOne({ where: { id } });
    if (userToUpdate == null) {
      return notFoundResponse();
    }

    // checking provided fields in payload
    const response = await this.checkPayloadForUpdatingUser(
      name,
      email,
      password
    );
    if (response.statusCode >= 400) {
      return response;
    }

    const isAdminField = typeof isAdmin === "boolean" ? isAdmin : undefined;

    // filters out undefined fields
    const fieldsToUpdate = filters.filterOutUndefinedValues({
      name,
      email,
      isAdmin: isAdminField,
      password,
    });

    // update user with provided fields
    userToUpdate.update({ ...fieldsToUpdate, updatedAt: new Date() });
    await userToUpdate.save();
    return resourceUpdatedResponse();
  }

  async checkPayloadForUpdatingUser(name, email, password) {
    // checking if fields are valid (if provided)
    const providedNameIsInvalid =
      name != undefined && !validationUtils.fieldIsNotBlank(name);
    const providedEamilIsInvalid =
      email != undefined && !validationUtils.isValidEmail(email);
    if (providedNameIsInvalid || providedEamilIsInvalid) {
      return failResponse(422, "invalid fields were provided"); // 422 -> Unprocessable entity
    }

    // checking if user with name or email already exists (if fields are provided in payload)
    const nameInQuery = name === undefined ? null : name;
    const emailInQuery = email === undefined ? null : email;
    const userWithThisEmailOrNameExists = await User.findOne({
      where: Sequelize.or({ name: nameInQuery }, { email: emailInQuery }),
    });

    if (userWithThisEmailOrNameExists) {
      return failResponse(422, "user with these fieldsa already exists");
    }

    // checking if password meets minimal requirements (if provided in payload)
    const passwordMeetsMinimalRequirements =
      password === undefined || /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/g.test(password);
    if (!passwordMeetsMinimalRequirements) {
      return failResponse(
        422,
        "new password does not meet minimal requirements"
      );
    }

    // provided fields are valid
    return okResponse();
  }

  async tryToUpdateOwnProfile(loggedUserId, id, email, password, profilePicture) {
    // if logged user tries to acces resources of other user
    console.log(loggedUserId);
    console.log(id);
    if (+loggedUserId !== +id) {
      return failResponse(403, "not allowed to access this resource");
    }

    // check if email has valid format and is not used by other user (if provided)
    if (email != undefined) {
      if (!validationUtils.isValidEmail(email)) {
        return failResponse(422, "invalid email was provided");
      }

      const userWithThisEmailExists = await User.findOne({ where: { email } });
      if (userWithThisEmailExists) {
        return failResponse(422, "user with this email already exists");
      }
    }

    // check if profile picture is encoded in Base64 format (if provided)
    // if ((profilePicture != undefined) && (!validationUtils.itemHasBase64Encoding(profilePicture))) {
    //   return failResponse(422, "picture has no Base64 encoding");
    // }

    // filters out undefined fields
    const fieldsToUpdate = filters.filterOutUndefinedValues({
      email,
      password,
      profilePicture
      
    });

    // update user with provided fields
    await User.update(
      { ...fieldsToUpdate, updatedAt: new Date() },
      { where: { id: loggedUserId } }
    );
    return resourceUpdatedResponse();
  }

  // ↓↓↓ DELETE /users/userId ↓↓↓
  async deleteUserByAdmin(req) {
    try {
      const response = await this.tryDeleteUserByAdmin(req);
      return response;
    } catch (error) {
      return serverErrorAdminResponse(error.toString());
    }
  }

  async tryDeleteUserByAdmin(req) {
    // parse path parameter
    const { userId: id } = req.params;
    const userIdIsValidNumber = validationUtils.isValidNumber(id);
    if (!userIdIsValidNumber) {
      return notFoundResponse();
    }

    // try fetch user from db
    const userToUpdate = await User.findOne({ where: { id } });
    if (userToUpdate == null) {
      return notFoundResponse();
    }

    // soft-deleting user
    if (userToUpdate.status === 0) {
      return failResponse(409, "user is already deleted");
    }

    userToUpdate.update({ status: 0, updatedAt: new Date() });
    await userToUpdate.save();
    return successResponse(200, "user has been deleted");
  }

  async showProfile(req, res) {
    //get the logged in user
    let loggedUser = await models.User.findOne({
      where: {
        name: req.userName,
      },
    });

    //get the user to show
    console.log(req.params.username);
    let userToGet = await models.User.findOne({
      where: {
        name: req.params.username,
      },
    });
    //if user to show is null
    if (userToGet == null) {
      return res.status(404).send("User not found");
    }
    //if the user is admin or if logged in user is the same as the userToGet, return the info
    if (loggedUser.isAdmin == true || loggedUser.id == userToGet.id) {
      let response = {
        name: userToGet.name,
        email: userToGet.email,
        isAdmin: userToGet.isAdmin,
        profilePicture: userToGet.profilePicture,
        created_at: userToGet.createdAt,
      };
      return res.send(response);
    } else {
      //else access denided
      return res.status(403).send("Access denided");
    }
  }

  async getUserPosts(req, res) {
    const userId = req.params.userId;
    try {
      const userPosts = await this.findPostsByUserId(userId);
      if (!userId) {
        res.status(404).send("User not found");
      }
      if (userPosts.length <= 0 || userPosts === null) {
        res.status(404).send("No posts to show");
      } else {
        return res.status(200).json(userPosts);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findPostsByUserId(userId) {
    return await models.Post.findAll({
      where: { author_id: userId },
    });
  }
}

const userService = new UserService();
export { userService, UserService };
