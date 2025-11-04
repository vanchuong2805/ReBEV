import models from '../../models/index.js';
const { users, posts, transactions } = models;

const getStatistics = async (year) => {

    //If no year is passed, defaults to current
    const targetYear = year || new Date().getFullYear();

    const startDate = new Date(`${targetYear}-01-01T00:00:00Z`);
    const endDate = new Date(`${targetYear}-12-31T23:59:59Z`);

    const totalUsers = await users.count();

    const totalPosts = await posts.count();

    const totalTransactions = await transactions.count();

    return {
        totalUsers,
        totalPosts,
        totalTransactions
    };
}

export default getStatistics;