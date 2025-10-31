import { Sequelize } from 'sequelize';
import models from '../../models/index.js';
const { users } = models;
import bcrypt from 'bcrypt';
import { ROLE } from '../../config/constants.js';
import postService from '../post/postService.js';
import orderDetailService from '../order/orderDetailService.js';
import userReviewService from './userReviewService.js';

const getUsers = async () => {
    const data = await users.findAll({ raw: true });
    for (const user of data) {
        const { count, totalRating } = await getUserRatingCount(user.id);
        user.rating_count = count;
        user.total_rating = totalRating;
    }

    return data;
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


const createUser = async ({
    display_name,
    email,
    phone,
    password
}) => {

    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await users.create({
        display_name,
        email,
        phone,
        password: hashedPassword,
    });
    return data;
};

const createStaff = async ({
    display_name,
    email,
    phone
}) => {
    const data = await users.create({
        display_name: display_name || "",
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

const updateUser = async (id, { display_name, email, phone }) => {
    const data = await users.update({
        display_name,
        email,
        phone,
        update_at: Sequelize.literal('GETDATE()')
    }, {
        where: {
            id
        }
    });
    return data;
};

const checkPassword = async (id, {
    password
}) => {
    const data = await users.findByPk(id)
    if (!data) {
        return false;
    }
    const isMatch = await bcrypt.compare(password, data.password);
    return isMatch;
}

const updatePassword = async (id, {
    password
}) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await users.update({
        password: hashedPassword,
        update_at: Sequelize.literal('GETDATE()')
    }, {
        where: {
            id
        }
    });
    return data;
}

const updatePackage = async (user_id, {
    package_id
}) => {
    const data = await users.update({
        package_id,
        package_start: Sequelize.literal('GETDATE()')
    }, {
        where: {
            id: user_id
        }
    });
    return data;
}

const lockAccount = async (user_id) => {
    const data = await users.update({
        is_locked: 1
    }, {
        where: {
            id: user_id
        }
    });
    return data;
}

const unLockAccount = async (user_id) => {
    const data = await users.update({
        is_locked: 0
    }, {
        where: {
            id: user_id
        }
    });
    return data;
}

const is_locked = async (user_id) => {
    const user = await users.findByPk(user_id);
    if (!user) throw new Error('User not found');
    return user.is_locked;
}

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
}

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
    lockAccount,
    unLockAccount,
    is_locked,
    getUserRating,
    getUserRatingCount
};
