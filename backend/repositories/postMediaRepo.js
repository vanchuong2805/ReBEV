import initPostMedia from '../models/post_media.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const postMedia = initPostMedia(sequelize, DataTypes);

export default postMedia;
