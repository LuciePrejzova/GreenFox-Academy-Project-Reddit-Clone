import models from "../models/index.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { validationUtils } from "../utils/validationUtils.js";
import { channelService } from "./channel.js";
import { sequelize } from "../models/index.js";

class PostService {
  async findOnePost(request, response) {
    if (
      validationUtils.isValidNumber(request.params.id) &&
      request.params.id !== null
    ) {
      try {
        const post = await models.Post.findOne({
          where: { id: request.params.id, isActive: 1 },
        });

        if (post !== null) {
          response.status(200).json(post);
        } else {
          response.status(404).json({ error: "Not found." });
        }
      } catch (error) {
        response.status(500).json(error);
      }
    } else {
      response.status(400).json({ error: "Missing header or incorrect path." });
    }
  }

  async getAll(req, res) {
    const countObj = req.query.count;

    const allPosts = await models.Post.findAll({
      where: { is_active: 1 },
    });

    //handling input
    let offSet; //offset
    if (req.query.offset != null) {
      offSet = parseInt(req.query.offset, 10);
      if (isNaN(offSet)) {
        return res.status(400).json({ error: "Incorrect offset parameter!" });
      }
    }

    let limit; //limit
    if (req.query.limit != null) {
      limit = parseInt(req.query.limit, 10);
      if (isNaN(limit)) {
        return res.status(400).json({ error: "Incorrect limit parameter!" });
      }
    }

    let order = req.query.order; //order
    if (order == null) {
      order = "desc";
    }
    if (order != "desc") {
      if (order != "asc") {
        console.log(req.query.order);
        return res.status(400).json({ error: "Incorrect order parameter!" });
      }
    }
    let field = req.query.field;
    if (field === "vote") {
      const [results, metadata] = await sequelize.query(
        "SELECT p.id as post_id, COUNT(v.id) as count FROM votes as v RIGHT JOIN posts as p ON v.post_id=p.id GROUP BY p.id ORDER BY count DESC;"
      );
      console.log(results);

      let response = [];
      for (let index = 0; index < allPosts.length; index++) {
        const element = results[index].post_id;
        const post = await models.Post.findOne({
          where: { id: element, is_active: 1 },
        });
        if (response.length < limit) {
          response.push(post);
        }
      }
      if (response.length <= 0) {
        return res.status(404).json({ error: "No posts found" });
      } else {
        return res.status(200).json(response);
      }
    }

    if (field != null) {
      let existingCollumn = "false";
      Object.keys(models.Post.rawAttributes).forEach((element) => {
        if (field == element) {
          existingCollumn = "true";
        }
      });
      if (existingCollumn == "false") {
        return res.status(400).json({ error: "Incorrect field parameter!" });
      }
    }

    //count
    if (countObj != null) {
      if (countObj != "true") {
        if (countObj != "false") {
          return res.status(400).json({ error: "Incorrect count parameter!" });
        }
      }
    }

    let response = {};

    try {
      //add count property to response yes/no
      if (countObj == "true") {
        let count = {
          count: await models.Post.count(),
        };
        Object.assign(response, count);
      }

      if (req.query.offSet == null && req.query.limit == null) {
        //only /posts
        let fullList = {
          posts: await models.Post.findAll({
            where: {
              is_active: 1,
            },
          }),
        };
        Object.assign(response, fullList);
      }

      //handling offSet/limit and adding correct list to response object
      if (req.query.offset != null) {
        if (req.query.limit != null) {
          if (offSet == 0) {
            limit++;
          }
          let offSetAndLimitFilter = {
            posts: await models.Post.findAll({
              where: Sequelize.and({
                is_active: 1,
                id: {
                  [Op.gte]: offSet,
                  [Op.lt]: offSet + limit,
                },
              }),
            }),
          };

          Object.assign(response, offSetAndLimitFilter);
        } else {
          let offSetFilter = {
            posts: await models.Post.findAll({
              where: Sequelize.and({
                is_active: 1,
                id: {
                  [Op.gte]: offSet,
                },
              }),
            }),
          };
          Object.assign(response, offSetFilter);
        }
      } else if (limit != null) {
        console.log(limit);
        let limitFilter = {
          posts: await models.Post.findAll({
            where: Sequelize.and({
              is_active: 1,
              id: {
                [Op.lte]: limit,
              },
            }),
          }),
        };
        Object.assign(response, limitFilter);
      }

      //only order is defined; from newest to oldest posts by default
      if (order == "asc" && field == null) {
        response.posts.forEach((element) => {});
        response.posts.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      } else if (order == "desc" && field == null) {
        response.posts.sort(function (a, b) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      }

      if (field != null) {
        switch (field) {
          case "id":
            response.posts.sort(function (a, b) {
              return a.id - b.id;
            });
          case "title":
            response.posts.sort(function (a, b) {
              return a.title - b.title;
            });
          case "type":
            response.posts.sort(function (a, b) {
              return a.type - b.type;
            });
          case "content":
            response.posts.sort(function (a, b) {
              return a.content - b.content;
            });
          case "createdAt":
            response.posts.sort(function (a, b) {
              return new Date(a.createdAt) - new Date(b.createdAt);
            });
          case "author_id":
            response.posts.sort(function (a, b) {
              return a.author_id - b.author_id;
            });
          case "channel_id":
            response.posts.sort(function (a, b) {
              return a.channel_id - b.channel_id;
            });
        }
        if (order == "asc") {
          response.posts.reverse();
        }
      }

      if (response.posts.length > 100) {
        response.posts.length = 100;
      }

      // fetching votes (if "/posts?votes=true")
      // if (req.query.votes === "true") {
      //   response.posts = await this.getPostsWithVotes(response.posts);
      // }

      return res.send(response);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async softDeletePost(req, res) {
    const postId = req.params.id;
    const userId = req.userId;
    const userIsAdmin = req.userIsAdmin;

    try {
      if (!validationUtils.isValidNumber(postId)) {
        res.status(400).json({ error: "Invalid post id." });
        return;
      }

      if (userIsAdmin) {
        var existingPost = await models.Post.findOne({ where: { id: postId } });
      } else {
        var existingPost = await this.findPostByUserAndId(userId, postId);
      }

      if (existingPost == null) {
        res.status(404).json({ error: "Post not found." });
        return;
      }

      if (existingPost.isActive == 1) {
        await this.deleteOwnPost(postId);
        res.status(200).json({ msg: "Post successfully deleted." });
        return;
      } else {
        res.status(404).json({ error: "Post not found." });
      }
    } catch (error) {
      console.log(error.toString());

      res.status(500).json({ msg: "Server error." });
    }
  }

  async deleteOwnPost(postId) {
    await models.Post.update(
      { isActive: 0 },
      {
        where: {
          id: postId,
        },
      }
    );
  }

  async findPostByUserAndId(userId, postId) {
    return await models.Post.findOne({
      where: { id: postId, author_id: userId },
    });
  }

  async findPostById(postId) {
    let post = await models.Post.findOne({
      where: { id: postId },
    });
    return post;
  }

  async updatePostById(req, res) {
    const postId = req.params.id;

    try {
      if (postId == null || !validationUtils.isValidNumber(postId)) {
        return res.status(400).json({ error: "Invalid post id." });
      }

      // Check whether the post is existing in the database
      let existingPost = await this.findPostById(postId);

      // Post doesn't exist
      if (existingPost == undefined) {
        return res.status(404).send({
          msg: "Post not found",
        });
      } else {
        if (existingPost.type == "text" || existingPost.type == "link") {
          existingPost.set(
            "content",
            `[Modified by admin - ${new Date()}] ${req.body.content}`
          );
          existingPost.save();
        } else {
          existingPost.set("content", `${req.body.content}`);
          existingPost.save();
        }
        // Return response to user
        return res.status(201).send({
          message: "Post content successfully updated.",
        });
      }
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }

  async newPost(req, res) {
    let authorId = req.userId; //get the logged in user ID

    try {
      //check if the input has all the required properties
      if (!req.body.title) {
        return res.status(400).send({
          error: "Post title is missing!",
        });
      }
      if (!req.body.type) {
        return res.status(400).send({
          error: "Post type is missing!",
        });
      }
      if (!req.body.content) {
        return res.status(400).send({
          error: "Post content is missing!",
        });
      }
      if (!req.body.channel_id) {
        return res.status(400).send({
          error: "Post channelID is missing!",
        });
      }
      if (
        req.body.type != "link" &&
        req.body.type != "image" &&
        req.body.type != "text"
      ) {
        return res.status(400).send({
          error: "Post type should be either text, link or image",
        });
      }
      if (
        (await channelService.findChannelById(req.body.channel_id)) == undefined
      ) {
        return res.status(404).send({
          error: "Channel not existing!",
        });
      }
      //build the post from the provided info and save to db
      await models.Post.build({
        title: req.body.title,
        type: req.body.type,
        content: req.body.content,
        author_id: authorId,
        channel_id: req.body.channel_id,
        is_active: 1,
      }).save();
      //success message
      return res.status(201).send({
        message: "Post was created!",
      });
    } catch (error) {
      return res.status(500).send({
        error: "Server error",
      });
    }
  }

  async findAllComments(req, res) {
    const postId = req.params.id;

    try {
      const allComments = await this.findCommentsByPostId(postId);

      if (!postId) {
        return res.status(404).json({ error: "No post" });
      }

      if (!validationUtils.isValidNumber(postId)) {
        return res.status(400).json({ error: "Invalid post id." });
      }

      if (allComments.length <= 0) {
        return res.status(404).json({ error: "No comments found." });
      } else {
        return res.status(200).json(allComments);
      }
    } catch (error) {
      return res.status(500).json({ msg: "Server error." });
    }
  }

  async findCommentsByPostId(postId) {
    return await models.Comment.findAll({
      where: {
        post_id: postId,
        status: 1,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async getOneComment(req, res) {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    try {
      const comment = await this.findCommentByPostAndCommentId(
        postId,
        commentId
      );

      if (!postId) {
        return res.status(404).json({ error: "No post" });
      }

      if (
        !validationUtils.isValidNumber(postId) ||
        !validationUtils.isValidNumber(commentId)
      ) {
        return res.status(400).json({ error: "Invalid post or comment id." });
      }

      if (!comment) {
        return res.status(404).json({ error: "No comment found." });
      } else {
        return res.status(200).json(comment);
      }
    } catch (error) {
      return res.status(500).json({ msg: "Server error." });
    }
  }

  async findCommentByPostAndCommentId(postId, commentId) {
    return await models.Comment.findOne({
      where: {
        id: commentId,
        post_id: postId,
        status: 1,
      },
    });
  }

  async getPostsOfChannel(req, res) {
    const { channelId } = req.params;

    try {
      if (!validationUtils.isValidNumber(channelId)) {
        return res.status(400).json({ error: "Invalid channel id." });
      }

      const posts = await models.Post.findAll({
        where: { channel_id: channelId },
        include: [
          { model: models.User, attributes: ["name"] }, // contains name of the creator of post
        ],
      });

      // getting votes for each post
      const postsWithVotes = await this.getPostsWithVotes(posts);

      // getting channel details
      const channel = await models.Channel.findOne({
        where: { id: channelId },
      });

      // getting name of the creator of a channel
      const creator = await models.User.findOne({
        attributes: ["name"],
        where: { id: channel.author_id },
      });

      return res
        .status(200)
        .json({
          posts: postsWithVotes,
          channel: { ...channel.toJSON(), creatorName: creator.name },
        });

      // return res.status(200).json({ posts, channel });
    } catch (error) {
      return res.status(500).json({ msg: "Server error." });
    }
  }

  async getPostsWithVotes(posts) {
    const postsWithVotes = [];
    for (let p of posts) {
      const result = await models.Vote.findAll({ where: { post_id: p.id } });
      p.dataValues.votes = result;
      postsWithVotes.push(p);
    }

    return postsWithVotes;
  }

  async getVotes(req, res) {
    const postId = req.params.id;
    const allVotes = await models.Vote.findAll({
      where: { post_id: postId },
    });
    // console.log(allVotes)
    let count = 0;
    for (const vote of allVotes) {
      if (vote.type === "downvote") count--;
      if (vote.type === "upvote") count++;
    }

    return res.status(200).json({total: allVotes.length, count: count});
  }
}
const postService = new PostService();
export { postService, PostService };