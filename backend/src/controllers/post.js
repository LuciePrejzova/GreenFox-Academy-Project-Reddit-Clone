import "regenerator-runtime/runtime.js";
import { postService } from "../services/post.js";
import { voteService } from "../services/vote.js";

class PostController {
  constructor(postService, voteService) {
    this.postService = postService;
    this.voteService = voteService;
  }

  showPost = async (req, res) => {
    postService.findOnePost(req, res);
  };

  getAllPosts = async (req, res) => {
    postService.getAll(req, res);
  };

  createPost = async (req, res) => {
    postService.newPost(req, res);
  };

  updatePost = async (req, res) => {
    postService.updatePostById(req, res);
  };

  deletePost = async (req, res) => {
    postService.softDeletePost(req, res);
  };

  vote = async (req, res) => {
    voteService.vote(req, res);
  };

  getAllComments = async (req, res) => {
    postService.findAllComments(req, res);
  };

  showComment = async (req, res) => {
    postService.getOneComment(req, res);
  };

  getPostsOfChannel = async (req, res) => {
    postService.getPostsOfChannel(req, res);
  };

  getVotes = async (req, res) => {
    postService.getVotes(req, res);
  };
}

const postController = new PostController(postService);
export { postController, PostController };
