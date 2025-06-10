import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { pool } from "../config/db.js";
import { generateAccessToken, generateRefrehToken } from "../config/utils.js";

const registerController = async (req, res) => {

    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users(name, email, password) values(?, ?, ?)', [name, email, hashedPassword]);
        console.log('result', result)
        res.status(201).json({
            success: 'true',
            message: 'User created successfully.',
            data: { id: result.insertId, email }
        });
    } catch (error) {
        console.error('Registration failed', error);
        res.status(500).json({
            success: 'false',
            message: 'Registration failed.'
        })
    }
}
const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [row] = await pool.query('SELECT * FROM users where email = ?', [email]);
        const user = row[0];
        if (!user) {
            return res
                .status(404)
                .json({
                    success: 'false',
                    message: 'User not found',
                });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res
                .status(400)
                .json({
                    success: 'false',
                    message: 'Invalid credentials.'
                });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefrehToken(user);

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            })
            .cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false,
                sameSite: 'strict',
                path: '/',
                maxAge: 1 * 60 * 1000 // 15 minutes
            })
            .json({
                success: 'true',
                message: 'Log in success',
                user
            })
    } catch (error) {
        console.error('Login failed.', error);
        res.status(500).json({
            success: 'false',
            message: 'Login failed.'
        })
    }
}
// API for generating new access token by checking if the refresh token is valid or not
const refreshController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        // console.log('req.cookies', req.cookies);
        // console.log('refreshToken', refreshToken);
        if (!refreshToken) {
            return res
            .clearCookie('refreshToken', { path: '/' })
                .status(401)
                .json({
                    success: 'false',
                    message: 'Unauthorized.'
                });
        };
        jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
            if (err) {
                return res
                .clearCookie('refreshToken', { path: '/' })
                    .status(403)
                    .json({
                        success: 'false',
                        message: 'Token invalid or expired.'
                    });
            }

            const accessToken = generateAccessToken(user);
            return res
                .status(200)
                .cookie('accessToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production' ? true : false,
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 1 * 60 * 1000
                })
                .json({
                    success: 'true',
                    message: 'Access Token generated successfully.',
                });
        })
    } catch (error) {
        console.error('Access Token generation failed.', error);
        res.status(500)
            .json({
                success: 'false',
                message: 'Access Token generation failed.'
            });

    }
}
const logoutController = (req, res) => {

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict',
        path: '/refresh'
        // No need to include maxAge since we're clearing the cookie
    });
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: 'strict',
        path: '/'
        // No need to include maxAge since we're clearing the cookie
    });
    res.status(200)
        .json({
            success: 'true',
            message: 'Logged out successfully.'
        });
}

export { registerController, loginController, refreshController, logoutController };