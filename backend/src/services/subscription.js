import models from "../models/index.js";

class SubscriptionService {

async findAllSubscriptions(req) {
  const userId = req.userId;
  return await models.Subscription.findAll({
    where: { isActive: 1, user_id: userId },
  });
}

async createSubscription(channelId, userId) {
  await models.Subscription.build({
    user_id: userId,
    channel_id: channelId,
    isActive: 1,
  }).save();
}

async renewSubscription(subscriptionId) {
  await models.Subscription.update(
    { isActive: 1 },
    {
      where: {
        id: subscriptionId,
      },
    }
  );
}

async leaveSubscriptions(subscriptionId) {
  await models.Subscription.update(
    { isActive: 0 },
    {
      where: {
        id: subscriptionId,
      },
    }
  );
}

async findChannelByName(channelName) {
  return await models.Channel.findOne({
    where: { channelName: channelName },
  });
}

async findSubscriptionByChannelIdAndUserId(channelId, userId) {
  return await models.Subscription.findOne({
    where: { channel_id: channelId, user_id: userId },
  });
}
}

const subscriptionService = new SubscriptionService();
export {subscriptionService, SubscriptionService};
