import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './cronJobs/autoTransfer.js';
import postService from './services/post/postService.js';
import orderService from './services/order/orderService.js';

postService.getCartItem(23);
async function run() {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
    app.use('/api', router);
    app.listen(PORT, () => {
        console.log(`App is running. http://localhost:${PORT}`);
    });
}

run();
