import express from 'express';
import { loginController, logoutController, refreshController, registerController } from '../controllers/authControllers.js'
const authrouter = express.Router();

// @desc Register a new user
// @route POST /api/v1/auth/register
authrouter.post('/register', registerController);

// @desc Login a user
// @route POST /api/v1/auth/login
authrouter.post('/login', loginController);

// @desc Generates new access token
// @route POST /api/v1/auth/refresh
authrouter.post('/refresh', refreshController);

// @desc Logout a user
// @route POST /api/v1/auth/logout
authrouter.post('/logout', logoutController)



export default authrouter;