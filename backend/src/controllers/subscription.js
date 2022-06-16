import {subscriptionService} from "../services/subscription.js";
import 'regenerator-runtime/runtime.js'


class SubscriptionController {
  constructor(subscriptionService){
    this.subscriptionService = subscriptionService;
  }
showSubscriptions = async (req, res) => {
  try {
    const allSubscriptions = await subscriptionService.findAllSubscriptions(req);
    if (allSubscriptions == null) {
      return res.status(404).json({ error: "No subscription found." });
    } else {
      return res.status(200).json(allSubscriptions);
    }
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};

subscribe = async (req, res) => {
  const userId = req.userId;
  const channelName = req.params.channelName;
  try {
    if (userId == null) {
      return res
        .status(400)
        .json({ error: "Missing user id / User not logged in." });
    }

    const existingChannel = await subscriptionService.findChannelByName(channelName);
    if (existingChannel == null || undefined) {
      return res.status(404).json({ error: "Channel does not exist." });
    }

    const existingSub = await subscriptionService.findSubscriptionByChannelIdAndUserId(
      existingChannel.id,
      userId
    );

    if (existingSub != null && existingSub.isActive == 1) {
      return res.status(400).json({ error: "Subscription already exists" });
    } else if (existingSub != null && existingSub.isActive == 0) {
      await subscriptionService.renewSubscription(existingSub.id);
      return res.status(200).json({ msg: "Subscription successful." });
    } else {
      await subscriptionService.createSubscription(existingChannel.id, userId);
      return res.status(201).json({ msg: "Subscription successful." });
    }
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};

unsubscribe = async (req, res) => {
  const userId = req.userId;
  const channelName = req.params.channelName;
  try {
    if (userId == null) {
      return res
        .status(400)
        .json({ error: "Missing user id / User not logged in." });
    }

    const existingChannel = await subscriptionService.findChannelByName(channelName);
    if (existingChannel == null || undefined) {
      return res.status(404).json({ error: "Channel does not exist." });
    }

    const existingSub = await subscriptionService.findSubscriptionByChannelIdAndUserId(
      existingChannel.id,
      userId
    );

    if (existingSub == null) {
      return res.status(404).json({ error: "Subscription does not exist." });
    } else {
      await subscriptionService.leaveSubscriptions(existingSub.id);
      return res.status(200).json({ msg: "Unsubscribe complete" });
    }
  } catch (error) {
    return res.status(500).json({ error: "server error" });
  }
};
}

const subscriptionController = new SubscriptionController(subscriptionService);
export { subscriptionController,  SubscriptionController };
