import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './cronJobs/autoTransfer.js';



async function run() {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    const app = express();
    app.use(express.json());
    app.use(
        cors({
            origin: ['http://localhost:5173', 'https://re-bev.vercel.app'],
            credentials: true,
        })
    );
    app.use(cookieParser());
    app.use('/api', router);
    app.listen(PORT, () => {
        console.log(`App is running. http://localhost:${PORT}`);
    });
}

run();
