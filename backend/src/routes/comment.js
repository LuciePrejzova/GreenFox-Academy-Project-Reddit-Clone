import { Router } from 'express';
import { CommentController, commentController } from '../controllers/comment.js';
import { userIsAdmin } from '../middleware/adminMiddleware.js';
import { authenticateJwtToken } from '../middleware/authMiddleware.js';

const commentRouter = Router();

commentRouter.delete('/:commentId', authenticateJwtToken, userIsAdmin, commentController.deleteComment);
commentRouter.post('/:postId/comments', authenticateJwtToken, commentController.createComment);
commentRouter.put('/:commentId', authenticateJwtToken, userIsAdmin, commentController.updateComment);


export default commentRouter;
