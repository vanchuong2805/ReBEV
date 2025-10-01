import Users from '../../services/userService.js';
import Roles from '../../services/roleService.js';
import UserContacts from '../../services/userContactService.js';
import Wards from '../../services/wardService.js';

const userResolver = {
    Query: {
        users: Users.getUsers,
        user: (_, { id }) => Users.getUser(id),
        roles: Roles.getRoles,
        role: (_, { id }) => Roles.getRole(id),
        userContacts: UserContacts.getUserContacts,
        userContact: (_, { id }) => UserContacts.getUserContact(id),
    },
    User: {
        role: (parent) => Roles.getRole(parent.role_id),
    },

    Role: {
        users: (parent) => Users.getUsersByRole(parent.id),
    },
    UserContact: {
        ward: (parent) => Wards.getWard(parent.ward_id),
    },
};

export default userResolver;
