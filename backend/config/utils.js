import jwt from 'jsonwebtoken';

const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefrehToken = (user) => {
    return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
};

export { generateAccessToken, generateRefrehToken };