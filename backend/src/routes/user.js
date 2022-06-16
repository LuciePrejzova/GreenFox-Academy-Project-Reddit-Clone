import { Router } from 'express';
import { userController } from '../controllers/user.js';
import { userIsAdmin } from '../middleware/adminMiddleware.js';
import { authenticateJwtToken } from '../middleware/authMiddleware.js';

const userRouter = Router();

userRouter.post('/registration', userController.registrationValidation, userController.registrationApproval);

userRouter.get('/confirmation/:token', userController.accountActivation);

userRouter.get('/users/:username', authenticateJwtToken, userController.showProfile);

userRouter.get('/users', userController.getAllUsers);

userRouter.post('/forgotten', userController.resetPasswordProcess);

userRouter.post('/reset/:token', userController.activateNewPassword);

userRouter.post('/users', authenticateJwtToken, userIsAdmin, userController.createUserByAdmin);

userRouter.put('/users/:userId', authenticateJwtToken, userController.updateUser);

userRouter.delete('/users/:userId', authenticateJwtToken, userIsAdmin, userController.deleteUserByAdmin);

userRouter.get('/users/:userId/posts', authenticateJwtToken, userController.getUserPosts)

export default userRouter;


