import initCategory from '../models/categories.js';
import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

const categories = initCategory(sequelize, DataTypes);

export default categories;
