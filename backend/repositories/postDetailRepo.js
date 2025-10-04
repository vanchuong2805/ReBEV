import initPostDetail from '../models/post_detail.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const postDetail = initPostDetail(sequelize, DataTypes);

export default postDetail;
