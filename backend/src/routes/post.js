import { Router } from "express";
import { postController } from "../controllers/post.js";
import { userIsAdmin } from '../middleware/adminMiddleware.js';
import { authenticateJwtToken } from "../middleware/authMiddleware.js";

const postRouter = Router();

postRouter.get("/channel/:channelId", postController.getPostsOfChannel);
postRouter.get("/:id", postController.showPost);

// to include votes for each post -> "/posts?votes=true"
postRouter.get("/", postController.getAllPosts);
postRouter.get("/:id/comments", postController.getAllComments);
postRouter.get("/:id/comments/:commentId", postController.showComment)
postRouter.delete("/:id", authenticateJwtToken, postController.deletePost);
postRouter.post("/", authenticateJwtToken, postController.createPost);
postRouter.put("/:id", authenticateJwtToken, userIsAdmin, postController.updatePost);
postRouter.post('/:id/votes', authenticateJwtToken, postController.vote);
postRouter.get('/:id/votes',  postController.getVotes);


export default postRouter;
