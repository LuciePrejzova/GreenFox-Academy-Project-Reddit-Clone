import models from "../models/index.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";
import { validationUtils } from "../utils/validationUtils.js";
import { sequelize } from "../models/index.js";

class ChannelService {
  async findOneChannel(req, res) {
    if (validationUtils.isValidString(req.params.channelName)) {
      try {
        const channel = await models.Channel.findOne({
          where: { channelName: req.params.channelName },
        });
        if (channel !== null) {
          res.status(200).json(channel);
        } else {
          res.status(404).json({ error: "Not found." });
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res.status(400).json({ error: "Missing header or incorrect path." });
    }
  }

  async getAllChannelPosts(req, res) {
    const countObj = req.query.count;

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

    let field = req.query.field; //field
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

    let channelName = req.params.channelName;
    if (channelName == null) {
      return res
        .status(400)
        .json({ error: "The channelName property cannot be empty!" });
    } else if (
      (await models.Channel.findOne({
        where: {
          name: req.params.channelName,
        },
      })) == null
    ) {
      return res.status(404).json({
        error: `Channel by the name: ${req.params.channelName}; doesn't exist!`,
      });
    }

    let response = {};

    try {
      const channel = await models.Channel.findOne({
        where: { name: req.params.channelName },
      });
      const id = channel.id;
      //add count property to response yes/no
      if (countObj == "true") {
        let count = {
          count: await models.Post.count({
            where: {
              channel_id: id,
            },
          }),
        };
        Object.assign(response, count);

        if (req.query.offSet == null && req.query.limit == null) {
          //only /posts
          let fullList = {
            posts: await models.Post.findAll({
              where: {
                channel_id: id,
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
                  channel_id: id,
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
                  channel_id: id,
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
                channel_id: id,
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
        return res.send(response);
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async findAllChannels(req, res) {
    const count = req.query.count || "false";
    const order = req.query.order || "desc";
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const field = req.query.field || "createdAt";

    try {
      const allChannels = await models.Channel.findAll({
        where: {
          status: true,
        },
        limit: 100,
      });

      if (
        !validationUtils.isValidNumber(offset) ||
        !validationUtils.isValidNumber(limit) ||
        !validationUtils.isValidFieldInChannel(field) ||
        !validationUtils.isValidCountValue(count) ||
        !validationUtils.isValidOrderValue(order)
      ) {
        res.status(400).json({ error: "Missing header or incorrect path." });
      }

      if (field === "post") {
        // the result gets channel_id and the count of how many times its assigned to a post
        const [results, metadata] = await sequelize.query(
          "SELECT ch.id as channel_id, COUNT(p.id) as count FROM posts as p RIGHT JOIN channels as ch ON p.channel_id=ch.id WHERE ch.status=1 GROUP BY ch.id ORDER BY count DESC"
        );
        
        //getting each channel_id from result array and finding the corresponding channel
        let response = [];
        for (let index = 0; index < allChannels.length; index++) {
          const element = results[index].channel_id;
          const channel = await models.Channel.findOne({
            where: { id: element },
          });
          if (response.length < limit) {
            response.push(channel);
          }
        }

        if (response.length <= 0) {
          return res.status(404).json({ error: "No channels found" });
        } else {
          return res.status(200).json(response);
        }
      }

      if (count == "false") {
        if (order == "desc") {
          const channelsDesc = await this.findChannelsDesc(
            offset,
            limit,
            field
          );
          if (channelsDesc !== null) {
            res.status(200).json(channelsDesc);
          } else res.status(404).json({ error: "Not found" });
        } else if (order == "asc") {
          const channelAsc = await this.findChannelsAsc(offset, limit, field);
          if (channelAsc !== null) {
            res.status(200).json(channelAsc);
          } else res.status(404).json({ error: "Not found" });
        }
      } else if (count == "true") {
        if (order == "desc") {
          const channelsDesc = await this.findChannelsDesc(
            offset,
            limit,
            field
          );
          if (channelsDesc !== null) {
            res.status(200).json({
              count: allChannels.length,
              channels: channelsDesc,
            });
          } else res.status(404).json({ error: "Not found" });
        } else if (order == "asc") {
          const channelAsc = await this.findChannelsAsc(offset, limit, field);
          if (channelAsc !== null) {
            res.status(200).json({
              count: allChannels.length,
              channels: channelAsc,
            });
          } else res.status(404).json({ error: "Not found" });
        }
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }

  async findChannelsAsc(offset, limit, field) {
    const channelsAsc = await models.Channel.findAll({
      where: { status: 1 },
      offset: offset,
      limit: limit,
      order: [[field, "ASC"]],
    });
    return channelsAsc;
  }

  async findChannelsDesc(offset, limit, field) {
    const channelsDesc = await models.Channel.findAll({
      where: { status: 1 },
      offset: offset,
      limit: limit,
      order: [[field, "DESC"]],
    });
    return channelsDesc;
  }

  async findChannelByChannelName(channelNameToCheck) {
    let channel = await models.Channel.findOne({
      where: { slug: channelNameToCheck, status: 1 },
    });
    return channel;
  }

  async findChannelByName(nameToCheck) {
    let channel = await models.Channel.findOne({
      where: { name: nameToCheck, status: 1 },
    });
    return channel;
  }

  async findChannelById(channelId) {
    let channel = await models.Channel.findOne({
      where: { id: channelId },
    });
    return channel;
  }

  async findDeletedChannelBySlug(channelName) {
    return await models.Channel.findOne({
      where: {
        slug: channelName,
        status: 0,
      },
    });
  }

  async findDeletedChannelByTitle(channelTitle) {
    return await models.Channel.findOne({
      where: {
        slug: channelTitle,
        status: 0,
      },
    });
  }

  async createChannel(req, res) {
    let authorId = req.userId; //get the logged in user ID

    //check the req body for all the required input
    if (!req.body.name) {
      return res.status(400).send({
        error: "Channel name is missing!",
      });
    }

    if (!req.body.channelName) {
      return res.status(400).send({
        error: "r/slug is missing!",
      });
    }

    if (!req.body.backgroundImage) {
      return res.status(400).send({
        error: "Channel background image is missing!",
      });
    }

    if (!req.body.description) {
      return res.status(400).send({
        error: "Channel description is missing!",
      });
    }

    //Check that slug is only alphanumeric
    if (!validationUtils.onlyLettersAndNumbers(req.body.channelName)) {
      return res.status(400).send({
        error: "Channel name can only be alphanumeric",
      });
    }

    //Check for duplicated slugs in db
    if (
      (await this.findChannelByChannelName(req.body.channelName)) != undefined
    ) {
      return res.status(409).send({
        error: "ChannelName already existing, please pick a new one!",
      });
    }

    //Check for duplicated name in db
    if ((await this.findChannelByName(req.body.name)) != undefined) {
      return res.status(409).send({
        error: "Channel name already existing, please pick a new one!",
      });
    }
    //check for soft deleted channel and if exists update it accordingly
    if (
      (await this.findDeletedChannelBySlug(req.body.channelName)) ||
      (await this.findDeletedChannelByTitle(req.body.name))
    ) {
      await models.Channel.update({
        name: req.body.name,
        channelName: req.body.channelName,
        backgroundImage: req.body.backgroundImage,
        description: req.body.description,
        author_id: authorId,
        status: 1
      },
      {where: {
        channelName: req.body.channelName
      }})
      return res.status(201).send({
        message: "Channel was created!",
      });
    }

    //build the channel from the provided info
    await models.Channel.build({
      name: req.body.name,
      channelName: req.body.channelName,
      backgroundImage: req.body.backgroundImage,
      description: req.body.description,
      author_id: authorId,
    }).save(); //save to db
    //success message
    return res.status(201).send({
      message: "Channel was created!",
    });
  }

  async updateChannel(res, req) {
    let author = await findByUserName(req);
    let authorId = author.id;

    //find the channel by its unique channelName
    let channel = await models.Channel.findOne({
      where: { channelName: req.params.channelName },
    });

    //if doesn't exist
    if (channel == undefined) {
      res.status(404).json({ error: "Channel not found." });
    }

    //if the channel belongs to a different person than the currently logged in
    if (channel.author_id != authorId) {
      if (!author.isAdmin) {
        res
          .status(400)
          .json({ error: "Logged in user is not the channel's owner!" });
      }
    }
    //check channelName uniqueness
    let channelExists = await models.Channel.findOne({
      where: {
        channelName: req.body.channelName,
      },
    });
    if (channelExists != undefined) {
      return res
        .status(400)
        .json({ error: "Channel with this channelName already exists" });
    }

    //if the newAuthorId property is passed in the request body, find the new author
    if (req.body.newAuthorId != null) {
      let newAuthor = await User.findOne({
        where: { id: req.body.newAuthorId },
      });
      //if new author doesn't exist
      if (newAuthor == undefined) {
        res
          .status(400)
          .json({ error: "Cannot pass channel ownership to this user" });
      } else {
        //else pass on the ownership
        await models.Channel.update(
          {
            author_id: req.body.newAuthorId, //change the required param
          },
          {
            where: { channelName: req.params.channelName }, //for a channel with the unique channelName
          }
        );
      }

      //if the description property is passed in the request body, update accordingly
      if (req.body.description != null) {
        await models.Channel.update(
          {
            description: req.body.description,
          },
          {
            where: { channelName: req.params.channelName },
          }
        );
      }
      //if the backgroundImage property is passed in the request body, update accordingly
      if (req.body.backgroundImage != null) {
        await models.Channel.update(
          {
            backgroundImage: req.body.backgroundImage,
          },
          {
            where: { channelName: req.params.channelName },
          }
        );
      }
      //if the title property is passed in the request body update accordingly
      if (req.body.title != null) {
        await models.Channel.update(
          {
            title: req.body.title,
          },
          {
            where: { channelName: req.params.channelName },
          }
        );
      }
      //return a confirmation if all conditions are passed and channel got updated
      res.status(200).json({ message: "Channel sucessfully updated!" });
    }
  }
  async deleteChannel(req, res) {
    try {
      let channelToDelete = await models.Channel.findOne({
        where: {
          channelName: req.params.channelName,
        },
      });

      if (channelToDelete == undefined) {
        return res.status(404).json({ message: "Channel not found" });
      }
      console.log(channelToDelete.id);

      let channelIsEmpty = await models.Post.findAll({
        where: {
          channel_id: channelToDelete.id,
          is_active: 1,
        },
      });

      if (channelIsEmpty.length <= 0) {
        await models.Channel.update(
          { status: 0 },
          {
            where: {
              channelName: channelToDelete.channelName,
            },
          }
        );
        return res.status(200).json("Delete succesful.");
      } else {
        return res.status(403).json("Couldn't complete: channel is not empty");
      }
    } catch (error) {
      return res.status(500).json("Server error");
    }
  }
}
const channelService = new ChannelService();
export { channelService, ChannelService };
