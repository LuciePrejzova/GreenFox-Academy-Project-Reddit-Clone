import models from "../models/index.js";

class VoteService {
  async vote(req, res) {
    const userId = req.userId;
    const postId = req.params.id;
    const type = req.body.type;

    const existingVote = await this.findVoteByUserAndPost(userId, postId);

    try {
      if (existingVote && existingVote.status === 1 && existingVote.type === type) {
        return res.status(409).json({ error: "Vote already exists." });
      }

      if (existingVote && type === "remove_vote") {
        await this.removeVote(userId, postId, type);
        return res.status(200).json({ msg: "Vote removed successfully." });
      }

      if (!existingVote && type === "remove_vote") {
        return res.status(409).json({ msg: "Vote doesnt exist." });
      }
      //if the vote exists and its type is different or if it was removed before, then update
      if (existingVote && (existingVote.type != type || existingVote.status === 0)) {
        await this.updateVote(userId, postId, type);
        return res.status(200).json({ msg: "Vote updated successfully." });
      } else {
        await this.createVote(userId, postId, type);
        return res.status(200).json({ msg: "Vote created" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Server error" });
    }
  }

  async findVoteByUserAndPost(userId, postId) {
    return await models.Vote.findOne({
      where: { user_id: userId, post_id: postId },
    });
  }

  async createVote(userId, postId, type) {
    await models.Vote.build({
      type: type,
      status: 1,
      user_id: userId,
      post_id: postId,
    }).save();
  }

  async removeVote(userId, postId) {
    await models.Vote.update(
      { status: 0 },
      {
        where: {
          user_id: userId,
          post_id: postId,
        },
      }
    );
  }

  async updateVote(userId, postId, type) {
    await models.Vote.update(
      { type: type, status: 1 },
      {
        where: {
          user_id: userId,
          post_id: postId,
        },
      }
    );
  }
}

const voteService = new VoteService();
export { voteService, VoteService };
