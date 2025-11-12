import { Op, Sequelize } from 'sequelize';
import models, { sequelize } from '../../models/index.js';
const { users } = models;
import bcrypt from 'bcrypt';
import { ROLE } from '../../config/constants.js';
import postService from '../post/postService.js';
import orderDetailService from '../order/orderDetailService.js';
import userReviewService from './userReviewService.js';

const getUsers = async ({ page = 1, limit = 10, search = "", hasPackage, sort = "DESC", isLocked }) => {

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new Error('Invalid query parameters');
    }

    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
        const escapedSearch = sequelize.escape(`%${search}%`);
        whereCondition[Op.and] = sequelize.literal(
            `(users.display_name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE ${escapedSearch})`
        );
    }

    if (hasPackage === "true") {
        whereCondition.package_id = {
            [Op.ne]: null
        };
    } else if (hasPackage === "false") {
        whereCondition.package_id = null;
    }

    if (isLocked === "true") {
        whereCondition.is_locked = true;
    } else if (isLocked === "false") {
        whereCondition.is_locked = false;
    }

    const order = [['create_at', sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']];

    const {
        count, rows
    } = await users.findAndCountAll({
        where: whereCondition,
        offset,
        limit,
        raw: true,
        order
    });

    for (const user of rows) {
        const {
            count,
            totalRating
        } = await getUserRatingCount(user.id);
        user.rating_count = count;
        user.total_rating = totalRating;
    }


    return {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        users: rows
    }
};
const getUser = async (id) => {
    const data = await users.findByPk(id, { raw: true });
    if (data) {
        const { count, totalRating } = await getUserRatingCount(data.id);
        data.rating_count = count;
        data.total_rating = totalRating;
    }
    return data;
};

const getUsersByRole = async (roleId) => {
    const data = await users.findAll({
        where: {
            role_id: roleId,
        },
    });
    return data;
};

const getUserByEmail = async (emailUser) => {
    const data = await users.findOne({
        where: {
            email: emailUser,
        },
    });
    return data;
};

const getUserByPhone = async (phoneUser) => {
    const data = await users.findOne({
        where: {
            phone: phoneUser,
        },
    });
    return data;
};

const createUser = async ({ display_name, email, phone, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await users.create({
        display_name,
        email,
        phone,
        password: hashedPassword,
    });
    return data;
};

const createStaff = async ({ display_name, email, phone }) => {
    const data = await users.create({
        display_name: display_name || '',
        email,
        phone,
        password: '',
        role: ROLE.STAFF,
    });
    return data;
};

const deposit = async (userId, amount, options) => {
    const user = await users.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.balance += amount;
    await user.save({ ...options });
    return user;
};

const withdraw = async (userId, amount, options) => {
    const user = await users.findByPk(userId);
    if (!user) throw new Error('User not found');
    user.balance -= amount;
    await user.save({ ...options });
    return user;
};

const updateUser = async (id, { display_name, email, phone, avatar }) => {
    const data = await users.update(
        {
            display_name,
            email,
            phone,
            avatar,
            update_at: Sequelize.literal('GETDATE()'),
        },
        {
            where: {
                id,
            },
        }
    );
    return data;
};

const checkPassword = async (id, { password }) => {
    const data = await users.findByPk(id);
    if (!data) {
        return false;
    }
    const isMatch = await bcrypt.compare(password, data.password);
    return isMatch;
};

const updatePassword = async (id, { password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await users.update(
        {
            password: hashedPassword,
            update_at: Sequelize.literal('GETDATE()'),
        },
        {
            where: {
                id,
            },
        }
    );
    return data;
};

const getExpiredPackageUsers = async () => {
    const data = await users.findAll({
        include: ['package'],
        where: {
            [Op.and]: [
                { package_start: { [Op.ne]: null } },
                { '$package.duration$': { [Op.ne]: null } },
                Sequelize.literal('DATEADD(day, package.duration, package_start) < GETDATE()'),
            ],
        },
    });
    return data;
};

const updatePackage = async (user_id, { package_id }) => {
    const data = await users.update(
        {
            package_id,
            package_start: Sequelize.literal('GETDATE()'),
        },
        {
            where: {
                id: user_id,
            },
        }
    );
    return data;
};

const lockAccount = async (user_id) => {
    const data = await users.update(
        {
            is_locked: 1,
        },
        {
            where: {
                id: user_id,
            },
        }
    );
    return data;
};

const unLockAccount = async (user_id) => {
    const data = await users.update(
        {
            is_locked: 0,
        },
        {
            where: {
                id: user_id,
            },
        }
    );
    return data;
};

const is_locked = async (user_id) => {
    const user = await users.findByPk(user_id);
    if (!user) throw new Error('User not found');
    return user.is_locked;
};

const getUserRating = async (user_id) => {
    const posts = await postService.getByUserId(user_id);
    let totalRating = 0;
    let ratingCount = 0;
    for (const post of posts) {
        const orderDetails = await orderDetailService.getByPostId(post.id);
        for (const orderDetail of orderDetails) {
            const review = await userReviewService.getByOrderDetailId(orderDetail.id);
            if (review) {
                totalRating += review.rating_value;
                ratingCount += 1;
            }
        }
    }
    return ratingCount > 0 ? totalRating / ratingCount : 0;
};

const getUserRatingCount = async (user_id) => {
    const posts = await postService.getByUserId(user_id);
    let count = 0;
    let totalRating = 0;
    for (const post of posts) {
        const userReview = await orderDetailService.getRatingByPost(post.id);
        if (userReview) {
            console.log(userReview[0]?.rating_value);
            count += 1;
            totalRating += userReview[0]?.rating_value || 0;
        }
    }
    return { count, totalRating };
};

const getPublicInfo = async (user_id) => {
    const data = await users.findByPk(user_id, {
        attributes: ['id', 'display_name', 'email', 'phone', 'avatar', 'role'],
    });
    return data;
}

export default {
    getUsers,
    getUser,
    getUsersByRole,
    getUserByEmail,
    getUserByPhone,
    createUser,
    createStaff,
    deposit,
    updateUser,
    updatePassword,
    checkPassword,
    updatePackage,
    getPublicInfo,
    lockAccount,
    unLockAccount,
    is_locked,
    getUserRating,
    getUserRatingCount,
    getExpiredPackageUsers,
    withdraw,
};
