import jwt from 'jsonwebtoken';
import redis from '../../config/redis.js';

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

const createRefreshToken = async (payload) => {
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    await redis.set(`refresh_token:${payload.userId}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
    return refreshToken;
};

export const verifyAccessToken = async (token) => {
    const isBlacklisted = await redis.get(`blacklist_token:${token}`);
    if (isBlacklisted) {
        throw new Error('Token is blacklisted');
    }
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

export const verifyRefreshToken = async (userId, token) => {
    const storedToken = await redis.get(`refresh_token:${userId}`);
    if (!storedToken) {
        throw new Error('No refresh token found');
    }
    if (storedToken !== token) {
        throw new Error('Invalid refresh token');
    }
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const logout = async (userId, accessToken) => {
    if (accessToken) {
        const decoded = jwt.decode(accessToken);
        if (decoded && decoded.exp) {
            const ttl = decoded.exp - Math.floor(Date.now() / 1000);
            if (ttl > 0) {
                await redis.set(`blacklist_token:${accessToken}`, 'true', 'EX', ttl);
            }
        }
    }
    if (userId) {
        await redis.del(`refresh_token:${userId}`);
    }
};

export default {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    logout,
};
