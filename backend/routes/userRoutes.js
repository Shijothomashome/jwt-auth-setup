import express from 'express';
import authenticateToken from '../middlewares/auth.js';
import { listUserController } from '../controllers/userController.js';
const userRouter = express.Router();

// @desc List all users
// @route GET /api/v1/users
// @access Private
userRouter.get('/', authenticateToken, listUserController);

export default userRouter;