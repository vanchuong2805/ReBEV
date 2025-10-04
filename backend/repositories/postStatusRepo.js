import initPostStatus from '../models/post_status.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const postStatus = initPostStatus(sequelize, DataTypes);

export default postStatus;
