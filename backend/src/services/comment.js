import models from "../models/index.js";
import { validationUtils } from "../utils/validationUtils.js";

class CommentService {
  async softDeleteComment(req, res) {
    const commentId = req.params.commentId;
    console.log(commentId);

    try {
      const existingComment = await this.findCommentById(commentId);

      if (!validationUtils.isValidNumber(commentId)) {
        return res.status(400).json({ error: "Invalid comment id." });
      }

      if (existingComment) {
        await this.deleteCommentById(commentId)
        return res.status(200).json({ msg: "Comment deleted" });
      } else {
        return res.status(404).json({ error: "Comment not found." });
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  async findCommentById(commentId) {
    return await models.Comment.findOne({
      where: { id: commentId, status: 1 },
    });
  }

  async deleteCommentById(commentId) {
    await models.Comment.update(
      { status: 0 },
      {
        where: {
          id: commentId,
        },
      }
    );
  }

async newComment(req, res){
  
  let authorId = req.userId;
  //if the json body is not present
  if (req.body.text == null){
    return res.send(400).json({error: "Wrong text param"})
  } else if (!validationUtils.isValidNumber(req.params.postId)){ //if the post ID isn't a number
    console.log(req.params.postId);
    return res.status(400).json({ error: "Invalid post id" });
  }
 //find if post with the provided postID exists
  let postExists = await models.Post.findOne({
    where: {
      id: req.params.postId
    }
  });
  //if not
  if(postExists == undefined){
    return res.status(404).json({ error: "Target post not found" });
  }
 //if all checks out, create the comment and set it as active
  await models.Comment.build({
    post_id: req.params.postId,
    author_id: authorId,
    content: req.body.text,
    is_active: 1,
  }).save();
  return res.status(201).send({
        message: "Comment was created!",
      });
  }


  async updateCommentById(req, res) {

    const commentId = req.params.commentId;

    try {

      if (commentId == null || !validationUtils.isValidNumber(commentId)) {
        return res.status(400).json({ error: "Invalid comment id." });
      }

      // Check whether the post is existing in the database
      let existingComment = await this.findCommentById(commentId);

      // Post doesn't exist
      if (existingComment == undefined) {
        return res.status(404).send({
          msg: 'Comment not found'
        });
      } else {
          existingComment.set('content', `[Modified by admin - ${new Date()}] ${req.body.content}`);
          existingComment.save();
        // Return response to user
        return res.status(201).send({
          message: "Comment content successfully updated."
        })
      }
    } catch (error) {
      return res.status(500).send({
        error: 'Server error'
      });
    }
  }
}

const commentService = new CommentService();
export { commentService, CommentService };
