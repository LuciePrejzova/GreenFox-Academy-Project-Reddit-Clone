import 'regenerator-runtime/runtime.js'
import {commentService} from "../services/comment.js"

class CommentController {

constructor(commentService){
  this.commentService = commentService;
}

deleteComment = async (req, res) => {
    commentService.softDeleteComment(req, res);
};

createComment = async (req, res) => {
  commentService.newComment(req, res);
}

updateComment = async (req, res) => {
  commentService.updateCommentById(req, res);
};

}

const commentController = new CommentController(commentService);
export{commentController, CommentController};
