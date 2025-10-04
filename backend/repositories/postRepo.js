import initPost from '../models/posts.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const post = initPost(sequelize, DataTypes);

export default post;
