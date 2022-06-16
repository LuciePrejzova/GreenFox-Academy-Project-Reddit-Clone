"use strict";

import sequelize /*, { createTableForModels }*/ from "../config/index.js";
import getUserModel from "./user.js";
import getChannelModel from "./channel.js";
import getPostModel from "./post.js";
import getMessageModel from "./message.js";
import getSubscriptionModel from "./subscription.js";
import getVoteModel from "./vote.js";
import getCommentModel from "./comment.js";
import Sequelize from "sequelize";
import "regenerator-runtime/runtime.js";

const models = {
  // ORDER IS IMPORTANT (due to relationships between the tables)
  User: getUserModel(sequelize, Sequelize),
  Channel: getChannelModel(sequelize, Sequelize),
  Post: getPostModel(sequelize, Sequelize),
  Message: getMessageModel(sequelize, Sequelize),
  Subscription: getSubscriptionModel(sequelize, Sequelize),
  Vote: getVoteModel(sequelize, Sequelize),
  Comment: getCommentModel(sequelize, Sequelize),
};

// CREATING TABLES IN DATABASE
//createTableForModels(models);

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
