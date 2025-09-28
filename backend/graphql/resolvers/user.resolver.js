import Users from '../../repositories/userRepo.js';

const userResolver = {
    Query: {
        users: Users.getAllUsers,
    },
};

export default userResolver