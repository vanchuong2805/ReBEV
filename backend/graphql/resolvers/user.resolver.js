import Users from '../../repositories/userRepo.js';

const userResolver = {
    Query: {
        users: Users.getAllUsers,
        user: (_, { id }) => Users.getUserByID(id),
        roles: Users.getAllRoles,
        role: (_, { id }) => Users.getRoleByID(id),
    },
    User: {
        role: (parent) => Users.getRoleByID(parent.role_id),
    },

    Role: {
        users: (parent) => Users.getUsersByRole(parent.id),
    },
};

export default userResolver;
