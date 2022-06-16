import { Router } from 'express';
import {authenticateJwtToken} from "../middleware/authMiddleware.js";
import { subscriptionController } from '../controllers/subscription.js';


const subscriptionRouter = Router();

 subscriptionRouter.post('/:channelName', authenticateJwtToken, subscriptionController.subscribe);

 subscriptionRouter.delete('/:channelName', authenticateJwtToken, subscriptionController.unsubscribe);

subscriptionRouter.get('/', authenticateJwtToken, subscriptionController.showSubscriptions);

export default subscriptionRouter;


