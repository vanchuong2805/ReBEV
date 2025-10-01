import initUserContact from '../models/user_contacts.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';
const userContacts = initUserContact(sequelize, DataTypes);

export default userContacts;
