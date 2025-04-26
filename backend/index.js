import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use('/api/v1/auth', authRouter );
app.use('/api/v1/users', userRouter);


testConnection();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`✅ Server is started running on ${PORT}`));
