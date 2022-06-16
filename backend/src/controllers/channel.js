
import 'regenerator-runtime/runtime.js'
import { channelService } from "../services/channel.js";

class ChannelController {
  constructor(channelService) {
    this.channelService = channelService;
  }

  showChannel = async (req, res) => {
    channelService.findOneChannel(req, res);
  };

  getAllPosts = async (req, res) => {
    channelService.getAllChannelPosts(req, res);
  };

  showAllChannels = async (req, res) => {
    channelService.findAllChannels(req, res);
  };
  
  updateOneChannel = async (req, res) => {
    channelService.updateChannel(req,res);
  };
  
  createAChannel = async (req, res) => {
    channelService.createChannel(req,res);
  };

  deleteChannel = async (req, res) => {
    channelService.deleteChannel(req, res);
  }
  
}

const channelController = new ChannelController();
export { channelController, ChannelController };

